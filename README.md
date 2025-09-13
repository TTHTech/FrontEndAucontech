# Blog - Frontend

## 📦 Tổng Quan Dự Án
**Tên dự án**: Blog Frontend  
**Mô tả**  
- Ứng dụng web client xây dựng bằng **React + TypeScript**.  
- UI dùng **TailwindCSS**, gọi API bằng **Axios**.  
- Kết nối **Blog Backend (Spring Boot + JWT)** qua REST API.  
- Phân quyền:
  - **ROLE_USER**: CRUD bài viết của mình.
  - **ROLE_ADMIN**: Quản lý người dùng (list, tạo, sửa, xoá).

---

## 🚀 Công Nghệ Sử Dụng
- **React + Vite** (SPA)
- **TypeScript**
- **TailwindCSS**
- **Axios**
- **React Router DOM**
- **React Hot Toast**
- **Heroicons** (icon SVG)

---

## ✅ Yêu Cầu Môi Trường
- Node.js ≥ 18
- npm ≥ 9 (hoặc pnpm/yarn nếu thích)

---

## ⚙️ Cấu Hình Môi Trường

> 👉 Dùng **Vite** thì biến môi trường phải bắt đầu bằng `VITE_`.

Tạo file `.env` ở thư mục gốc frontend:

```env
# URL backend của bạn
VITE_API_URL=http://localhost:8080
```

> Nếu code cũ từng dùng CRA: `REACT_APP_API_URL` thì đổi trong code sang `import.meta.env.VITE_API_URL`
> (hoặc giữ fallback như đã có trong dự án).

---

## ▶️ Cách Chạy

### 1) Cài dependencies
```bash
npm install
```

### 2) Chạy dev server
```bash
npm run dev
```
Ứng dụng: http://localhost:3000

> Nhớ bật backend ở `http://localhost:8080` và **CORS** cho `http://localhost:3000`.

### 3) Build production
```bash
npm run build
npm run preview
```

---

## 🔐 Luồng Đăng Nhập (tóm tắt)
- `AuthContext` lưu `token` vào `localStorage`.
- Axios interceptor tự gắn `Authorization: Bearer <token>` cho mọi request.
- Sau `login`, FE gọi `/api/auth/me` để lấy `me { id, username, role }`.
- `ProtectedRoute` & `AdminGuard` chặn truy cập khi không đủ quyền.

---

## 🧭 Routes Chính
- `/login` – Đăng nhập
- `/register` – Đăng ký
- `/` – Danh sách bài viết (cần login)
- `/new` – Tạo bài viết (cần login)
- `/edit/:id` – Sửa bài viết (chỉ tác giả)
- `/admin/users` – Quản trị user (chỉ **ROLE_ADMIN**)
- `/admin/users/new` – Tạo user (admin)
- `/admin/users/:id/edit` – Sửa user (admin)

---

## 📂 Cấu Trúc Thư Mục

```plaintext
src/
├─ api.ts                      # Cấu hình axios (baseURL, interceptor)
├─ App.tsx                     # Khai báo routes chính
├─ main.tsx                    # Bootstrap React
├─ components/
│  └─ Navbar.tsx               # Thanh điều hướng (hiển thị user / logout)
├─ auth/
│  ├─ AuthContext.tsx          # Context auth: me, token, login/logout, refreshMe
│  ├─ ProtectedRoute.tsx       # Chặn route nếu chưa đăng nhập
│  └─ Guards.tsx               # (tùy chọn) guard phụ nếu cần
├─ pages/
│  ├─ Login.tsx                # Màn đăng nhập (+toggle show/hide password)
│  ├─ Register.tsx             # Màn đăng ký (nếu dùng)
│  ├─ Posts.tsx                # Danh sách bài viết (+search, paginate, filter)
│  ├─ EditPost.tsx             # Tạo/Sửa bài viết
│  └─ admin/
│     ├─ AdminUsers.tsx        # Quản lý user (list/search/paging/delete)
│     └─ UserForm.tsx          # Form tạo & sửa user (admin)
└─ index.css / tailwind.config.*  # cấu hình Tailwind
```

---

## 🔗 Kết Nối Backend

Mặc định FE gọi:
- `POST /api/auth/login` → trả `{ token }`
- `GET  /api/auth/me` → trả `{ id, username, role }`
- `GET  /api/posts?page=&size=` → danh sách bài viết (Page)
- `POST /api/posts` → tạo bài viết
- `PUT  /api/posts/{id}` → sửa (chỉ tác giả)
- `DELETE /api/posts/{id}` → xoá (chỉ tác giả)
- Admin:
  - `GET    /api/admin/users?q=&page=&size=`
  - `POST   /api/admin/users`
  - `GET    /api/admin/users/{id}`
  - `PUT    /api/admin/users/{id}`
  - `DELETE /api/admin/users/{id}`

> Hãy đảm bảo backend bật CORS cho `http://localhost:5173`.

---


## 🧪 Mẹo Kiểm Thử Nhanh
1. Đăng nhập bằng `admin` → truy cập `/admin/users`.
2. Tạo user thường `user1` → đăng xuất → đăng nhập `user1`.
3. Vào `/new` tạo vài bài viết → kiểm tra filter *“Tất cả / Bài của tôi”*.
4. Sửa/Xoá bài viết của chính mình → đảm bảo không xoá/sửa được bài của người khác.

---

## 📝 Scripts Tiện Ích (tùy chọn)
```bash
# format toàn dự án (nếu dùng prettier)
npm run format

# lint (nếu cài eslint)
npm run lint
```

---


