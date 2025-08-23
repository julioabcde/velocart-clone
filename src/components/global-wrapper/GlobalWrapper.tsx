"use client";

import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/spinner/Spinner";

export default function GlobalWrapper({ children }: { children: React.ReactNode }) {
  const { isLoggingOut } = useAuth();

  return (
    <>
      {isLoggingOut &&  <Spinner message="Logging Out..."/>}
      {children}
    </>
  );
}
