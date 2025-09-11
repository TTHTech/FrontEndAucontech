// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type Role = "ROLE_ADMIN" | "ROLE_USER";
type MeRes = { id: number; username: string; role: Role };

type AuthState = {
  me: MeRes | null;
  token: string | null;
  loading: boolean;
  // trả về thông tin user ngay sau khi login
  login: (username: string, password: string) => Promise<MeRes | null>;
  logout: () => void;
  refreshMe: () => Promise<MeRes | null>;
};

const AuthCtx = createContext<AuthState>(null as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [me, setMe] = useState<MeRes | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState<boolean>(!!localStorage.getItem("token"));

  // Cấu hình axios 1 lần
  useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL ?? "http://localhost:8080";

    // interceptor: tự gắn token cho mọi request (trừ lần /me đầu tiên sau login ta sẽ tự gắn tay)
    const reqId = axios.interceptors.request.use((config) => {
      const t = localStorage.getItem("token");
      if (t) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${t}`;
      }
      return config;
    });

    // interceptor: nếu 401 -> xoá token local
    const resId = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          setToken(null);
          setMe(null);
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqId);
      axios.interceptors.response.eject(resId);
    };
  }, []);

  // Lấy /api/auth/me theo token hiện tại
  const refreshMe = async (): Promise<MeRes | null> => {
    if (!token) {
      setMe(null);
      setLoading(false);
      return null;
    }
    try {
      setLoading(true);
      const res = await axios.get<MeRes>("/api/auth/me");
      setMe(res.data);
      return res.data;
    } catch {
      // token hỏng/het hạn
      localStorage.removeItem("token");
      setToken(null);
      setMe(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Khi token thay đổi (ví dụ F5 lại trang) thì load me
  useEffect(() => {
    if (token) refreshMe();
  }, [token]);

  // LOGIN: gắn header Authorization trực tiếp cho /me đầu tiên
  const login = async (username: string, password: string): Promise<MeRes | null> => {
    // 1) lấy token
    const { data } = await axios.post<{ token: string }>("/api/auth/login", { username, password });
    const newToken = data.token;

    // 2) lưu & set token vào state
    localStorage.setItem("token", newToken);
    setToken(newToken);

    // 3) gọi /me NGAY, tự gắn header Authorization (không chờ interceptor)
    try {
      setLoading(true);
      const meRes = await axios.get<MeRes>("/api/auth/me", {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      setMe(meRes.data);
      return meRes.data;
    } catch (e) {
      // nếu thất bại, xoá token để tránh trạng thái lửng
      localStorage.removeItem("token");
      setToken(null);
      setMe(null);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMe(null);
  };

  return (
    <AuthCtx.Provider value={{ me, token, loading, login, logout, refreshMe }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
