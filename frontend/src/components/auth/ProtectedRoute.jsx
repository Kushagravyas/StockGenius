import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../ui/Loader";

const ProtectedRoute = () => {
  const { token, loading } = useSelector((state) => state.auth);

  // Show loading state if auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-[100%]">
        <Loader />
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
