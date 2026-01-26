import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  name?: string;
  email: string;
  role: "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ ADMIN CREDENTIALS (mock)
const ADMIN_EMAIL = "daniyaalperfumery@gmail.com";
const ADMIN_PASSWORD = "AmanKhan*1";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setUser({ email: ADMIN_EMAIL, role: "admin", name: "Daniyaal Admin" });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((res) => setTimeout(res, 500)); // simulate API delay

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const fakeToken = "mock-admin-token";

      setUser({ email, role: "admin", name: "Daniyaal Admin" });
      setToken(fakeToken);
      localStorage.setItem("token", fakeToken);
      return;
    }

    throw new Error("Invalid credentials");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
