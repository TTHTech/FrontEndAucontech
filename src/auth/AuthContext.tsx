import React, { createContext, useContext, useState } from 'react';
import { api } from '../api.ts';

type AuthCtx = { user?: string; login: (u: string, p: string) => Promise<void>; logout: () => void; };
const Ctx = createContext<AuthCtx>({} as any);
export const useAuth = () => useContext(Ctx);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | undefined>(localStorage.getItem('user') || undefined);
  const login = async (username: string, password: string) => {
    const { data } = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', data.username);
    setUser(data.username);
  };
  const logout = () => { localStorage.clear(); setUser(undefined); };
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
};
