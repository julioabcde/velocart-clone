'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { SIDEBAR_CONSTANT } from '@/constants/sidebar.config';  // ✅ Import SIDEBAR_CONSTANT

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();

    // Filter SIDEBAR_CONSTANT
    const matches = SIDEBAR_CONSTANT.flatMap((item) => {
      const items = [];

      // Main item matching
      if (item.label.toLowerCase().includes(q)) {
        items.push({ label: item.label, href: item.href });
      }

      // Sub-items matching
      if (item.subItem) {
        const subMatches = item.subItem.filter((sub) =>
          sub.label.toLowerCase().includes(q)
        );
        subMatches.forEach((s) => items.push({ label: s.label, href: s.href }));
      }

      return items;
    });

    setResults(matches); // Update results based on query
  }, [query]);

  const handleSelect = (href) => {
    router.push(href);  // Navigate to the selected href
    setQuery('');
    setResults([]);  // Reset results after selecting an item
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search menu..."
        className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

      {results.length > 0 && (
        <ul className="absolute top-full mt-1 left-0 right-0 bg-white border rounded-md shadow z-10 text-sm">
          {results.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSelect(item.href)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
