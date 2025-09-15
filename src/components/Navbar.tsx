import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.tsx";

export default function Navbar() {
    const { me, token, logout } = useAuth();
    const location = useLocation();

    if (location.pathname === "/login" || location.pathname === "/register") {
        return null;
    }

    if (!token) return null;

    return (
        <nav className="flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
            {me?.role === "ROLE_ADMIN" ? (
                <Link
                    to="/admin/users"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                    Admin
                </Link>
            ) : (
                <Link
                    to="/"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                    Trang chủ
                </Link>
            )}

            <div className="ml-auto flex items-center gap-4">
                <span className="text-sm text-gray-600">
                    Hi, <b>{me?.username}</b> ({me?.role?.replace("ROLE_", "")})
                </span>
                <button
                    onClick={logout}
                    className="rounded-lg border border-red-500 px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
                >
                    Đăng xuất
                </button>
            </div>
        </nav>
    );
}
