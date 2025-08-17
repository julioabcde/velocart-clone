// 'use client';

// import React from 'react';
// import { FaSyncAlt } from 'react-icons/fa';

// export default function ManageCashier() {
//   // dummy data for preview
//   const items = [
//     {
//       noRegistrasi: 'REG001',
//       namaBalita: 'Ani',
//       noRM: 'RM123',
//       usia: '2 thn',
//       instalasi: 'Instalasi A',
//       jenisKelamin: 'Perempuan',
//       tanggalLahir: '01 Jan 2023',
//       namaOrangTua: 'Budi',
//       alamat: 'Jl. Merdeka 1',
//       kecamatan: 'Cempaka',
//       kelurahan: 'Dahlia',
//       tanggalPengukuran: '01 Jul 2025',
//       beratBadan: 12.3,
//       tinggiBadan: 85,
//     },
//     {
//       noRegistrasi: 'REG002',
//       namaBalita: 'Budi',
//       noRM: 'RM124',
//       usia: '3 thn',
//       instalasi: 'Instalasi B',
//       jenisKelamin: 'Laki‑laki',
//       tanggalLahir: '15 Feb 2022',
//       namaOrangTua: 'Sari',
//       alamat: 'Jl. Sudirman 2',
//       kecamatan: 'Melati',
//       kelurahan: 'Mawar',
//       tanggalPengukuran: '02 Jul 2025',
//       beratBadan: 14.1,
//       tinggiBadan: 90,
//     },
//     {
//       noRegistrasi: 'REG001',
//       namaBalita: 'Ani',
//       noRM: 'RM123',
//       usia: '2 thn',
//       instalasi: 'Instalasi A',
//       jenisKelamin: 'Perempuan',
//       tanggalLahir: '01 Jan 2023',
//       namaOrangTua: 'Budi',
//       alamat: 'Jl. Merdeka 1',
//       kecamatan: 'Cempaka',
//       kelurahan: 'Dahlia',
//       tanggalPengukuran: '01 Jul 2025',
//       beratBadan: 12.3,
//       tinggiBadan: 85,
//     },
//     {
//       noRegistrasi: 'REG001',
//       namaBalita: 'Ani',
//       noRM: 'RM123',
//       usia: '2 thn',
//       instalasi: 'Instalasi A',
//       jenisKelamin: 'Perempuan',
//       tanggalLahir: '01 Jan 2023',
//       namaOrangTua: 'Budi',
//       alamat: 'Jl. Merdeka 1',
//       kecamatan: 'Cempaka',
//       kelurahan: 'Dahlia',
//       tanggalPengukuran: '01 Jul 2025',
//       beratBadan: 12.3,
//       tinggiBadan: 85,
//     },
//     {
//       noRegistrasi: 'REG001',
//       namaBalita: 'Ani',
//       noRM: 'RM123',
//       usia: '2 thn',
//       instalasi: 'Instalasi A',
//       jenisKelamin: 'Perempuan',
//       tanggalLahir: '01 Jan 2023',
//       namaOrangTua: 'Budi',
//       alamat: 'Jl. Merdeka 1',
//       kecamatan: 'Cempaka',
//       kelurahan: 'Dahlia',
//       tanggalPengukuran: '01 Jul 2025',
//       beratBadan: 12.3,
//       tinggiBadan: 85,
//     },
//     {
//       noRegistrasi: 'REG001',
//       namaBalita: 'Ani',
//       noRM: 'RM123',
//       usia: '2 thn',
//       instalasi: 'Instalasi A',
//       jenisKelamin: 'Perempuan',
//       tanggalLahir: '01 Jan 2023',
//       namaOrangTua: 'Budi',
//       alamat: 'Jl. Merdeka 1',
//       kecamatan: 'Cempaka',
//       kelurahan: 'Dahlia',
//       tanggalPengukuran: '01 Jul 2025',
//       beratBadan: 12.3,
//       tinggiBadan: 85,
//     },
//   ];

