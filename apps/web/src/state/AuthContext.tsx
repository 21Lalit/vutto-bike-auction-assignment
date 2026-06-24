import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, User } from "../api/client";

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }
    api<{ user: User }>("/api/auth/me").then((r) => setUser(r.user)).catch(() => localStorage.removeItem("token")).finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthState>(() => ({
    user,
    loading,
    async login(email, password) {
      const res = await api<{ user: User; token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      localStorage.setItem("token", res.token);
      setUser(res.user);
    },
    async register(name, email, password) {
      const res = await api<{ user: User; token: string }>("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
      localStorage.setItem("token", res.token);
      setUser(res.user);
    },
    logout() {
      localStorage.removeItem("token");
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
