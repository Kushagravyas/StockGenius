/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Table, Select, Popconfirm } from "antd";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { updateRole, deleteUser } from "@/store/slices/adminSlice";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Check, X, Edit2, Trash2, AlertCircle, User, Shield } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { getThemeColors } from "@/theme/antd.config";

const { Option } = Select;

const UsersTable = ({ data = [], loading = false, totalUsers = 0, currentPage = 1 }) => {
  const dispatch = useDispatch();
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  const handleRoleChange = (userId, role) => {
    setSelectedRole(role);
  };

  const saveRoleChange = async (userId) => {
    try {
      await dispatch(updateRole({ userId, role: selectedRole }));
      toast.success("Role updated successfully");
      setEditingUserId(null);
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    setDeletingUserId(userId);
    try {
      await dispatch(deleteUser(userId));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

  const getRoleBadge = (role) => {
    if (role === "admin") {
      return (
        <Badge className="bg-secondary/20 text-secondary border-secondary/20 flex items-center gap-1">
          <Shield className="h-3 w-3" /> Admin
        </Badge>
      );
    }
    return (
      <Badge className="bg-primary/20 text-primary border-primary/20 flex items-center gap-1">
        <User className="h-3 w-3" /> User
      </Badge>
    );
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "index",
      key: "index",
      width: 80,
      render: (text, record, index) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.03 }}
        >
          {index + 1}
        </motion.div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text, record, index) => (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.03 }}
          className="font-medium"
        >
          {text}
        </motion.div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      render: (text, record, index) => (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.03 }}
          className="text-muted-fg"
        >
          {text}
        </motion.div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 150,
      render: (text, record) =>
        editingUserId === record._id ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-card/50 p-1 rounded-md border border-primary/20"
          >
            <Select
              defaultValue={text}
              style={{ width: 120 }}
              onChange={(value) => handleRoleChange(record._id, value)}
              className="hover-float"
              dropdownClassName="bg-card border border-primary/20"
            >
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {getRoleBadge(text)}
          </motion.div>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (text, record) => (
        <div className="flex gap-2">
          {editingUserId === record._id ? (
            <motion.div className="flex gap-2" layout>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => saveRoleChange(record._id)}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-500"
                  size="sm"
                >
                  <Check className="h-4 w-4 mr-1" /> Save
                </Button>
              </motion.div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setEditingUserId(null)}
                  className="bg-muted/20 hover:bg-muted/30 text-muted-fg"
                  size="sm"
                >
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div className="flex gap-2" layout>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setEditingUserId(record._id)}
                  disabled={record._id === editingUserId}
                  className="bg-primary/10 hover:bg-primary/20 text-primary"
                  size="sm"
                >
                  <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Popconfirm
                  title="Delete User"
                  description="Are you sure you want to delete this user?"
                  onConfirm={() => handleDeleteUser(record._id)}
                  okText="Yes"
                  cancelText="No"
                  placement="topRight"
                  icon={<AlertCircle className="h-4 w-4 text-red-500" />}
                >
                  <Button
                    variant="destructive"
                    className="bg-destructive/10 hover:bg-destructive/20 text-destructive"
                    size="sm"
                    loading={deletingUserId === record._id ? "true" : undefined}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </Popconfirm>
              </motion.div>
            </motion.div>
          )}
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-radial from-secondary/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: totalUsers,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} users`,
            className: "text-sm",
          }}
          rowKey="_id"
          scroll={{ x: "100%" }}
          size="middle"
          className={`bg-card rounded-xl shadow-xl overflow-hidden theme-${theme}-table`}
          rowClassName={(record) =>
            `hover:bg-${
              themeColors.borderColor
            }/20 transition-all duration-300 theme-${theme}-row ${
              editingUserId === record._id
                ? `bg-primary/5 theme-${theme}-editing-row`
                : ""
            }`
          }
          onRow={(record) => ({
            className: `cursor-pointer theme-${theme}-table-row`,
          })}
          locale={{
            emptyText: (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <AlertCircle className="h-12 w-12 text-muted-fg mx-auto mb-4 opacity-50" />
                <p className="text-muted-fg">No users found</p>
              </motion.div>
            ),
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default UsersTable;
