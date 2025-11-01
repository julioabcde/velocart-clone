'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Product } from '@/models/Product';
import { useDebounce } from '@/hook/UseDebounce';

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
}

export default function ProductSearch({ onProductSelect }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  // Search products when debounced query changes
  // TODO: Implement actual search API call
  
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Scan barcode or search product..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Search Results Dropdown */}
      {query && results.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto">
          {results.map((product) => (
            <button
              key={product.productId}
              onClick={() => {
                onProductSelect(product);
                setQuery('');
                setResults([]);
              }}
              className="w-full px-4 py-3 text-left hover:bg-slate-50 flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{product.productName}</div>
                <div className="text-xs text-slate-500">{product.productId}</div>
              </div>
              <div className="text-sm font-semibold">
                Rp {product.sellingPrice?.toLocaleString('id-ID')}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}