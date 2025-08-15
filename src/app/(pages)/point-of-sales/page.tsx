// 'use client'

// import { useState } from 'react';
// import { Calendar } from 'lucide-react';
// import { format } from 'date-fns';

// export default function PointOfSalePanel() {
//   const [barcode, setBarcode] = useState('');
//   const [dateRangeOpen, setDateRangeOpen] = useState(false);
//   const [dateLabel, setDateLabel] = useState('8/1/2025 – 8/1/2025');

//   // dummy product rows
//   const items = Array(4).fill({
//     name: 'Indomie Goreng',
//     price: 2500,
//     qty: 10,
//     disc: 800,
//     total: 24200,
//   });

//   // summary calculations (hard-coded for illustration)
//   const subtotal = 96800;
//   const paymentDisc = 3200;
//   const totalPayment = subtotal - paymentDisc;
//   const paidAmount = 100000;
//   const changeDue = paidAmount - totalPayment;

//   return (
//     <div className="flex gap-6">
//       {/* Left panel */}
//       <div className="flex-1 bg-white rounded shadow p-4 space-y-4">
//         {/* Barcode / date */}
//         <div className="space-y-2">
//           <input
//             type="text"
//             placeholder="Scan your barcode / Enter your barcode id"
//             className="w-full border rounded-full px-4 py-2 focus:outline-none"
//             value={barcode}
//             onChange={e => setBarcode(e.target.value)}
//           />

//           {/* Cashier info */}
//           <div className="border rounded p-3 text-sm space-y-1">
//             <div><strong>Cashier :</strong> Cashier-AX01</div>
//             <div><strong>Date :</strong> {format(new Date(), 'dd/MM/yyyy HH:mm:ss')}</div>
//             <div><strong>Transaction ID :</strong> 001</div>
//           </div>
//         </div>

//         {/* Items table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead className="border-b">
//               <tr className="text-sm font-medium text-gray-700">
//                 <th className="px-2 py-1">Product</th>
//                 <th className="px-2 py-1">Price</th>
//                 <th className="px-2 py-1">Qty</th>
//                 <th className="px-2 py-1">Disc</th>
//                 <th className="px-2 py-1">Total</th>
//                 <th className="px-2 py-1">Action</th>
//               </tr>
//             </thead>
//             <tbody className="text-sm">
//               {items.map((it, i) => (
//                 <tr key={i} className="border-b last:border-0">
//                   <td className="px-2 py-2">{it.name}</td>
//                   <td className="px-2 py-2">{it.price.toLocaleString()}</td>
//                   <td className="px-2 py-2">
//                     <input
//                       type="number"
//                       className="w-16 border rounded px-1 py-0.5"
//                       defaultValue={it.qty}
//                     />
//                   </td>
//                   <td className="px-2 py-2">{it.disc.toLocaleString()}</td>
//                   <td className="px-2 py-2">{`Rp${it.total.toLocaleString()}`}</td>
//                   <td className="px-2 py-2 text-red-500 cursor-pointer">🗑️</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Summary */}
//         <div className="space-y-1 text-sm">
//           <div className="flex justify-between"><span>Subtotal</span><span>{`Rp${subtotal.toLocaleString()}`}</span></div>
//           <div className="flex justify-between"><span>Diskon Pembayaran</span><span>{`Rp${paymentDisc.toLocaleString()}`}</span></div>
//           <div className="flex justify-between bg-red-100 text-red-700 font-medium"><span>Total Pembayaran</span><span>{`Rp${totalPayment.toLocaleString()}`}</span></div>
//           <div className="flex justify-between bg-green-100 text-green-700 font-medium"><span>Dibayarkan</span><span>{`Rp${paidAmount.toLocaleString()}`}</span></div>
//           <div className="flex justify-between bg-yellow-100 text-yellow-800 font-medium"><span>Total Kembalian</span><span>{`Rp${changeDue.toLocaleString()}`}</span></div>
//         </div>
//       </div>

//       {/* Right panel */}
//       <aside className="w-80 bg-white rounded shadow p-4 space-y-6">
//         {/* Search product */}
//         <div>
//           <label className="block text-sm font-medium">Temukan Product</label>
//           <div className="mt-1 relative">
//             <input
//               type="text"
//               placeholder="Search your product"
//               className="w-full border rounded px-3 py-2 focus:outline-none"
//             />
//             <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//           </div>
//           <p className="text-xs text-gray-500 mt-1">Cari nama produk kemudian pilih produk yang sesuai</p>
//         </div>