//   return (
//     <div className="card card-custom gutter-b">
//       {/* Header */}
//       <div className="card-header">
//         <div className="card-title">
//           <h3 className="card-label">Laporan Balita</h3>
//         </div>
//         <div className="card-toolbar">
//           <button className="btn btn-primary mr-2">Excel CSV</button>
//           <button className="btn btn-primary btn-refresh">
//             <FaSyncAlt />
//           </button>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="card-body space-y-4">
//         {/* Filters Row */}
//         <div className="flex flex-wrap -mx-2">
//           <div className="w-full sm:w-1/3 px-2 mb-4">
//             <input
//               type="text"
//               placeholder="Select date range"
//               className="w-full border px-3 py-2 rounded"
//             />
//             <small className="block text-gray-500 text-sm">
//               <b>Filter</b> tanggal
//             </small>
//           </div>
//           <div className="w-full sm:w-1/3 px-2 mb-4">
//             <select className="w-full border px-3 py-2 rounded">
//               <option>Instalasi A</option>
//               <option>Instalasi B</option>
//             </select>
//             <small className="block text-gray-500 text-sm">
//               <b>Filter</b> Instalasi
//             </small>
//           </div>
//           <div className="w-full sm:w-1/3 px-2 mb-4">
//             <input
//               type="text"
//               placeholder="Cari"
//               className="w-full border px-3 py-2 rounded"
//             />
//             <small className="block text-gray-500 text-sm">
//               <b>Kolom</b> pencarian
//             </small>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-scroll max-w-full">
//           <table className="divide-y divide-gray-200 text-sm text-center">
//             <thead className="bg-gray-50 sticky top-0">
//               <tr>
//                 {[
//                   'NO. REGISTRASI',
//                   'NAMA BALITA',
//                   'NO. RM',
//                   'USIA',
//                   'INSTALASI',
//                   'JENIS KELAMIN',
//                   'TANGGAL LAHIR',
//                   'NAMA ORANGTUA',
//                   'ALAMAT LENGKAP',
//                   'KECAMATAN',
//                   'KELURAHAN',
//                   'TANGGAL PENGUKURAN',
//                   'BERAT BADAN(kg)',
//                   'PANJANG/TINGGI BADAN(cm)',
//                 ].map((col) => (
//                   <th
//                     key={col}
//                     className="px-3 py-2 whitespace-nowrap font-medium text-gray-700"
//                   >
//                     {col}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-100">
//               {items.map((data) => (
//                 <tr key={data.noRegistrasi}>
//                   <td className="px-3 py-2">{data.noRegistrasi}</td>
//                   <td className="px-3 py-2">{data.namaBalita}</td>
//                   <td className="px-3 py-2">{data.noRM}</td>
//                   <td className="px-3 py-2">{data.usia}</td>
//                   <td className="px-3 py-2">{data.instalasi}</td>
//                   <td className="px-3 py-2">{data.jenisKelamin}</td>
//                   <td className="px-3 py-2">{data.tanggalLahir}</td>
//                   <td className="px-3 py-2">{data.namaOrangTua}</td>
//                   <td className="px-3 py-2">{data.alamat}</td>
//                   <td className="px-3 py-2">{data.kecamatan}</td>
//                   <td className="px-3 py-2">{data.kelurahan}</td>
//                   <td className="px-3 py-2">{data.tanggalPengukuran}</td>
//                   <td className="px-3 py-2">{data.beratBadan}</td>
//                   <td className="px-3 py-2">{data.tinggiBadan}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Paginator (static preview) */}
//         <div className="flex justify-between items-center pt-4">
//           <button className="btn btn-default">Previous</button>
//           <span className="text-sm text-gray-600">Page 1 of 5</span>
//           <button className="btn btn-default">Next</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// Manage Product — Super-Advance Rainbow UI (Next.js + Tailwind + Lucide)
// Highlights: gradient hero, colorful chips, glass filters, soft shadows, zebra rows, sticky header, focus rings
// Plug your handlers into the props below.

