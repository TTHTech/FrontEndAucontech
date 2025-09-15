// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type Role = "ROLE_ADMIN" | "ROLE_USER";
type MeRes = { id: number; username: string; role: Role };

type AuthState = {
  me: MeRes | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<MeRes | null>;
  logout: () => void;
  refreshMe: () => Promise<MeRes | null>;
};

const AuthCtx = createContext<AuthState>(null as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [me, setMe] = useState<MeRes | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState<boolean>(!!localStorage.getItem("token"));

  useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL ?? "https://backendaucontech.onrender.com";

    const reqId = axios.interceptors.request.use((config) => {
      const t = localStorage.getItem("token");
      if (t) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${t}`;
      }
      return config;
    });

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

  const refreshMe = async (): Promise<MeRes | null> => {
    if (!token) {
      setMe(null);
      setLoading(false);
      return null;
    }
    try {
      setLoading(true);
      const res = await axios.get<MeRes>("/auth/me");
      setMe(res.data);
      return res.data;
    } catch {
      localStorage.removeItem("token");
      setToken(null);
      setMe(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) refreshMe();
  }, [token]);

  const login = async (username: string, password: string): Promise<MeRes | null> => {
    const { data } = await axios.post<{ token: string }>("/auth/login", { username, password });
    const newToken = data.token;

    localStorage.setItem("token", newToken);
    setToken(newToken);

    try {
      setLoading(true);
      const meRes = await axios.get<MeRes>("/auth/me", {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      setMe(meRes.data);
      return meRes.data;
    } catch (e) {
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
