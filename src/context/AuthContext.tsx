"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "@/services/AuthService";
import { LoginService } from "@/services/api/LoginService";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  isLoggedIn: false,
  setLoggedIn: (_: boolean) => { },
  isLoggingIn: false,
  setLoggingIn: (_: boolean) => { },
  isLoggingOut: false,
  setLoggingOut: (_: boolean) => { },
  isAuthChecking: false,
  setAuthChecking: (_: boolean) => { },
  login: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [isAuthChecking, setAuthChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (AuthService.isTokenExpired()) {
      setLoggedIn(false);
    }
    else {
      setLoggedIn(true);
    }
    setTimeout(() => {
      setAuthChecking(false);
    }, 1000);
  }, []);

  const login = () => {
    router.push("/login");
  };

  const logout = () => {
    setLoggingOut(true);

    LoginService.logout();

    setTimeout(() => {
      setLoggingOut(false);
      setLoggedIn(false);
    }, 1500);
    setTimeout(() => {
      router.push("/login");
    }, 2500);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, isLoggingIn, setLoggingIn, isLoggingOut, setLoggingOut, isAuthChecking, setAuthChecking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);