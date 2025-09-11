import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.tsx";
import { ProtectedRoute } from "./auth/ProtectedRoute.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Posts from "./pages/Posts.tsx";
import EditPost from "./pages/EditPost.tsx";

/* ====== CHỈ THÊM IMPORT MỚI ====== */
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext.tsx";
import { Toaster } from "react-hot-toast";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import Navbar from "./components/Navbar.tsx";
/* NEW */ import UserForm from "./pages/admin/UserForm.tsx";
/* ================================= */

const AdminGuard: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { me, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!me) return <Navigate to="/login" replace />;

    const role = (me.role || "").toUpperCase();
    if (!role.includes("ADMIN")) return <Navigate to="/" replace />;

    return children;
};

export default function App() {
    return (
        <AuthProvider>
            <Toaster position="top-right" />
            <BrowserRouter>
                {/* Navbar hiển thị cho mọi route trừ login/register */}
                <Navbar />

                <Routes>
                    {/* Public */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Admin */}
                    <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
                    <Route
                        path="/admin/users"
                        element={
                            <AdminGuard>
                                <AdminUsers />
                            </AdminGuard>
                        }
                    />
                    {/* NEW: tạo user */}
                    <Route
                        path="/admin/users/new"
                        element={
                            <AdminGuard>
                                <UserForm />
                            </AdminGuard>
                        }
                    />
                    {/* NEW: sửa user */}
                    <Route
                        path="/admin/users/:id/edit"
                        element={
                            <AdminGuard>
                                <UserForm />
                            </AdminGuard>
                        }
                    />

                    {/* User đăng nhập */}
                    <Route
                        path="/new"
                        element={
                            <ProtectedRoute>
                                <EditPost />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/edit/:id"
                        element={
                            <ProtectedRoute>
                                <EditPost />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Posts />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
