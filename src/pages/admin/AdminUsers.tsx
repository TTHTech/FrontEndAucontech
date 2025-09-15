import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api.ts";
import toast from "react-hot-toast";

type Role = "ROLE_ADMIN" | "ROLE_USER";
type UserRes = { id: number; username: string; role: Role };
type Page<T> = { content: T[]; totalElements: number; totalPages: number; number: number; size: number };

export default function AdminUsers() {
    const [q, setQ] = useState("");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [data, setData] = useState<Page<UserRes> | null>(null);
    const [loading, setLoading] = useState(false);
    const [confirmUser, setConfirmUser] = useState<UserRes | null>(null);
    const nav = useNavigate();

    const load = async () => {
        try {
            setLoading(true);
            const res = await api.get<Page<UserRes>>("/api/admin/users", { params: { q, page, size } });
            res.data.content = res.data.content.filter((u) => u.role === "ROLE_USER");
            setData(res.data);
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Tải danh sách người dùng thất bại");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, size]);

    const removeUser = async (u: UserRes) => {
        try {
            await api.delete(`/api/admin/users/${u.id}`);
            toast.success("Đã xóa người dùng");
            const nextPage = (data?.content.length ?? 1) === 1 && page > 0 ? page - 1 : page;
            setPage(nextPage);
            await load();
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Xóa người dùng thất bại");
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
                    <p className="mt-1 text-sm text-gray-500">Tạo, tìm kiếm và xóa người dùng (ROLE_USER).</p>
                </div>
                <button
                    onClick={() => nav("/admin/users/new")}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700"
                >
                    + Người dùng mới
                </button>
            </div>

            {/* Tìm kiếm + kích thước */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex w-full max-w-md items-center rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-100">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Tìm tên đăng nhập..."
                        className="w-full border-0 p-0 text-sm outline-none placeholder:text-gray-400"
                    />
                    <button
                        onClick={() => { setPage(0); load(); }}
                        className="ml-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                        Tìm kiếm
                    </button>
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                    <span className="text-sm text-gray-600">Kích thước</span>
                    <select
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>

            {/* Bảng */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 text-left text-gray-600">
                        <tr>
                            <th className="px-4 py-3 font-medium">ID</th>
                            <th className="px-4 py-3 font-medium">Tên đăng nhập</th>
                            <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                        </tr>
                    </thead>

                    {loading ? (
                        <tbody className="divide-y divide-gray-200">
                            {[...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-4 py-3"><div className="h-4 w-10 rounded bg-gray-200" /></td>
                                    <td className="px-4 py-3"><div className="h-4 w-40 rounded bg-gray-200" /></td>
                                    <td className="px-4 py-3 text-right"><div className="ml-auto h-8 w-28 rounded bg-gray-200" /></td>
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <tbody className="divide-y divide-gray-100">
                            {data?.content.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-800">{u.id}</td>
                                    <td className="px-4 py-3 text-gray-800">{u.username}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            to={`/admin/users/${u.id}/edit`}
                                            className="mr-2 inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition hover:bg-gray-50"
                                        >
                                            Sửa
                                        </Link>
                                        <button
                                            onClick={() => setConfirmUser(u)}
                                            className="inline-flex items-center rounded-lg border border-red-600 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {!data?.content.length && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    )}
                </table>
            </div>

            {/* Phân trang */}
            <div className="mt-4 flex items-center gap-3">
                <button
                    disabled={page <= 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
                >
                    Trước
                </button>
                <span className="text-sm text-gray-700">
                    Trang <span className="font-medium">{page + 1}</span> / <span className="font-medium">{data?.totalPages ?? 1}</span>
                </span>
                <button
                    disabled={(data?.number ?? 0) >= ((data?.totalPages ?? 1) - 1)}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
                >
                    Tiếp
                </button>

                <div className="ml-auto text-sm text-gray-500">
                    Tổng: <span className="font-medium">{data?.totalElements ?? 0}</span>
                </div>
            </div>

            {/* Popup xác nhận xóa */}
            {confirmUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="rounded-xl bg-white p-6 shadow-lg w-full max-w-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Xác nhận xóa</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xóa người dùng <span className="font-medium">{confirmUser.username}</span>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmUser(null)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    removeUser(confirmUser);
                                    setConfirmUser(null);
                                }}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}