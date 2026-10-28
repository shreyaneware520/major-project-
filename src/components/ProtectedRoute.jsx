import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  // On revisit: cached user resolves synchronously, loading is already false.
  // On first cold load: show a minimal spinner only for the brief Firebase auth check.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040F18]">
        <div className="w-10 h-10 rounded-full border-2 border-[#1E2B38] border-t-[#53E97F] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
