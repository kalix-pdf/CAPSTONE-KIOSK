import { createContext, useContext, useState, ReactNode } from "react";

interface AuthState {
  userId: number | null;
  role: number;
}

interface AuthContextType extends AuthState {
  login: (data: AuthState) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(() => ({
    userId: Number(localStorage.getItem("userId")) || null,
    role: Number(localStorage.getItem("role")) || 0,
  }));

  const login = (data: AuthState) => {
    localStorage.setItem("userId", String(data.userId));
    localStorage.setItem("role", String(data.role));
    setAuth(data);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setAuth({ userId: null, role: 0 });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};