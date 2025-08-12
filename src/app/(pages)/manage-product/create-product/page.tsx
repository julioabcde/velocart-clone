// Product Form — Next.js + Tailwind + Axios (TypeScript)
// All fields are required with HTML5 validation
'use client'

import { useState } from 'react';
import axios from 'axios';
import { fetchData } from '@/services/GeneralService';
import { RequestStructure } from '@/models/GeneralDTO';
import { ProductDTO } from '@/models/Product';

type ProductFormPayload = {
    productId: string;
    categoryId: string;
    productName: string;
    unit: string;
    basePrice: number;
    sellingPrice: number;
};
 const productFormPayload = useState<ProductDTO>;

export default function ProductForm() {
    const [form, setForm] = useState<ProductFormPayload>({
        productId: '',
        categoryId: '',
        productName: '',
        unit: '',
        basePrice: 0,
        sellingPrice: 0,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const setField = (key: keyof ProductFormPayload, value: string | number) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // validasi singkat
        if (!form.productId || !form.categoryId || !form.productName || !form.unit || form.basePrice <= 0 || form.sellingPrice <= 0) {
            setMessage("❌ Semua field wajib diisi dan harga harus > 0");
            return;
        }

        setLoading(true);
        setMessage("");

        // request versi RequestStructure
        const request: RequestStructure<ProductFormPayload> = {
            api: "/save-new-product",          // ganti sesuai endpoint backend-mu
            method: "POST",
            body: {
                productId: form.productId,
                categoryId: form.categoryId,
                productName: form.productName,
                unit: form.unit,
                basePrice: form.basePrice,
                sellingPrice: form.sellingPrice,
            },
        };

        try {
            // misal responsenya mengikuti pola yang sama:
            // { responseCode: "00", data: {...}, message: string, ... }
            const resp = await fetchData(request);

            if (resp.responseCode !== "00") {
                console.log("responseDate:", resp.responseDate);
                console.log("responseCode:", resp.responseCode);
                console.log("responseDesc:", resp.responseDesc);
                console.log("message:", resp.message);
                setMessage("❌ Gagal menyimpan: " + (resp.responseDesc || resp.message || "Unknown error"));
                return;
            }

            setMessage("✅ Berhasil menyimpan produk");
            // TODO: redirect kalau perlu
            // router.push("/manage-product");
        } catch (err) {
            console.error(err);
            setMessage("❌ Error jaringan/server");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-2xl bg-white rounded-2xl shadow p-6">
                <h1 className="text-xl font-bold mb-4">Product Form</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Product ID *</label>
                            <input
                                type="text"
                                value={form.productId}
                                onChange={(e) => setField('productId', e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., BRG-0001"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category ID *</label>
                            <input
                                type="text"
                                value={form.categoryId}
                                onChange={(e) => setField('categoryId', e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., CAT-APOTEK"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Product Name *</label>
                        <input
                            type="text"
                            value={form.productName}
                            onChange={(e) => setField('productName', e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Amoxilin BPJS"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Unit *</label>
                            <input
                                type="text"
                                value={form.unit}
                                onChange={(e) => setField('unit', e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., strip, box"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Base Price *</label>
                            <input
                                type="number"
                                inputMode="numeric"
                                value={form.basePrice}
                                onChange={(e) => setField('basePrice', Number(e.target.value))}
                                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                                min={1}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Selling Price *</label>
                            <input
                                type="number"
                                inputMode="numeric"
                                value={form.sellingPrice}
                                onChange={(e) => setField('sellingPrice', Number(e.target.value))}
                                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                                min={1}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <p className="text-sm text-slate-500">* Wajib diisi</p>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Mengirim...' : 'Simpan Produk'}
                        </button>
                    </div>
                </form>

                {message && <div className="mt-4 text-sm">{message}</div>}
            </div>
        </div>
    );
}
