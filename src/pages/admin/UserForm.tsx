import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api.ts";
import toast from "react-hot-toast";

type Role = "ROLE_ADMIN" | "ROLE_USER";
type UserRes = { id: number; username: string; role: Role };

export default function UserForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);
    const nav = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const run = async () => {
            if (!isEdit) return;
            try {
                setLoading(true);
                const res = await api.get<UserRes>(`/api/admin/users/${id}`);
                if (res.data.role === "ROLE_ADMIN") {
                    toast.error("Không thể chỉnh sửa tài khoản ADMIN tại đây");
                    nav("/admin/users", { replace: true });
                    return;
                }
                setUsername(res.data.username);
            } catch (e: any) {
                toast.error(e?.response?.data?.message || "Không lấy được thông tin người dùng");
                nav("/admin/users", { replace: true });
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [id]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (isEdit) {
                await api.put(`/api/admin/users/${id}`, {
                    username,
                    ...(password ? { password } : {}),
                });
                toast.success("Cập nhật người dùng thành công");
            } else {
                await api.post(`/api/admin/users`, {
                    username,
                    password,
                    role: "ROLE_USER",
                });
                toast.success("Tạo người dùng thành công");
            }
            nav("/admin/users", { replace: true });
        } catch (e: any) {
            toast.error(
                e?.response?.data?.message || (isEdit ? "Cập nhật thất bại" : "Tạo người dùng thất bại")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-xl p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEdit ? "Sửa người dùng" : "Thêm người dùng"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    {isEdit ? "Đổi tên đăng nhập và/hoặc đặt lại mật khẩu (tùy chọn)." : "Tạo người dùng với quyền USER."}
                </p>
            </div>

            <form
                onSubmit={submit}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên đăng nhập"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            {isEdit ? "Mật khẩu mới (tùy chọn)" : "Mật khẩu"}
                        </label>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={isEdit ? "Để trống nếu không đổi" : "Nhập mật khẩu"}
                            {...(isEdit ? {} : { required: true })}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? "Đang xử lý..." : (isEdit ? "Lưu thay đổi" : "Tạo mới")}
                    </button>
                    <button
                        type="button"
                        onClick={() => nav("/admin/users")}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}