import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.ts";

type PostDetail = { title: string; content: string };

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState<boolean>(!!isEdit);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | undefined>();

  const nav = useNavigate();

  // Load bài viết khi edit
  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      if (!isEdit) return;
      try {
        setLoading(true);
        const { data } = await api.get<PostDetail>(`/posts/${id}`);
        if (mounted) {
          setTitle(data?.title ?? "");
          setContent(data?.content ?? "");
        }
      } catch (e) {
        setMsg("Không tải được bài viết.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(undefined);
    try {
      setSaving(true);
      const payload = { title: title.trim(), content: content.trim() };
      if (!payload.title || !payload.content) {
        setMsg("Vui lòng nhập đầy đủ tiêu đề và nội dung.");
        return;
      }
      if (isEdit) await api.put(`/posts/${id}`, payload);
      else await api.post("/posts", payload);
      nav("/");
    } catch (err: any) {
      setMsg(err?.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const titleMax = 120;
  const contentMax = 5000;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          {isEdit ? "Sửa bài viết" : "Tạo bài viết"}
        </h2>
        <button
          type="button"
          onClick={() => nav(-1)}
          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          ← Quay lại
        </button>
      </div>

      <form
        onSubmit={submit}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {/* Alert message */}
        {msg && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {msg}
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-1/3 rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-100" />
            <div className="h-4 w-1/4 rounded bg-gray-200" />
            <div className="h-40 w-full rounded bg-gray-100" />
            <div className="h-10 w-40 rounded bg-gray-200" />
          </div>
        ) : (
          <>
            {/* Title */}
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tiêu đề
            </label>
            <div className="relative">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={titleMax}
                placeholder="Nhập tiêu đề bài viết"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {title.length}/{titleMax}
              </span>
            </div>

            {/* Content */}
            <label className="mt-5 mb-1 block text-sm font-medium text-gray-700">
              Nội dung
            </label>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={contentMax}
                placeholder="Viết nội dung bài viết…"
                className="min-h-[180px] w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
              <span className="pointer-events-none absolute right-3 bottom-2 text-xs text-gray-400">
                {content.length}/{contentMax}
              </span>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Đang lưu…" : "Lưu"}
              </button>
              <button
                type="button"
                onClick={() => nav("/")}
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