//         {/* Payment details */}
//         <div>
//           <label className="block text-sm font-medium">Detail Pembayaran</label>
//           <input
//             type="text"
//             defaultValue={paidAmount}
//             className="mt-1 w-full border rounded px-3 py-2 focus:outline-none"
//           />
//           <div className="mt-2 grid grid-cols-3 gap-2">
//             {['+Rp500', '+Rp1.000', '+Rp5.000', '+Rp10.000', '+Rp20.000', '+Rp50.000', '+Rp100.000', '+Rp200.000', 'Bayar Penuh'].map((b, i) => (
//               <button key={i} className="w-full py-2 bg-gray-200 rounded text-xs">{b}</button>
//             ))}
//           </div>
//         </div>

//         {/* Numeric keypad + action */}
//         <div className="space-y-4">
//           <div className="grid grid-cols-3 gap-2">
//             {['7', '8', '9', '4', '5', '6', '*', '0', '⌫'].map((k, i) => (
//               <button key={i} className="h-12 bg-gray-200 rounded text-lg">{k}</button>
//             ))}
//           </div>
//           <button className="w-full py-3 bg-gray-500 text-white rounded font-medium">
//             Create Transaction
//           </button>
//         </div>
//       </aside>
//     </div>
//   );
// }

// components/PointOfSalePanel.jsx
// 'use client'

// import { useState } from 'react'
// import { Calendar } from 'lucide-react'
// import { format } from 'date-fns'

// export default function PointOfSalePanel() {
//   const [barcode, setBarcode] = useState('')
//   const [paidAmount, setPaidAmount] = useState(100000)

//   // dummy items
//   const items = Array(4).fill({
//     name: 'Indomie Goreng',
//     price: 2500,
//     qty:   10,
//     disc:  800,
//     total: 24200,
//   })

//   // summary calculations
//   const subtotal     = items.reduce((sum, i) => sum + i.total, 0)
//   const paymentDisc  = 3200
//   const totalPayment = subtotal - paymentDisc
//   const changeDue    = paidAmount - totalPayment

//   return (
//     <div className="flex gap-6">
//       {/* ─────────────────────────────────────────────────────────────────────────────
//           LEFT PANEL: barcode, cashier info, items table, summary
//       ───────────────────────────────────────────────────────────────────────────── */}
//       <div className="flex-1 bg-white rounded-lg shadow-md p-6 space-y-6">
//         {/* Barcode input */}
//         <div className="space-y-3">
//           <input
//             type="text"
//             placeholder="Scan your barcode / Enter your barcode id"
//             className="w-full border border-gray-300 rounded-full px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             value={barcode}
//             onChange={e => setBarcode(e.target.value)}
//           />

//           {/* Cashier info */}
//           <div className="border border-gray-200 rounded-md p-4 bg-gray-50 text-sm space-y-1">
//             <div><strong>Cashier :</strong> Cashier-AX01</div>
//             <div><strong>Date :</strong> {format(new Date(), 'dd/MM/yyyy HH:mm:ss')}</div>
//             <div><strong>Transaction ID :</strong> 001</div>
//           </div>
//         </div>

