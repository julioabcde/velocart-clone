"use client";
import SearchBar from "./HeaderSearchBar";
import DateDisplay from "./HeaderDate";
import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut } from "lucide-react";

const Header = () => {
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 inline-flex items-center justify-between bg-white border-b px-2 py-2 shadow-sm">
      <div className="flex justify-between items-center w-full">
        <SearchBar />
        <div className="flex items-center gap-3">
          <DateDisplay />
          {isLoggedIn ? (
            <button onClick={logout} className="flex items-center gap-1">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <button onClick={login} className="flex items-center gap-1">
              <LogIn className="w-4 h-4" /> Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
