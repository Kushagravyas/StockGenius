/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateProfile, resetPassword, deleteUser } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchUser } from "@/store/slices/authSlice";
import { useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar || "https://placehold.co/600x400?text=avatar"
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Add this useEffect to fetch user data on mount
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (isMounted && !user) {
          await dispatch(fetchUser());
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [dispatch, user]);

  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, [user?.avatar]);

  // Update initial values to handle loading state
  const profileForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: loading ? "" : user?.name || "",
      email: loading ? "" : user?.email || "",
      avatar: null,
      editingName: false,
      editingEmail: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      if (values.avatar) {
        formData.append("avatar", values.avatar);
      }
      await dispatch(updateProfile(formData));
    },
  });

  // Password Reset Form
  const passwordForm = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      await dispatch(resetPassword(values));
      passwordForm.resetForm();
    },
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      profileForm.setFieldValue("avatar", file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      await dispatch(deleteUser());
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
        className="max-w-4xl mx-auto bg-muted rounded-2xl shadow-2xl p-8 space-y-12"
      >
        {/* Profile Section */}
        <motion.section variants={fadeUp} className="space-y-6">
          <h2 className="text-3xl font-bold gradient-text">Profile Information</h2>
          <form onSubmit={profileForm.handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.img
                  src={avatarPreview}
                  alt="Profile Avatar"
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-primary/50 hover:ring-primary/80 hover:shadow-lg transition-all duration-300"
                  key={avatarPreview}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <label
                  htmlFor="avatar"
                  className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/90"
                >
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    className="hidden"
                    onChange={handleAvatarChange}
                    accept="image/*"
                  />
                  <span className="text-xs text-muted">Edit</span>
                </label>
              </motion.div>

              <div className="flex-1 space-y-4 w-full">
                <div className="flex items-center gap-2">
                  <Input
                    label="Name"
                    id="name"
                    name="name"
                    placeholder={loading ? "Loading..." : user?.name}
                    value={profileForm.values.name}
                    onChange={profileForm.handleChange}
                    error={profileForm.touched.name && profileForm.errors.name}
                    className="bg-gray-900 text-white border border-gray-700 placeholder:text-gray-300 text-lg"
                    disabled={!profileForm.values.editingName}
                  />
                  <Button
                    type="button"
                    variant="default"
                    onClick={() =>
                      profileForm.setFieldValue(
                        "editingName",
                        !profileForm.values.editingName
                      )
                    }
                    className="px-3 py-1 text-sm text-accent-fg"
                  >
                    {profileForm.values.editingName ? "Save" : "Edit"}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    placeholder={loading ? "Loading..." : user?.email}
                    value={profileForm.values.email}
                    onChange={profileForm.handleChange}
                    error={profileForm.touched.email && profileForm.errors.email}
                    className="bg-gray-900 text-white border border-gray-700 placeholder:text-gray-300 text-lg"
                    disabled={!profileForm.values.editingEmail}
                  />
                  <Button
                    type="button"
                    variant="default"
                    onClick={() =>
                      profileForm.setFieldValue(
                        "editingEmail",
                        !profileForm.values.editingEmail
                      )
                    }
                    className="px-3 py-1 text-sm text-accent-fg"
                  >
                    {profileForm.values.editingEmail ? "Save" : "Edit"}
                  </Button>
                </div>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="gradient"
                className="w-full sm:w-auto text-white"
              >
                Update Profile
              </Button>
            </motion.div>
          </form>
        </motion.section>

        {/* Password Section */}
        <motion.section variants={fadeUp} className="space-y-6">
          <h2 className="text-3xl font-bold gradient-text-alt">Change Password</h2>
          <form onSubmit={passwordForm.handleSubmit} className="space-y-4">
            <Input
              label="Current Password"
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="Current Password"
              value={passwordForm.values.currentPassword}
              onChange={passwordForm.handleChange}
              error={
                passwordForm.touched.currentPassword &&
                passwordForm.errors.currentPassword
              }
              className="bg-gray-900 text-white border border-gray-700 placeholder:text-white"
            />
            <Input
              label="New Password"
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={passwordForm.values.newPassword}
              onChange={passwordForm.handleChange}
              error={passwordForm.touched.newPassword && passwordForm.errors.newPassword}
              className="bg-gray-900 text-white border border-gray-700 placeholder:text-gray-300"
            />
            <Input
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              value={passwordForm.values.confirmPassword}
              onChange={passwordForm.handleChange}
              error={
                passwordForm.touched.confirmPassword &&
                passwordForm.errors.confirmPassword
              }
              className="bg-gray-900 text-white border border-gray-700 placeholder:text-gray-300"
            />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="gradient"
                className="w-full sm:w-auto text-white"
              >
                Change Password
              </Button>
            </motion.div>
          </form>
        </motion.section>

        {/* Delete Account Section */}
        <motion.section variants={fadeUp} className="space-y-4">
          <h2 className="text-3xl font-bold text-destructive">Delete Account</h2>
          <p className="text-muted-fg">
            This action will permanently delete your account and all associated data.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full sm:w-auto text-accent-fg"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </motion.div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
