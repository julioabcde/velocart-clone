"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, Plus, Minus, Trash2, CreditCard, X, Tag, Camera, ShoppingCart } from "lucide-react";

const rupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const CATEGORIES = ["Semua", "Minuman", "Makanan", "Snack", "Kebutuhan Harian"] as const;
type Category = typeof CATEGORIES[number];

const PRODUCTS = [
  { id: "p01", name: "Kopi Arabika 250g", sku: "SKU-ARAB-250", price: 65000, stock: 42, category: "Minuman" },
  { id: "p02", name: "Teh Melati 50s", sku: "SKU-TEH-050", price: 22000, stock: 80, category: "Minuman" },
  { id: "p03", name: "Air Mineral 600ml", sku: "SKU-AIR-600", price: 6000, stock: 150, category: "Minuman", discountPct: 10 },
  { id: "p04", name: "Mi Instan Goreng", sku: "SKU-MI-GOR", price: 4000, stock: 300, category: "Makanan" },
  { id: "p05", name: "Roti Tawar 400g", sku: "SKU-ROT-400", price: 18000, stock: 25, category: "Makanan" },
  { id: "p06", name: "Keripik Singkong Pedas", sku: "SKU-KRP-PED", price: 12000, stock: 60, category: "Snack" },
  { id: "p07", name: "Biskuit Cokelat", sku: "SKU-BSK-CKL", price: 15000, stock: 40, category: "Snack" },
  { id: "p08", name: "Beras Premium 5kg", sku: "SKU-BER-5KG", price: 78000, stock: 18, category: "Kebutuhan Harian" },
  { id: "p09", name: "Gula Pasir 1kg", sku: "SKU-GUL-1KG", price: 16000, stock: 55, category: "Kebutuhan Harian" },
  { id: "p10", name: "Minyak Goreng 1L", sku: "SKU-MNY-1L", price: 17000, stock: 70, category: "Kebutuhan Harian" },
];

type Product = typeof PRODUCTS[number];
type CartItem = { product: Product; qty: number; discountPct?: number };

function useDebounced<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}