//         {/* Items table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead className="bg-gray-100 border-b border-gray-200">
//               <tr className="text-sm font-semibold text-gray-700">
//                 <th className="px-4 py-2">Product</th>
//                 <th className="px-4 py-2">Price</th>
//                 <th className="px-4 py-2">Qty</th>
//                 <th className="px-4 py-2">Disc</th>
//                 <th className="px-4 py-2">Total</th>
//                 <th className="px-4 py-2">Action</th>
//               </tr>
//             </thead>
//             <tbody className="text-sm">
//               {items.map((it, i) => (
//                 <tr
//                   key={i}
//                   className="border-b border-gray-100 hover:bg-gray-50"
//                 >
//                   <td className="px-4 py-3">{it.name}</td>
//                   <td className="px-4 py-3">{it.price.toLocaleString()}</td>
//                   <td className="px-4 py-3">
//                     <input
//                       type="number"
//                       className="w-16 border border-gray-300 rounded px-1 py-0.5"
//                       defaultValue={it.qty}
//                     />
//                   </td>
//                   <td className="px-4 py-3">{it.disc.toLocaleString()}</td>
//                   <td className="px-4 py-3">{`Rp${it.total.toLocaleString()}`}</td>
//                   <td className="px-4 py-3 text-red-500 cursor-pointer">
//                     🗑️
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Summary bars */}
//         <div className="space-y-1 text-sm">
//           <div className="flex justify-between">
//             <span>Subtotal</span>
//             <span>{`Rp${subtotal.toLocaleString()}`}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Diskon Pembayaran</span>
//             <span>{`Rp${paymentDisc.toLocaleString()}`}</span>
//           </div>
//           <div className="w-full py-1 flex justify-between bg-red-200 text-red-800 font-medium rounded">
//             <span>Total Pembayaran</span>
//             <span>{`Rp${totalPayment.toLocaleString()}`}</span>
//           </div>
//           <div className="w-full py-1 flex justify-between bg-green-200 text-green-800 font-medium rounded">
//             <span>Dibayarkan</span>
//             <span>{`Rp${paidAmount.toLocaleString()}`}</span>
//           </div>
//           <div className="w-full py-1 flex justify-between bg-yellow-200 text-yellow-900 font-medium rounded">
//             <span>Total Kembalian</span>
//             <span>{`Rp${changeDue.toLocaleString()}`}</span>
//           </div>
//         </div>
//       </div>

//       {/* ─────────────────────────────────────────────────────────────────────────────
//           RIGHT PANEL: search, payment details, keypad, action button
//       ───────────────────────────────────────────────────────────────────────────── */}
//       <aside className="w-72 bg-white rounded-lg shadow-md p-6 space-y-6">
//         {/* Search product */}
//         <div>
//           <label className="block text-sm font-medium">Temukan Product</label>
//           <div className="mt-1 relative">
//             <input
//               type="text"
//               placeholder="Search your product"
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             <Calendar
//               size={18}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />
//           </div>
//           <p className="text-xs text-gray-500 mt-1">
//             Cari nama produk kemudian pilih produk yang sesuai
//           </p>
//         </div>

//         {/* Payment details */}
//         <div>
//           <label className="block text-sm font-medium">Detail Pembayaran</label>
//           <input
//             type="text"
//             value={paidAmount}
//             onChange={e => setPaidAmount(Number(e.target.value))}
//             className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <div className="mt-2 grid grid-cols-3 gap-2">
//             {[
//               '+Rp500',
//               '+Rp1.000',
//               '+Rp5.000',
//               '+Rp10.000',
//               '+Rp20.000',
//               '+Rp50.000',
//               '+Rp100.000',
//               '+Rp200.000',
//               'Bayar Penuh',
//             ].map((b, i) => (
//               <button
//                 key={i}
//                 onClick={() => {
//                   if (b === 'Bayar Penuh') setPaidAmount(totalPayment)
//                   else {
//                     const num = Number(b.replace(/\D/g, ''))
//                     setPaidAmount(prev => prev + num)
//                   }
//                 }}
//                 className="w-full py-2 bg-gray-200 rounded text-xs hover:bg-gray-300"
//               >
//                 {b}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Numeric keypad + action */}
//         <div className="space-y-4">
//           <div className="grid grid-cols-3 gap-2">
//             {['7', '8', '9', '4', '5', '6', '*', '0', '⌫'].map((k, i) => (
//               <button
//                 key={i}
//                 onClick={() => {
//                   if (k === '⌫') {
//                     setPaidAmount(prev => Math.floor(prev / 10))
//                   } else if (/\d/.test(k)) {
//                     setPaidAmount(prev => Number(`${prev}${k}`))
//                   }
//                 }}
//                 className="h-12 bg-gray-200 rounded text-lg hover:bg-gray-300"
//               >
//                 {k}
//               </button>
//             ))}
//           </div>
//           <button className="w-full py-3 bg-gray-500 text-white rounded font-medium hover:bg-gray-600">
//             Create Transaction
//           </button>
//         </div>
//       </aside>
//     </div>
//   )
// }

