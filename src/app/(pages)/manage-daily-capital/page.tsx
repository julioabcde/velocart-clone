export default function MasterDailyCapital() {
  return (
    <h1>This is Daily Capital Page</h1>
  )
}

// 'use client'

// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';

// // export default function ManageDailyCapital() {
// // }

// // POS Layout Updated to Match Clean Green-Themed UI

// import { useState } from 'react';
// import {
//   UserCircle,
//   CreditCard,
//   Wallet,
//   QrCode,
//   ChevronDown,
//   ChevronUp,
//   Minus,
//   Plus,
// } from 'lucide-react';

// const dummyResults = [
//   { code: 'K037', name: 'Amoxilin BPJS', price: 1221, stock: 18477, location: 'Gudang Farmasi' },
//   { code: 'BRG-00398', name: 'amox pil', price: 130000, stock: 7, location: 'Gizi' },
// ];

// export default function ModernPOS() {
//   const [search, setSearch] = useState('');
//   const [results, setResults] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [expanded, setExpanded] = useState(true);
//   const [quantity, setQuantity] = useState(1);

//   const handleSearch = (value) => {
//     setSearch(value);
//     setResults(dummyResults);
//   };

//   const handleSelectProduct = (product) => {
//     setSelectedProduct(product);
//     setExpanded(true);
//   };

//   return (
//     <div className="min-h-screen bg-[#f3f7fa] text-slate-800 p-6">
//       {/* Header */}
//       <header className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Point of Sales V2</h1>
//         <UserCircle className="h-7 w-7 text-slate-500" />
//       </header>

//       <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
//         {/* Search + Detail */}
//         <div className="xl:col-span-8 space-y-4">
//           <div className="bg-white p-4 rounded-2xl shadow-sm">
//             <label className="block text-sm font-medium mb-1">Barang / Tindakan</label>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder="Cari Obat / Barang"
//                 value={search}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="flex-1 p-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               <button className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium">Barang</button>
//             </div>
//           </div>

//           {results.length > 0 && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {results.map((item, i) => (
//                 <button
//                   key={i}
//                   onClick={() => handleSelectProduct(item)}
//                   className={`p-4 rounded-2xl text-left shadow-sm border border-slate-300 font-semibold text-white flex items-center gap-3 transition hover:brightness-95 ${selectedProduct?.code === item.code ? 'bg-green-600' : 'bg-green-500'}`}
//                 >
//                   <span className="inline-block bg-white/20 p-2 rounded-full">
//                     💊
//                   </span>
//                   <span className="text-sm">
//                     {item.name} ({item.code})
//                   </span>
//                 </button>
//               ))}
//             </div>
//           )}

//           {selectedProduct && (
//             <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5 space-y-4">
//               <div className="flex justify-between items-center">
//                 <h3 className="font-bold text-green-700 text-sm">
//                   {selectedProduct.name} ({selectedProduct.code})
//                 </h3>
//                 <button onClick={() => setExpanded(!expanded)}>
//                   {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//                 </button>
//               </div>

//               {expanded && (
//                 <div className="space-y-3 text-sm">
//                   <div>
//                     <label className="block text-xs mb-1">Harga Satuan</label>
//                     <input
//                       type="text"
//                       value={selectedProduct.price}
//                       className="w-full p-2 border border-slate-300 rounded-md"
//                       readOnly
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs mb-1">Quantity</label>
//                     <div className="flex items-center gap-2">
//                       <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 bg-slate-100 rounded-full">
//                         <Minus className="w-4 h-4" />
//                       </button>
//                       <span>{quantity}</span>
//                       <button onClick={() => setQuantity(quantity + 1)} className="p-2 bg-slate-100 rounded-full">
//                         <Plus className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-xs mb-1">Diskon</label>
//                     <input type="number" className="w-full p-2 border border-slate-300 rounded-md" defaultValue={0} />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs mb-1">Sharing Fee Perawat</label>
//                       <input type="number" className="w-full p-2 border border-slate-300 rounded-md" defaultValue={0} />
//                     </div>
//                     <div>
//                       <label className="block text-xs mb-1">Sharing Fee Dokter</label>
//                       <input type="number" className="w-full p-2 border border-slate-300 rounded-md" defaultValue={0} />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Bill Details */}
//         <div className="xl:col-span-4">
//           <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
//             <h2 className="text-lg font-bold text-slate-700 border-b pb-2">Bill Details</h2>

//             {selectedProduct && (
//               <div className="space-y-4 text-sm">
//                 <div>
//                   <h3 className="text-green-600 font-bold">{selectedProduct.name} ({selectedProduct.code})</h3>
//                   <ul className="text-xs mt-1 space-y-1">
//                     <li>Harga Satuan: Rp{selectedProduct.price.toLocaleString('id-ID')}</li>
//                     <li>Quantity: {quantity}</li>
//                     <li>Diskon: Rp0,00</li>
//                     <li>Sharing Fee Dokter: Rp0,00</li>
//                     <li>Sharing Fee Perawat: Rp0,00</li>
//                   </ul>
//                 </div>
//               </div>
//             )}

//             <div className="border-t pt-4 text-sm">
//               <h4 className="font-semibold mb-2">Ringkasan</h4>
//               <div className="flex justify-between">
//                 <span>Item</span>
//                 <span>1 item</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>Rp{selectedProduct ? selectedProduct.price.toLocaleString('id-ID') : '0'}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Pajak</span>
//                 <span>Rp0,00</span>
//               </div>
//               <div className="flex justify-between font-bold text-green-700 mt-2">
//                 <span>Total</span>
//                 <span>Rp{selectedProduct ? selectedProduct.price.toLocaleString('id-ID') : '0'}</span>
//               </div>
//             </div>

//             <button className="w-full py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700">
//               Lanjut ke Pembayaran
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
//    return (
//       <div className="text-center">hello</div>
//    );
// }
