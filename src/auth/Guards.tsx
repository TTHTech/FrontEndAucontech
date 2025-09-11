import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { token, loading } = useAuth();
    const loc = useLocation();
    if (loading) return <div>Loading...</div>;
    if (!token) return <Navigate to="/login" state={{ from: loc }} replace />;
    return children;
};

export const RequireRole: React.FC<{ role: "ROLE_ADMIN" | "ROLE_USER"; children: JSX.Element }> = ({ role, children }) => {
    const { me, loading } = useAuth();
    const loc = useLocation();
    if (loading) return <div>Loading...</div>;
    if (!me) return <Navigate to="/login" state={{ from: loc }} replace />;

    if (role === "ROLE_ADMIN" && me.role !== "ROLE_ADMIN")
        return <Navigate to="/403" replace />;
    return children;
};