// "use client";

// import { useMemo } from "react";
// import { Plus, RefreshCw, Download, Eye, Pencil, Trash2, Printer, Search } from "lucide-react";

// export default function ManageProductModern({
//   data = [],
//   page = 1,
//   pageSize = 10,
//   total = 0,
//   isLoading = false,
//   onAdd,
//   onRefresh,
//   onExport,
//   onView,
//   onEdit,
//   onDelete,
//   onPrint,
//   ToolbarExtra,
// }) {
//   const columns = useMemo(
//     () => [
//       { key: "product_id", label: "Product ID", width: "w-36" },
//       { key: "product_name", label: "Product Name", width: "min-w-[260px]" },
//       { key: "base_price", label: "Base Price", width: "w-32" },
//       { key: "selling_price", label: "Selling Price", width: "w-36" },
//       { key: "unit", label: "Unit", width: "w-24" },
//       { key: "updated_at", label: "Updated", width: "w-44" },
//       { key: "updated_by", label: "By", width: "w-28" },
//     ],
//     []
//   );

//   return (
//     <div className="space-y-5">
//       {/* Gradient hero header */}
//       <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-400 p-[1px] shadow-lg">
//         <div className="rounded-[22px] bg-white/70 dark:bg-slate-900/60 backdrop-blur p-5">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-cyan-600">
//                 Manage Product
//               </h1>
//               <p className="mt-1 text-sm text-slate-600">Kelola katalog produk dengan tampilan modern & berwarna.</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <RainbowBtn onClick={onAdd} icon={<Plus className="h-4 w-4" />}>
//                 Add Product
//               </RainbowBtn>
//               <SoftBtn onClick={onExport} icon={<Download className="h-4 w-4" />}>Excel CSV</SoftBtn>
//               <SoftBtn onClick={onRefresh} icon={<RefreshCw className="h-4 w-4" />}>Refresh</SoftBtn>
//               {ToolbarExtra}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters glass cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <GlassCard>
//           <div className="text-xs text-slate-500 mb-1">Tanggal</div>
//           <div className="h-11 rounded-xl border border-slate-300/70 bg-white/80 px-3 flex items-center">DateRangePicker</div>
//         </GlassCard>
//         <GlassCard>
//           <div className="text-xs text-slate-500 mb-1">Instalasi</div>
//           <select className="h-11 w-full rounded-xl border border-slate-300/70 bg-white/80 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
//             <option>Instalasi A</option>
//             <option>Instalasi B</option>
//           </select>
//         </GlassCard>
//         <GlassCard>
//           <div className="text-xs text-slate-500 mb-1">Cari</div>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <input className="h-11 w-full rounded-xl border border-slate-300/70 bg-white/80 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400" placeholder="Cari produk..." />
//           </div>
//         </GlassCard>
//       </div>

//       {/* Table colorful */}
//       <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg bg-white">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="sticky top-0 z-10">
//               <tr className="bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 text-white">
//                 {columns.map((c) => (
//                   <th key={c.key} className={`px-4 py-3 font-semibold ${c.width}`}>{c.label}</th>
//                 ))}
//                 <th className="px-4 py-3 text-right w-44">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading && Array.from({ length: 6 }).map((_, i) => (
//                 <tr key={i} className="border-t border-slate-100">
//                   <td colSpan={columns.length + 1} className="px-4 py-4">
//                     <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
//                   </td>
//                 </tr>
//               ))}

//               {!isLoading && data.length === 0 && (
//                 <tr className="border-t border-slate-100">
//                   <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-slate-500">
//                     Tidak ada data untuk ditampilkan
//                   </td>
//                 </tr>
//               )}

