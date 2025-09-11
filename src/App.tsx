import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.tsx";
import { ProtectedRoute } from "./auth/ProtectedRoute.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Posts from "./pages/Posts.tsx";
import EditPost from "./pages/EditPost.tsx";

function TailwindTest() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-sky-500 flex items-center justify-center p-6">
            <div className="max-w-md w-full rounded-2xl bg-white/90 backdrop-blur p-8 shadow-xl">
                <h1 className="text-3xl font-bold text-indigo-700">Tailwind OK 🎉</h1>
                <p className="mt-2 text-gray-600">
                    Nếu bạn thấy khối màu, font bold, bo góc và đổ bóng như thế này, Tailwind đang hoạt động.
                </p>
                <div className="mt-4 flex gap-3">
                    <button className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                        Nút thử
                    </button>
                    <Link
                        to="/"
                        className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                        Về trang chính
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Route test Tailwind */}
                    <Route path="/tw" element={<TailwindTest />} />

                    {/* App routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
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
