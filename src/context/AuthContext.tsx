"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "@/services/AuthService";
import { LoginService } from "@/services/api/LoginService";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  isLoggedIn: false,
  isLoading: false,
  login: () => { },
  logout: () => { },
  setLoggedIn: (_: boolean) => { },
  setLoading: (_: boolean) => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(!AuthService.isTokenExpired());
  }, []);

  const login = () => {
    router.push("/login");
  };

  const logout = () => {
    LoginService.logout();

    setLoading(true);
    setLoggedIn(false);

    setTimeout(() => {
      setLoading(false);
      router.push("/login");
    }, 1000);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout, setLoggedIn, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);