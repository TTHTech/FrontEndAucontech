import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.ts";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(undefined);
    setSuccess(false);

    if (password !== confirm) {
      setMsg("Mật khẩu xác nhận không khớp");
      return;
    }
    try {
      await api.post("/auth/register", { username, password });
      setSuccess(true);
      setMsg("Đăng ký thành công! Hãy đăng nhập.");
      setUsername("");
      setPassword("");
      setConfirm("");
    } catch (err: any) {
      setMsg(err.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Đăng ký
        </h2>

        {msg && (
          <div
            className={`mb-4 rounded-lg px-4 py-2 text-sm ${success
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-red-200 bg-red-50 text-red-600"
              }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tên đăng nhập
            </label>
            <input
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-2 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Nhập mật khẩu"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-2 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Nhập lại mật khẩu"
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                tabIndex={-1}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            Đăng ký
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}