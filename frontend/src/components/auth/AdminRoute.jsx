import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../ui/Loader";
import ErrorPage from "@/pages/ErrorPage";

const AdminRoute = () => {
  const { role, loading } = useSelector((state) => state.auth);

  // Show loading state if auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-[100%]">
        <Loader />
      </div>
    );
  }

  // Show error page if user is logged in but not an admin
  if (role && role !== "admin") {
    return <ErrorPage />;
  }

  // Redirect to auth if not logged in
  if (!role) {
    return <Navigate to="/auth" replace />;
  }

  // Render child routes if admin role is found
  return <Outlet />;
};

export default AdminRoute;
