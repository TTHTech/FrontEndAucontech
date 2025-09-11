import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.tsx";

export const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div className="p-6 text-gray-600">Loading…</div>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
};
