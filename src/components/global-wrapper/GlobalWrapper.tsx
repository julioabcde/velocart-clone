"use client";

import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/spinner/Spinner";

export default function GlobalWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, isLoggedIn } = useAuth();

  return (
    <>
      {isLoading && !isLoggedIn && <Spinner message="Logging Out..."/>}
      {children}
    </>
  );
}
