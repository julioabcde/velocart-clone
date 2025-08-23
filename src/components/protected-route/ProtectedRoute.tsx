"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "../spinner/Spinner";
import { AuthService } from "@/services/AuthService";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, setLoggedIn, isAuthChecking, setAuthChecking } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (AuthService.isTokenExpired()) {
      setAuthChecking(true);
      setTimeout(() => {
        setLoggedIn(false);
        setAuthChecking(false);
      }, 1500);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    }
    else {
      setLoggedIn(true);
    }
  }, [router, setLoggedIn, setAuthChecking]);

  if (isAuthChecking) {
    return <Spinner message="Checking authentication..." />;
  }
  
  if (!isLoggedIn) {
    return <Spinner message="Redirecting to login..." />;
  }

  return <>{children}</>;
}