// components/PointOfSalePanel.jsx
'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function PointOfSalePanel() {
  const [barcode, setBarcode] = useState('')
  const [paidAmount, setPaidAmount] = useState(100000)

  // dummy items array; replace with your real data
  const items = Array(5).fill({
    name: 'Indomie Goreng',
    price: 2500,
    qty:   5,
    disc:  800,
    total: 24200,
  })

  // summary calculations
  const subtotal     = items.reduce((sum, i) => sum + i.total, 0)
  const paymentDisc  = 3200
  const totalPayment = subtotal - paymentDisc
  const changeDue    = paidAmount - totalPayment

  return (
    <div className="flex max-h-screen">
      {/* ───────────────────────────────────────
         LEFT PANEL: barcode, info, table, summary
      ───────────────────────────────────────── */}
      <div className="flex-1 bg-white rounded-lg shadow-md flex flex-col p-6">
        {/* Barcode & cashier info */}
        <div className="space-y-3 mb-4">
          <input
            type="text"
            placeholder="Scan your barcode / Enter your barcode id"
            className="w-full border border-gray-300 rounded-full px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={barcode}
            onChange={e => setBarcode(e.target.value)}
          />
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50 text-sm space-y-1">
            <div><strong>Cashier :</strong> Cashier-AX01</div>
            <div><strong>Date :</strong> {format(new Date(), 'dd/MM/yyyy HH:mm:ss')}</div>
            <div><strong>Transaction ID :</strong> 001</div>
          </div>
        </div>

        {/* Scrollable items table */}
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr className="text-sm font-semibold text-gray-700">
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Disc</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {items.map((it, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{it.name}</td>
                  <td className="px-4 py-3">{it.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      className="w-16 border border-gray-300 rounded px-1 py-0.5"
                      defaultValue={it.qty}
                    />
                  </td>
                  <td className="px-4 py-3">{it.disc.toLocaleString()}</td>
                  <td className="px-4 py-3">{`Rp${it.total.toLocaleString()}`}</td>
                  <td className="px-4 py-3 text-red-500 cursor-pointer">🗑️</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary bars pinned at bottom */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{`Rp${subtotal.toLocaleString()}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Diskon Pembayaran</span>
            <span>{`Rp${paymentDisc.toLocaleString()}`}</span>
          </div>
          <div className="w-full py-1 flex justify-between bg-red-200 text-red-800 font-medium rounded">
            <span>Total Pembayaran</span>
            <span>{`Rp${totalPayment.toLocaleString()}`}</span>
          </div>
          <div className="w-full py-1 flex justify-between bg-green-200 text-green-800 font-medium rounded">
            <span>Dibayarkan</span>
            <span>{`Rp${paidAmount.toLocaleString()}`}</span>
          </div>
          <div className="w-full py-1 flex justify-between bg-yellow-200 text-yellow-900 font-medium rounded">
            <span>Total Kembalian</span>
            <span>{`Rp${changeDue.toLocaleString()}`}</span>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────
         RIGHT PANEL: search, payment, keypad, action
      ───────────────────────────────────────── */}
      <aside className="w-72 bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Temukan Product */}
        <div>
          <label className="block text-sm font-medium">Temukan Product</label>
          <div className="mt-1 relative">
            <input
              type="text"
              placeholder="Search your product"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Calendar
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cari nama produk kemudian pilih produk yang sesuai
          </p>
        </div>

        {/* Detail Pembayaran */}
        <div>
          <label className="block text-sm font-medium">Detail Pembayaran</label>
          <input
            type="text"
            value={paidAmount}
            onChange={e => setPaidAmount(Number(e.target.value))}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[
              '+Rp500','+Rp1.000','+Rp5.000',
              '+Rp10.000','+Rp20.000','+Rp50.000',
              '+Rp100.000','+Rp200.000','Bayar Penuh',
            ].map((b, i) => (
              <button
                key={i}
                onClick={() => {
                  if (b === 'Bayar Penuh') setPaidAmount(totalPayment)
                  else {
                    const num = Number(b.replace(/\D/g, ''))
                    setPaidAmount(prev => prev + num)
                  }
                }}
                className="w-full py-2 bg-gray-200 rounded text-xs hover:bg-gray-300"
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Keypad & action */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {['7','8','9','4','5','6','*','0','⌫'].map((k, i) => (
              <button
                key={i}
                onClick={() => { /* your logic here */ }}
                className="h-12 bg-gray-200 rounded text-lg hover:bg-gray-300"
              >
                {k}
              </button>
            ))}
          </div>
          <button className="w-full py-3 bg-gray-500 text-white rounded font-medium hover:bg-gray-600">
            Create Transaction
          </button>
        </div>
      </aside>
    </div>
  )
}

// POS Starter Layout with TailwindCSS (Light Mode, Modern, Responsive)
// Assumes Next.js setup
// 'use client'

// export default function POSLayout() {
//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">

//       {/* Produk Section */}
//       <div className="md:col-span-2 space-y-4">
//         <div className="flex items-center justify-between">
//           <input
//             type="text"
//             placeholder="Cari produk..."
//             className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//           {[...Array(8)].map((_, i) => (
//             <div
//               key={i}
//               className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
//             >
//               <div className="w-full h-24 bg-gray-200 rounded-md mb-2" />
//               <h3 className="text-sm font-semibold">Nama Produk</h3>
//               <p className="text-xs text-gray-500">Rp 15.000</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Transaksi Section */}
//       <div className="bg-white rounded-xl shadow-md p-4 space-y-4 sticky top-4 h-fit">
//         <h2 className="text-lg font-bold border-b pb-2">Transaksi</h2>
//         <div className="space-y-2 max-h-64 overflow-y-auto">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="flex justify-between text-sm">
//               <span>Produk #{i + 1}</span>
//               <span>Rp 15.000</span>
//             </div>
//           ))}
//         </div>
//         <div className="border-t pt-2 text-sm">
//           <div className="flex justify-between">
//             <span>Total</span>
//             <span className="font-bold text-green-600">Rp 45.000</span>
//           </div>
//         </div>
//         <div className="grid grid-cols-3 gap-2">
//           <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 text-sm">
//             Cash
//           </button>
//           <button className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 text-sm">
//             QRIS
//           </button>
//           <button className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 text-sm">
//             Kartu
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// Redesigned POS Layout – Modern Look with TailwindCSS
// Designed for a retail POS with app-like feel

// import { UserCircle } from 'lucide-react';

// export default function ModernPOS() {
//   return (
//     <div className="min-h-screen bg-slate-100 text-slate-800 p-6">
//       {/* Header */}
//       <header className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold tracking-tight">Kasir Toko</h1>
//         <UserCircle className="h-7 w-7 text-slate-500" />
//       </header>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Produk */}
//         <div className="lg:col-span-2 space-y-4">
//           <input
//             type="text"
//             placeholder="Cari produk..."
//             className="w-full p-3 rounded-xl border border-slate-300 shadow-sm focus:ring-2 focus:ring-blue-400"
//           />

//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//             {[...Array(8)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border border-slate-200"
//               >
//                 <div className="w-full h-28 bg-slate-200 rounded-md mb-3" />
//                 <h3 className="text-sm font-semibold truncate">Nama Produk #{i + 1}</h3>
//                 <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
//                   <span>Rp 15.000</span>
//                   <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-[10px]">Kategori</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Panel Transaksi */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4 sticky top-6 h-fit">
//           <h2 className="text-lg font-semibold border-b pb-2">Transaksi Aktif</h2>
//           <div className="space-y-2 max-h-64 overflow-y-auto text-sm">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="flex justify-between border-b pb-1">
//                 <span>Produk #{i + 1}</span>
//                 <span>Rp 15.000</span>
//               </div>
//             ))}
//           </div>
//           <div className="border-t pt-2 text-sm font-medium">
//             <div className="flex justify-between">
//               <span>Total</span>
//               <span className="text-green-600 font-bold">Rp 45.000</span>
//             </div>
//           </div>
//           <div className="grid grid-cols-3 gap-2 pt-2">
//             <button className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 text-sm font-medium">
//               Cash
//             </button>
//             <button className="bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 text-sm font-medium">
//               QRIS
//             </button>
//             <button className="bg-slate-500 text-white py-2 rounded-lg hover:bg-slate-600 text-sm font-medium">
//               Kartu
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