//               {!isLoading && data.map((row: any, idx: number) => (
//                 <tr
//                   key={row.product_id ?? idx}
//                   className={
//                     "border-t border-slate-100 odd:bg-slate-50/60 hover:bg-gradient-to-r hover:from-fuchsia-50 hover:via-indigo-50 hover:to-cyan-50"
//                   }
//                 >
//                   <td className="px-4 py-3 font-semibold text-slate-800">{row.product_id}</td>
//                   <td className="px-4 py-3 text-slate-700">
//                     <div className="truncate max-w-[320px]">{row.product_name}</div>
//                   </td>
//                   <td className="px-4 py-3 tabular-nums text-indigo-700">{row.base_price}</td>
//                   <td className="px-4 py-3 tabular-nums text-emerald-700">{row.selling_price}</td>
//                   <td className="px-4 py-3">
//                     <span className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-100 via-fuchsia-100 to-indigo-100 px-3 py-1 text-[11px] font-medium text-fuchsia-700">
//                       {row.unit}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-slate-600">{row.updated_at}</td>
//                   <td className="px-4 py-3 text-slate-600">{row.updated_by}</td>
//                   <td className="px-4 py-3">
//                     <div className="flex items-center justify-end gap-2">
//                       <Pill onClick={() => onView?.(row)} color="emerald" icon={<Eye className="h-4 w-4" />}>View</Pill>
//                       <Pill onClick={() => onEdit?.(row)} color="indigo" icon={<Pencil className="h-4 w-4" />}>Edit</Pill>
//                       <Pill onClick={() => onDelete?.(row)} color="rose" icon={<Trash2 className="h-4 w-4" />}>Delete</Pill>
//                       <Pill onClick={() => onPrint?.(row)} color="cyan" icon={<Printer className="h-4 w-4" />}>Print</Pill>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Footer / Pagination summary (hook up your component) */}
//       <div className="flex items-center justify-between text-sm text-slate-600">
//         <div>
//           <span className="font-medium text-slate-800">Page {page}</span>
//           <span className="mx-2">•</span>
//           <span>Page size {pageSize}</span>
//           <span className="mx-2">•</span>
//           <span>Total {total}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="h-9 w-9 rounded-xl border border-slate-300 grid place-items-center bg-white">«</div>
//           <div className="h-9 w-9 rounded-xl border border-slate-300 grid place-items-center bg-white">»</div>
//         </div>
//       </div>

//       {/* Floating Add Button for quick action */}
//       <button
//         onClick={onAdd}
//         className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-500 px-5 py-3 text-white shadow-xl hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-fuchsia-300"
//       >
//         <Plus className="h-4 w-4" /> Add Product
//       </button>
//     </div>
//   );
// }

// /* ====== Subcomponents ====== */
// function GlassCard({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur p-3 shadow-sm">
//       {children}
//     </div>
//   );
// }

// function SoftBtn({ children, icon, onClick }: any) {
//   return (
//     <button
//       onClick={onClick}
//       className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
//     >
//       {icon} {children}
//     </button>
//   );
// }

// function RainbowBtn({ children, icon, onClick }: any) {
//   return (
//     <button
//       onClick={onClick}
//       className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
//     >
//       {icon} {children}
//     </button>
//   );
// }

// function Pill({ children, color = "indigo", icon, onClick }: any) {
//   const map: Record<string, string> = {
//     indigo: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
//     emerald: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
//     rose: "bg-rose-50 text-rose-700 hover:bg-rose-100",
//     cyan: "bg-cyan-50 text-cyan-700 hover:bg-cyan-100",
//   };
//   return (
//     <button
//       onClick={onClick}
//       className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${map[color]} transition`}
//     >
//       {icon} {children}
//     </button>
//   );
// }

