"use client";

import SearchBar from "./HeaderSearchBar"; 
import DateDisplay from "./HeaderDate";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 h- inline-flex items-center justify-between bg-white border-b px-2 py-2 shadow-sm">
      <div className="flex-1 px-4">
        <SearchBar />
        <DateDisplay />
      </div>
    </header>
  );
};

export default Header;
