import React, { createContext, memo, useCallback, useContext, useMemo, useState } from 'react';
import { MOCK_USERS, type MockUser } from './mockUsers';

export type AuthUser = Omit<MockUser, 'password'>;

type AuthApi = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  register: (fullName: string, email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthApi | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const AuthProvider = memo(function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<MockUser[]>(() => [...MOCK_USERS]);

  const login = useCallback(async (email: string, password: string) => {
    const e = normalizeEmail(email);
    const p = password;
    const found = users.find(u => u.email === e);
    if (!found) return { ok: false as const, message: 'Email không tồn tại' };
    if (found.password !== p) return { ok: false as const, message: 'Sai mật khẩu' };
    setUser({ id: found.id, email: found.email, fullName: found.fullName });
    return { ok: true as const };
  }, [users]);

  const register = useCallback(async (fullName: string, email: string, password: string) => {
    const name = fullName.trim();
    const e = normalizeEmail(email);
    const p = password;
    if (name.length < 2) return { ok: false as const, message: 'Tên quá ngắn' };
    if (!e.includes('@')) return { ok: false as const, message: 'Email không hợp lệ' };
    if (p.length < 6) return { ok: false as const, message: 'Mật khẩu tối thiểu 6 ký tự' };
    const exists = users.some(u => u.email === e);
    if (exists) return { ok: false as const, message: 'Email đã được đăng ký' };

    const next: MockUser = {
      id: `u${users.length + 1}`,
      email: e,
      password: p,
      fullName: name,
    };
    setUsers(prev => [...prev, next]);
    setUser({ id: next.id, email: next.email, fullName: next.fullName });
    return { ok: true as const };
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const api = useMemo<AuthApi>(() => ({ user, login, register, logout }), [login, logout, register, user]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
});

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

