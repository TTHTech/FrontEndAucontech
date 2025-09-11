import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.ts";
import { useAuth } from "../auth/AuthContext.tsx";

type Post = { id: number; title: string; content: string };

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { logout, user } = useAuth();
  const nav = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/posts");
      setPosts(data?.content ?? data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = async (id: number) => {
    if (!window.confirm("Xoá bài viết?")) return;
    await api.delete(`/posts/${id}`);
    load();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q)
    );
  }, [posts, search]);

  const truncate = (s = "", n = 140) =>
    s.length > n ? s.slice(0, n).trimEnd() + "…" : s;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Danh sách bài viết
          </h2>
          {user && (
            <p className="mt-1 text-sm text-gray-500">
              Xin chào, <span className="font-semibold">{user}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Tìm bài viết..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            onClick={() => nav("/new")}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            + Tạo bài viết
          </button>
          <button
            onClick={logout}
            className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <ul className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="h-5 w-1/3 rounded bg-gray-200" />
              <div className="mt-3 h-3 w-full rounded bg-gray-100" />
              <div className="mt-2 h-3 w-5/6 rounded bg-gray-100" />
            </li>
          ))}
        </ul>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16">
          <div className="mb-3 text-5xl text-gray-400">📝</div>
          <p className="text-lg font-medium text-gray-700">
            Chưa có bài viết phù hợp
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {posts.length === 0
              ? "Bắt đầu bằng cách tạo bài viết mới."
              : "Thử tìm với từ khoá khác nhé."}
          </p>
          <button
            onClick={() => nav("/new")}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            + Tạo bài viết
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((p) => (
            <li
              key={p.id}
              className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              {/* Avatar + title */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                    {p.title?.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                    {p.title}
                  </h3>
                </div>
                <div className="shrink-0 space-x-2">
                  <button
                    onClick={() => nav(`/edit/${p.id}`)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-600"
                  >
                    Xoá
                  </button>
                </div>
              </div>

              {/* Content preview */}
              <p className="flex-1 text-sm leading-6 text-gray-600">
                {truncate(p.content, 180)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