// POS Cart — Expert Modern AI-Driven POS Design (React + Tailwind)
// Tema: High-end retail POS dengan nuansa modern, clean, futuristik AI
// - Light mode only dengan palet putih + abu netral, aksen biru elektrik
// - Layout simetris, informasi mudah dibaca, fokus transaksi cepat
// - Komponen compact tapi jelas, interaksi <100ms
// - Typography kuat untuk angka, warna status jelas

"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, Plus, Minus, Trash2, CreditCard, Percent, X, History, Settings, Save, Moon, Sun, Tag, QrCode } from "lucide-react";
import ProtectedRoute from "@/components/protected-route/ProtectedRoute";

// ===== Helpers
const rupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

// ===== Mock Data
const CATEGORIES = ["Semua", "Minuman", "Makanan", "Snack", "Kebutuhan Harian"] as const;
type Category = typeof CATEGORIES[number];

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: Category;
  discountPct?: number;
};

const PRODUCTS: Product[] = [
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

type CartItem = { product: Product; qty: number; discountPct?: number };

function useDebounced<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}

export default function POSModernPage() {
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<Category>("Semua");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [voucher, setVoucher] = useState("");
  const [globalDiscountPct, setGlobalDiscountPct] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
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

  // ===== Visual tokens
  const surface = "bg-white/70 dark:bg-slate-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/50";
  const card = "rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/70 shadow-sm";
  const input = "h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 px-3 text-sm outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-500";
  const chip = (active: boolean) =>
    active ? "px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow" : "px-3 py-1.5 rounded-full text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/60";
  const primaryBtn = "inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50";
  const subtleBtn = "inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm hover:bg-slate-50/60 dark:hover:bg-slate-800/60";

  return (
    <ProtectedRoute>
      <div className={(dark ? "dark " : "") + "min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-10%,#EEF2FF_20%,transparent),radial-gradient(1200px_600px_at_80%_110%,#F5F3FF_20%,transparent)] dark:bg-[radial-gradient(1200px_600px_at_20%_-10%,#0B1220_20%,transparent),radial-gradient(1200px_600px_at_80%_110%,#0F172A_20%,transparent)] text-slate-900 dark:text-slate-100"}>
        {/* Header */}
        <header className={"sticky top-0 z-30 border-b border-slate-200/60 dark:border-slate-800/60 " + surface}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow" />
              <div>
                <div className="font-semibold">TemanAkun POS</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Modern • Keyboard-first • WCAG AA</div>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { const q = query.trim().toLowerCase(); const exact = PRODUCTS.find(p => p.sku.toLowerCase() === q); addToCart(exact ?? filtered[0]!); setQuery(""); }
                    if (e.key === "Escape") setQuery("");
                  }}
                  placeholder="Cari nama/SKU atau scan… (Ctrl/Cmd + K)"
                  className={"w-full pl-10 pr-16 " + input}
                />
                <div className="absolute right-2 top-1.5 hidden md:flex">
                  <kbd className="px-2 py-1 text-[11px] rounded-md border border-slate-200 dark:border-slate-700 text-slate-500">Ctrl/Cmd + K</kbd>
                </div>
                {query && (
                  <div className={"absolute mt-2 w-full max-h-96 overflow-auto " + card}>
                    {filtered.length === 0 ? (
                      <div className="p-4 text-sm text-slate-500">Tidak ada hasil untuk “{query}”.</div>
                    ) : (
                      <ul className="divide-y divide-slate-100/70 dark:divide-slate-800/60">
                        {filtered.slice(0, 8).map((p) => (
                          <li key={p.id} className="flex items-center gap-3 p-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/60 cursor-pointer" onClick={() => addToCart(p)}>
                            <div className="h-10 w-10 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 grid place-items-center text-[10px] text-slate-500">IMG</div>
                            <div className="flex-1">
                              <div className="font-medium">{p.name}</div>
                              <div className="text-xs text-slate-500">{p.sku}</div>
                            </div>
                            <div className="text-sm font-semibold tabular-nums">{rupiah(p.price)}</div>
                            {p.discountPct ? (
                              <span className="ml-2 inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-xs bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/80 dark:border-emerald-800/50 px-2 py-0.5 rounded-full"><Tag className="h-3 w-3" />{p.discountPct}%</span>
                            ) : null}
                            <button className={"ml-3 " + subtleBtn}>Tambah</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button className={subtleBtn}><Save className="h-4 w-4" /> Parkir</button>
              <button className={subtleBtn}><History className="h-4 w-4" /> Riwayat</button>
              <button className={subtleBtn}><Settings className="h-4 w-4" /> Settings</button>
              <button onClick={() => setDark((d) => !d)} className={subtleBtn}>{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} {dark ? "Light" : "Dark"}</button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar categories */}
          <aside className={"lg:col-span-2 " + card}>
            <div className="p-3">
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Kategori</div>
              <div className="flex lg:flex-col flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setActiveCat(cat)} className={chip(activeCat === cat)}>{cat}</button>
                ))}
              </div>
            </div>
          </aside>

          {/* Catalog */}
          <section className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((p) => (
                <article key={p.id} className={card + " p-3 group hover:shadow-md transition-shadow"}>
                  <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 mb-3 grid place-items-center text-slate-400">IMG</div>
                  <h3 className="text-sm font-semibold line-clamp-2 min-h-[2.75rem]">{p.name}</h3>
                  <div className="mt-1 text-xs text-slate-500">{p.sku}</div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="font-bold tabular-nums">{rupiah(p.price)}</div>
                    {p.discountPct ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-[11px] bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/80 dark:border-emerald-800/50 px-2 py-0.5 rounded-full"><Tag className="h-3 w-3" />{p.discountPct}%</span>
                    ) : <span className="text-xs text-slate-500">Stok {p.stock}</span>}
                  </div>
                  <button onClick={() => addToCart(p)} className={"mt-3 w-full " + primaryBtn}>
                    <Plus className="h-4 w-4" /> Tambah
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* Cart */}
          <aside className="lg:col-span-3">
            <div className={card + " overflow-hidden sticky top-24 max-h-[72vh] flex flex-col"}>
              <div className="px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/60 flex items-center justify-between">
                <div className="font-semibold">Daftar Transaksi</div>
                <div className="text-xs text-slate-500">Item: {cart.reduce((s, c) => s + c.qty, 0)}</div>
              </div>
              <div className="flex-1 overflow-auto divide-y divide-slate-100/70 dark:divide-slate-800/60">
                {cart.length === 0 ? (
                  <div className="h-full grid place-items-center text-slate-500 p-6 text-sm text-center">
                    <div className="max-w-[16rem]">
                      <QrCode className="mx-auto mb-2 h-6 w-6" />
                      Mulai cari produk (Ctrl/Cmd + K) atau klik Tambah pada katalog.
                    </div>
                  </div>
                ) : (
                  cart.map((c) => (
                    <div key={c.product.id} className="grid grid-cols-[56px_1fr_auto] gap-3 p-3 items-center">
                      <div className="h-14 w-14 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 grid place-items-center text-[10px] text-slate-500">IMG</div>
                      <div>
                        <div className="font-medium">{c.product.name}</div>
                        <div className="text-xs text-slate-500">{c.product.sku}</div>
                        {c.discountPct ? (
                          <span className="mt-1 inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-[11px] bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/80 dark:border-emerald-800/50 px-2 py-0.5 rounded-full"><Tag className="h-3 w-3" />{c.discountPct}%</span>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{rupiah(Math.round(c.product.price * (1 - (c.discountPct ?? 0) / 100)))}</div>
                        <div className="mt-2 inline-flex items-center gap-1">
                          <button onClick={() => setQty(c.product.id, c.qty - 1)} className={subtleBtn + " h-8 w-8 p-0 grid place-items-center"}><Minus className="h-4 w-4" /></button>
                          <input type="number" value={c.qty} min={0} max={c.product.stock} onChange={(e) => setQty(c.product.id, Number(e.target.value))} className={"h-8 w-12 text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"} />
                          <button onClick={() => setQty(c.product.id, c.qty + 1)} className={subtleBtn + " h-8 w-8 p-0 grid place-items-center"}><Plus className="h-4 w-4" /></button>
                          <button onClick={() => removeFromCart(c.product.id)} className="h-8 w-8 p-0 grid place-items-center rounded-xl border border-rose-200/70 text-rose-600 hover:bg-rose-50/60 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">Subtotal: {rupiah(Math.round(c.product.price * (1 - (c.discountPct ?? 0) / 100)) * c.qty)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Summary */}
              <div className="border-t border-slate-200/70 dark:border-slate-800/60 p-4 space-y-3 bg-white/60 dark:bg-slate-900/50">
                <div className="flex items-center justify-between text-sm"><span>Subtotal</span><span className="font-semibold tabular-nums">{rupiah(subtotal)}</span></div>
                <div className="flex items-center justify-between text-sm gap-2">
                  <span>Diskon Global</span>
                  <div className="flex items-center gap-2">
                    <input type="number" className={"h-9 w-16 text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"} value={globalDiscountPct} onChange={(e) => setGlobalDiscountPct(Number(e.target.value))} />
                    <span className="text-slate-500">%</span>
                    <span className="font-semibold tabular-nums">- {rupiah(globalDiscountAmount)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm"><span>PPN (11%)</span><span className="font-semibold tabular-nums">{rupiah(tax)}</span></div>
                <div className="flex items-center justify-between text-base border-t pt-2"><span className="font-semibold">Total</span><span className="font-bold tabular-nums">{rupiah(total)}</span></div>
                <div className="flex items-center justify-between gap-2">
                  <input value={voucher} onChange={(e) => setVoucher(e.target.value)} placeholder="Kode voucher (cth: HEMAT10)" className={"flex-1 " + input} />
                  <button onClick={() => setShowCheckout(true)} disabled={cart.length === 0} className={primaryBtn}><CreditCard className="h-4 w-4" /> Bayar</button>
                </div>
              </div>
            </div>
          </aside>
        </main>

        {/* Checkout Drawer */}
        {showCheckout && (
          <div className="fixed inset-0 z-40">
            <div className="absolute inset-0 bg-slate-900/50" onClick={() => setShowCheckout(false)} />
            <div className={"absolute right-0 top-0 h-full w-full sm:w-[480px] p-6 overflow-auto " + card}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Checkout</h2>
                <button onClick={() => setShowCheckout(false)} className={subtleBtn + " h-9 w-9 p-0 grid place-items-center"}><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between"><span className="text-slate-600 dark:text-slate-400">Total Tagihan</span><span className="font-bold text-base">{rupiah(total)}</span></div>
                <label className="block"><span className="text-slate-600 dark:text-slate-400">Metode Pembayaran</span>
                  <select className={"mt-1 w-full " + input}><option>Cash</option><option>QRIS</option><option>Kartu Debit/Kredit</option></select>
                </label>
                <label className="block"><span className="text-slate-600 dark:text-slate-400">Diterima</span>
                  <input type="number" placeholder="0" className={"mt-1 w-full " + input} />
                </label>
                <div className="flex items-center justify-between"><span className="text-slate-600 dark:text-slate-400">Kembalian</span><span className="font-semibold">{rupiah(0)}</span></div>
                <button className={primaryBtn + " w-full mt-2"}>Proses & Cetak Struk</button>
                <p className="text-xs text-slate-500 dark:text-slate-400">*Demo — hubungkan printer/Email API untuk e-receipt.</p>
              </div>
            </div>
          </div>
        )}

        <footer className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">v0.2 — Modern redesign (glass + gradient, dark mode, sticky cart)</footer>
      </div>
    </ProtectedRoute>
  );
}
