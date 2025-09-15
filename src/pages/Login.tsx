import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.tsx";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const me = await login(username, password);
      if (!me) throw new Error("Không lấy được thông tin người dùng");

      toast.success("Đăng nhập thành công!");

      if (me.role === "ROLE_ADMIN") {
        nav("/admin", { replace: true });
      } else {
        nav("/", { replace: true });
      }
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng");
      } else {
        toast.error(err?.response?.data?.error || "Đăng nhập thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Đăng nhập</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
            <input
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Nhập username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-2 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="••••••••"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                tabIndex={-1}
              >
                {show ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}