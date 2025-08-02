"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { SIDEBAR_CONSTANT } from "@/constants/SiderbarConstant";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();

    // Filter SIDEBAR_CONSTANT
    const matches = SIDEBAR_CONSTANT.flatMap((item) => {
      const items = [];
      
      const hasSub = Array.isArray(item.subItem) && item.subItem.length > 0;
      const subMatches = hasSub ? item.subItem.filter((sub) => sub.label.toLowerCase().includes(q)) : [];

      if (subMatches.length > 0) {
        subMatches.forEach((s) =>
          items.push({
            label: s.label,
            href: s.href,
            icon: s.icon,
          })
        );
      }
      else if (item.label.toLowerCase().includes(q) && !hasSub) {
        items.push({
          label: item.label,
          href: item.href,
          icon: item.icon,
        });
      }

      return items;
    });

    setResults(matches);
    setHighlightedIndex(0);
  }, [query]);

  const handleSelect = (href) => {
    router.push(href);
    setQuery("");
    setResults([]);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % results.length);
    }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => prev === 0 ? results.length - 1 : prev - 1);
    }
    else if (e.key === "Enter" && highlightedIndex >= 0 && highlightedIndex < results.length) {
      handleSelect(results[highlightedIndex].href);
    }
  };

  return (
    <div
      className="relative w-full max-w-md"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={-1}
    >
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search menu..."
        className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />

      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

      {isFocused && (results.length > 0 || query.length > 0) && (
        <ul className="absolute top-full mt-1 left-0 right-0 bg-white border rounded-md shadow z-10 text-sm">
          {results.length > 0 ? (
            results.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item.href)}
                className={`px-4 py-2 cursor-pointer ${index === highlightedIndex ? "bg-gray-100" : ""}`}
              >
                <div className="flex items-center space-x-2">
                  {item.icon && <item.icon className="w-4 h-4 text-gray-500" />}
                  <span>{item.label}</span>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">Not found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
