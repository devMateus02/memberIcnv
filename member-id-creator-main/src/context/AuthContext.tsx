import { createContext, useContext, useState } from "react";

interface AuthData {
  token: string;
  role: "admin" | "member";
}

const AuthContext = createContext<{
  auth: AuthData | null;
  login: (data: AuthData) => void;
  logout: () => void;
}>({} as any);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthData | null>(() => {
    const saved = localStorage.getItem("auth");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (data: AuthData) => {
    setAuth(data);
    localStorage.setItem("auth", JSON.stringify(data));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
