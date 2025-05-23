/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UsersTable from "@/components/admin/UsersTable";
import { allUsers } from "@/store/slices/adminSlice";
import { motion } from "framer-motion";
import { Users, UserCheck, TrendingUp, Activity, Search, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminPage = () => {
  const dispatch = useDispatch();
  const { users, loading, totalUsers, currentPage } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminCount, setAdminCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [userGrowth, setUserGrowth] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch users when component mounts
  useEffect(() => {
    dispatch(
      allUsers({
        page: 1,
        limit: 10,
        search: searchTerm,
      })
    );
  }, [dispatch, searchTerm]);

  // Calculate metrics
  useEffect(() => {
    if (users.length > 0) {
      const admins = users.filter((user) => user.role === "admin").length;
      setAdminCount(admins);

      // For demo purposes, let's simulate some metrics
      setActiveUsers(Math.floor(totalUsers * 0.75)); // 75% of users are active
      setUserGrowth(12.8); // 12.8% growth
    }
  }, [users, totalUsers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(
      allUsers({
        page: 1,
        limit: 10,
        search: searchTerm,
      })
    );
    setTimeout(() => setIsRefreshing(false), 800); // Add a slight delay for animation
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <Button
            onClick={handleRefresh}
            variant="gradientOutline"
            className="hover:bg-[#35b0ab]/10"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </motion.div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <Card className="bg-card border-[#35b0ab]/10 card-hover overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#35b0ab]/5 rounded-bl-full"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-fg">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <div className="p-2 bg-[#35b0ab]/10 rounded-full">
                    <Users className="h-5 w-5 text-[#35b0ab]" />
                  </div>
                </div>
                <p className="text-xs text-muted-fg mt-2">
                  <span className="text-[#4ecac5]">+{userGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <Card className="bg-card border-secondary/10 card-hover overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/5 rounded-bl-full"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-fg">
                  Admin Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{adminCount}</div>
                  <div className="p-2 bg-secondary/10 rounded-full">
                    <UserCheck className="h-5 w-5 text-secondary" />
                  </div>
                </div>
                <p className="text-xs text-muted-fg mt-2">
                  {((adminCount / totalUsers) * 100).toFixed(1)}% of total users
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <Card className="bg-card border-accent/10 card-hover overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-bl-full"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-fg">
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{activeUsers}</div>
                  <div className="p-2 bg-accent/10 rounded-full">
                    <Activity className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <p className="text-xs text-muted-fg mt-2">
                  {((activeUsers / totalUsers) * 100).toFixed(1)}% active in last 30 days
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <Card className="bg-card border-primary/10 card-hover overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-fg">
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">+{userGrowth}%</div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-fg mt-2">Compared to previous month</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="mb-6 bg-card/30 backdrop-blur-sm p-4 rounded-xl border border-primary/10 shadow-lg"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-fg" />
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 bg-card border-muted hover-float"
            />
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
          <UsersTable
            data={users}
            // Changing boolean(loading) value to sting due to custom HTML attribute should be passed as string
            loading={loading ? "true" : undefined}
            totalUsers={totalUsers}
            currentPage={currentPage}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminPage;