export default function POSModernPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<Category>("Semua");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [voucher, setVoucher] = useState("");
  const [globalDiscountPct, setGlobalDiscountPct] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedCode, setScannedCode] = useState("");

  const searchRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isCmdK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (isCmdK) { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const debouncedQuery = useDebounced(query, 250);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return PRODUCTS.filter((p) => (activeCat === "Semua" || p.category === activeCat) && (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)));
  }, [debouncedQuery, activeCat]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.product.id === product.id);
      if (idx >= 0) { const cp = [...prev]; cp[idx] = { ...cp[idx], qty: Math.min(cp[idx].qty + 1, product.stock) }; return cp; }
      return [...prev, { product, qty: 1, discountPct: product.discountPct }];
    });
  };
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.product.id !== id));
  const setQty = (id: string, qty: number) => setCart((prev) => prev.map((c) => (c.product.id === id ? { ...c, qty: Math.max(0, Math.min(qty, c.product.stock)) } : c)).filter((c) => c.qty > 0));

  const subtotal = useMemo(() => cart.reduce((s, c) => s + Math.round(c.product.price * (1 - (c.discountPct ?? 0) / 100)) * c.qty, 0), [cart]);
  const globalDiscountAmount = useMemo(() => Math.round(subtotal * (Math.max(0, Math.min(100, globalDiscountPct)) / 100)), [subtotal, globalDiscountPct]);
  const tax = useMemo(() => Math.round((subtotal - globalDiscountAmount) * 0.11), [subtotal, globalDiscountAmount]);
  const total = useMemo(() => subtotal - globalDiscountAmount + tax, [subtotal, globalDiscountAmount, tax]);

  useEffect(() => { if (!voucher) return; setGlobalDiscountPct(voucher.toUpperCase() === "HEMAT10" ? 10 : 0); }, [voucher]);

  // Barcode Scanner
  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setShowScanner(true);
    } catch (err) {
      alert('Tidak dapat mengakses kamera. Gunakan pencarian manual.');
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowScanner(false);
    setScannedCode("");
  };

  const handleManualBarcode = () => {
    if (!scannedCode.trim()) return;
    const product = PRODUCTS.find(p => p.sku.toLowerCase() === scannedCode.trim().toLowerCase());
    if (product) {
      addToCart(product);
      setScannedCode("");
      stopScanner();
    } else {
      alert('Produk tidak ditemukan!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900">TemanAkun POS</div>
              <div className="text-xs text-slate-500">Modern Point of Sale</div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 relative max-w-xl">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { const q = query.trim().toLowerCase(); const exact = PRODUCTS.find(p => p.sku.toLowerCase() === q); addToCart(exact ?? filtered[0]!); setQuery(""); }
                if (e.key === "Escape") setQuery("");
              }}
              placeholder="Cari produk atau scan barcode... (⌘K)"
              className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {query && (
              <div className="absolute mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-96 overflow-auto z-10">
                {filtered.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500">Tidak ada hasil untuk "{query}".</div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {filtered.slice(0, 8).map((p) => (
                      <li key={p.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => { addToCart(p); setQuery(""); }}>
                        <div className="h-12 w-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 font-medium">IMG</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900">{p.name}</div>
                          <div className="text-xs text-slate-500">{p.sku}</div>
                        </div>
                        <div className="text-sm font-bold text-slate-900">{rupiah(p.price)}</div>
                        {p.discountPct && (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                            -{p.discountPct}%
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Barcode Scanner Button */}
          <button 
            onClick={startScanner}
            className="h-11 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 font-medium shadow-lg shadow-blue-500/25 transition-all"
          >
            <Camera className="h-4 w-4" /> 
            <span className="hidden sm:inline">Scan</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Catalog */}
        <section className="lg:col-span-2 flex flex-col" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {/* Category Slider */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 flex-shrink-0 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Kategori Produk</div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCat(cat)} 
                  className={activeCat === cat 
                    ? "px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white whitespace-nowrap flex-shrink-0 shadow-lg shadow-blue-500/25 transition-all" 
                    : "px-5 py-2.5 rounded-xl text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 whitespace-nowrap flex-shrink-0 transition-all"}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid - Scrollable */}
          <div className="flex-1 overflow-y-auto mt-4 pr-2 scrollbar-thin">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
              {filtered.map((p) => {
                const cartItem = cart.find(c => c.product.id === p.id);
                const inCart = !!cartItem;
                const qty = cartItem?.qty || 0;
                
                return (
                  <article key={p.id} className="group relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 h-fit hover:shadow-xl hover:border-blue-300 transition-all duration-300">
                    {/* In Cart Badge */}
                    {inCart && (
                      <div className="absolute -top-2 -left-2 h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg z-10">
                        <ShoppingCart className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    {p.discountPct && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg z-10">
                        -{p.discountPct}%
                      </div>
                    )}
                    
                    {/* Product Image Placeholder */}
                    <div className="aspect-square w-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl mb-3 flex items-center justify-center text-slate-400">
                      <div className="text-xs font-medium">IMG</div>
                    </div>
                    
                    {/* Product Info */}
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 min-h-[2.75rem]">{p.name}</h3>
                    <div className="mt-1 text-xs text-slate-500">{p.sku}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="font-bold text-slate-900">{rupiah(p.price)}</div>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">Stok {p.stock}</span>
                    </div>
                    
                    {/* Control Box - Shows on Hover */}
                    <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-white border-2 border-blue-500 rounded-xl shadow-xl p-2 flex items-center justify-center gap-2">
                        <button 
                          onClick={() => {
                            if (inCart) {
                              setQty(p.id, qty - 1);
                            }
                          }}
                          disabled={!inCart}
                          className="h-9 w-9 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Minus className="h-4 w-4 text-slate-700" />
                        </button>
                        
                        <div className="h-9 w-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                          {qty}
                        </div>
                        
                        <button 
                          onClick={() => {
                            if (inCart) {
                              setQty(p.id, qty + 1);
                            } else {
                              addToCart(p);
                            }
                          }}
                          className="h-9 w-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg flex items-center justify-center transition-colors shadow-lg shadow-blue-500/25"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right: Cart */}
        <aside className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden sticky top-24 flex flex-col shadow-xl" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between flex-shrink-0">
              <div className="font-bold text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Keranjang
              </div>
              <div className="text-sm text-white/90 bg-white/20 px-3 py-1 rounded-full font-medium">
                {cart.reduce((s, c) => s + c.qty, 0)} Item
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-0">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-sm text-center">
                  <ShoppingCart className="h-12 w-12 mb-3 opacity-30" />
                  <p className="text-slate-600 font-medium">Keranjang Kosong</p>
                  <p className="mt-1">Mulai tambahkan produk</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {cart.map((c) => (
                    <div key={c.product.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-14 w-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 flex-shrink-0 font-medium">IMG</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 text-sm leading-tight mb-1">{c.product.name}</div>
                          <div className="text-xs text-slate-500 mb-1">{c.product.sku}</div>
                          {c.discountPct && (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Tag className="h-3 w-3" />-{c.discountPct}%
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-bold text-slate-900">{rupiah(Math.round(c.product.price * (1 - (c.discountPct ?? 0) / 100)))}</div>
                        <div className="text-xs text-slate-500 font-medium">Total: {rupiah(Math.round(c.product.price * (1 - (c.discountPct ?? 0) / 100)) * c.qty)}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setQty(c.product.id, c.qty - 1)} 
                          className="h-9 w-9 border border-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 flex-shrink-0 transition-colors"
                        >
                          <Minus className="h-4 w-4 text-slate-600" />
                        </button>
                        <input 
                          type="number" 
                          value={c.qty} 
                          min={0} 
                          max={c.product.stock} 
                          onChange={(e) => setQty(c.product.id, Number(e.target.value))} 
                          className="h-9 w-16 text-center border border-slate-300 rounded-lg flex-shrink-0 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        />
                        <button 
                          onClick={() => setQty(c.product.id, c.qty + 1)} 
                          className="h-9 w-9 border border-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 flex-shrink-0 transition-colors"
                        >
                          <Plus className="h-4 w-4 text-slate-600" />
                        </button>
                        <button 
                          onClick={() => removeFromCart(c.product.id)} 
                          className="h-9 w-9 border-2 border-red-200 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-50 hover:border-red-300 flex-shrink-0 ml-auto transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="border-t border-slate-200 p-5 space-y-3 bg-slate-50/80 backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-bold text-slate-900">{rupiah(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm gap-2">
                <span className="flex-shrink-0 text-slate-600">Diskon</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="h-9 w-16 text-center border border-slate-300 rounded-lg flex-shrink-0 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={globalDiscountPct} 
                    onChange={(e) => setGlobalDiscountPct(Number(e.target.value))} 
                  />
                  <span className="text-slate-500 flex-shrink-0">%</span>
                  <span className="font-bold text-emerald-600 whitespace-nowrap">- {rupiah(globalDiscountAmount)}</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-slate-200 p-5 space-y-3 bg-slate-50/80 backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-bold text-slate-900">{rupiah(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm gap-2">
                <span className="flex-shrink-0 text-slate-600">Diskon</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="h-9 w-16 text-center border border-slate-300 rounded-lg flex-shrink-0 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={globalDiscountPct} 
                    onChange={(e) => setGlobalDiscountPct(Number(e.target.value))} 
                  />
                  <span className="text-slate-500 flex-shrink-0">%</span>
                  <span className="font-bold text-emerald-600 whitespace-nowrap">- {rupiah(globalDiscountAmount)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">PPN (11%)</span>
                <span className="font-bold text-slate-900">{rupiah(tax)}</span>
              </div>
              <div className="flex items-center justify-between text-lg border-t border-slate-200 pt-3">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{rupiah(total)}</span>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <input 
                  value={voucher} 
                  onChange={(e) => setVoucher(e.target.value)} 
                  placeholder="Kode voucher (HEMAT10)" 
                  className="w-full h-11 px-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
                <button 
                  onClick={() => setShowCheckout(true)} 
                  disabled={cart.length === 0} 
                  className="w-full h-12 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-500/30 transition-all"
                >
                  <CreditCard className="h-5 w-5" /> Bayar Sekarang
                </button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">PPN (11%)</span>
                <span className="font-bold text-slate-900">{rupiah(tax)}</span>
              </div>
              <div className="flex items-center justify-between text-lg border-t border-slate-200 pt-3">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{rupiah(total)}</span>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <input 
                  value={voucher} 
                  onChange={(e) => setVoucher(e.target.value)} 
                  placeholder="Kode voucher (HEMAT10)" 
                  className="w-full h-11 px-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
                <button 
                  onClick={() => setShowCheckout(true)} 
                  disabled={cart.length === 0} 
                  className="w-full h-12 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-500/30 transition-all"
                >
                  <CreditCard className="h-5 w-5" /> Bayar Sekarang
                </button>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Scan Barcode</h2>
              <button onClick={stopScanner} className="h-10 w-10 border border-slate-300 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-xl overflow-hidden" style={{ height: '240px' }}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-sm text-slate-600 text-center">
                Arahkan kamera ke barcode atau masukkan SKU manual
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualBarcode()}
                  placeholder="Ketik SKU manual..."
                  className="flex-1 h-11 px-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                  onClick={handleManualBarcode}
                  className="h-11 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg shadow-blue-500/25 transition-all"
                >
                  Cari
                </button>
              </div>
              
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                <strong>Contoh SKU:</strong> SKU-ARAB-250, SKU-TEH-050, SKU-AIR-600
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Drawer */}
      {showCheckout && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCheckout(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl overflow-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">Checkout</h2>
              <button onClick={() => setShowCheckout(false)} className="h-10 w-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Total Tagihan</span>
                  <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{rupiah(total)}</span>
                </div>
              </div>
              
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 block">Metode Pembayaran</span>
                <select className="w-full h-12 px-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                  <option>💵 Cash</option>
                  <option>📱 QRIS</option>
                  <option>💳 Kartu Debit/Kredit</option>
                </select>
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 block">Uang Diterima</span>
                <input 
                  type="number" 
                  placeholder="0" 
                  className="w-full h-12 px-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </label>
              
              <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                <span className="text-slate-600 font-medium">Kembalian</span>
                <span className="font-bold text-lg text-emerald-600">{rupiah(0)}</span>
              </div>
              
              <button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold shadow-lg shadow-blue-500/30 transition-all mt-6">
                Proses & Cetak Struk
              </button>
              
              <p className="text-xs text-slate-500 text-center mt-4">
                *Demo Mode — Hubungkan printer atau Email API untuk e-receipt
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 'use client';

// import { useState } from 'react';
// import { format } from 'date-fns';
// import ProtectedRoute from '@/components/protected-route/ProtectedRoute';
// import ProductSearch from './components/ProductSearch';
// import CartItem, { CartItemData } from './components/CartItem';
// import CartSummary from './components/CartSummary';
// import PaymentPanel from './components/PaymentPanel';
// import { Product } from '@/models/Product';

// export default function ManageCashier() {
//   const [cart, setCart] = useState<CartItemData[]>([]);
//   const [showPayment, setShowPayment] = useState(false);

//   // Add product to cart
//   const handleProductSelect = (product: Product) => {
//     setCart((prev) => {
//       const existingIndex = prev.findIndex((item) => item.product.productId === product.productId);
      
//       if (existingIndex >= 0) {
//         const updated = [...prev];
//         updated[existingIndex].quantity += 1;
//         return updated;
//       }
      
//       return [...prev, { product, quantity: 1, discount: 0 }];
//     });
//   };

//   // Update quantity
//   const handleQuantityChange = (productId: string, quantity: number) => {
//     if (quantity < 1) return;
    
//     setCart((prev) =>
//       prev.map((item) =>
//         item.product.productId === productId ? { ...item, quantity } : item
//       )
//     );
//   };

//   // Remove item
//   const handleRemove = (productId: string) => {
//     setCart((prev) => prev.filter((item) => item.product.productId !== productId));
//   };

//   // Calculate totals
//   const subtotal = cart.reduce(
//     (sum, item) => sum + (item.product.sellingPrice || 0) * item.quantity,
//     0
//   );
//   const totalDiscount = cart.reduce((sum, item) => sum + item.discount, 0);
//   const tax = Math.round((subtotal - totalDiscount) * 0.11);
//   const total = subtotal - totalDiscount + tax;

//   // Handle payment
//   const handlePaymentComplete = (amountPaid: number, paymentMethod: string) => {
//     // TODO: Create transaction via API
//     console.log('Payment completed:', { amountPaid, paymentMethod, cart });
    
//     // Reset cart
//     setCart([]);
//     setShowPayment(false);
//     alert('Transaction completed successfully!');
//   };

//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen bg-slate-50 p-6">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-2xl font-bold mb-6">Point of Sales</h1>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Left Panel: Product Search & Cart */}
//             <div className="lg:col-span-2 space-y-4">
//               {/* Search */}
//               <div className="bg-white rounded-xl shadow p-4">
//                 <ProductSearch onProductSelect={handleProductSelect} />
//               </div>

//               {/* Transaction Info */}
//               <div className="bg-white rounded-xl shadow p-4">
//                 <div className="grid grid-cols-3 gap-4 text-sm">
//                   <div>
//                     <div className="text-slate-500">Cashier</div>
//                     <div className="font-semibold">
//                       {localStorage.getItem('staffId') || 'Unknown'}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-slate-500">Date</div>
//                     <div className="font-semibold">
//                       {format(new Date(), 'dd/MM/yyyy HH:mm')}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-slate-500">Transaction ID</div>
//                     <div className="font-semibold">TRX-{Date.now()}</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Cart Items */}
//               <div className="bg-white rounded-xl shadow">
//                 <div className="p-4 border-b">
//                   <h2 className="font-semibold">Cart Items ({cart.length})</h2>
//                 </div>
                
//                 <div className="max-h-96 overflow-y-auto">
//                   {cart.length === 0 ? (
//                     <div className="p-8 text-center text-slate-500">
//                       No items in cart. Search and add products to start.
//                     </div>
//                   ) : (
//                     cart.map((item) => (
//                       <CartItem
//                         key={item.product.productId}
//                         item={item}
//                         onQuantityChange={handleQuantityChange}
//                         onRemove={handleRemove}
//                       />
//                     ))
//                   )}
//                 </div>
//               </div>

//               {/* Summary */}
//               {cart.length > 0 && (
//                 <div className="bg-white rounded-xl shadow p-4">
//                   <CartSummary
//                     subtotal={subtotal}
//                     discount={totalDiscount}
//                     tax={tax}
//                     total={total}
//                   />
                  
//                   <button
//                     onClick={() => setShowPayment(true)}
//                     className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
//                   >
//                     Proceed to Payment
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Right Panel: Payment */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-xl shadow p-4 sticky top-6">
//                 <h2 className="font-semibold mb-4">Payment</h2>
                
//                 {cart.length === 0 ? (
//                   <div className="text-center text-slate-500 py-8">
//                     Add items to cart first
//                   </div>
//                 ) : (
//                   <PaymentPanel
//                     total={total}
//                     onPaymentComplete={handlePaymentComplete}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Payment Modal (Optional) */}
//       {showPayment && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
//             <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
//             <PaymentPanel
//               total={total}
//               onPaymentComplete={handlePaymentComplete}
//             />
//             <button
//               onClick={() => setShowPayment(false)}
//               className="mt-4 w-full py-2 border rounded-lg hover:bg-slate-50"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </ProtectedRoute>
//   );
// }
