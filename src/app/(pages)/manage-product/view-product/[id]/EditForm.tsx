// src/app/manage-product/[id]/EditForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductService } from "@/services/_api.services/product.api.services";
import type { Product, ProductDTO  } from "@/models/Product";

export default function EditForm({ initialData }: { initialData: Product }) {
  const router = useRouter();
  const [form, setForm] = useState<Product>(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }) as Product);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId) { setError("Product ID tidak ditemukan."); return; }

    const payload: ProductDTO = {
      productId: form.productId,
      categoryId: Number(form.categoryId),
      productName: form.productName,
      unit: form.unit,
      basePrice: form.basePrice,
      sellingPrice: form.sellingPrice,
    };

    setSaving(true); setError(null);
    try {
      const res = await ProductService.updateProduct(payload);
      if (res.responseCode !== "00") throw new Error(res.responseDesc || "Update failed");
      router.push("/manage-product");
    } catch (err: any) {
      setError(err?.message ?? "Error updating product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
      <h1 className="mb-6 text-2xl font-bold">Edit Product: {form.productId}</h1>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <label className="mb-1 block text-sm font-medium">Category ID</label>
      <input
        type="number"
        name="categoryId"
        value={form.categoryId ?? 2}
        onChange={onChange}
        className="mb-4 w-full rounded border px-3 py-2"
        min={0}
      />

      <label className="mb-1 block text-sm font-medium">Product Name</label>
      <input
        name="productName"
        value={form.productName ?? ""}
        onChange={onChange}
        className="mb-4 w-full rounded border px-3 py-2"
        required
      />

      <label className="mb-1 block text-sm font-medium">Unit</label>
      <input
        name="unit"
        value={form.unit ?? ""}
        onChange={onChange}
        className="mb-4 w-full rounded border px-3 py-2"
        required
      />

      <label className="mb-1 block text-sm font-medium">Base Price</label>
      <input
        type="number"
        name="basePrice"
        value={Number(form.basePrice ?? 0)}
        onChange={onChange}
        className="mb-4 w-full rounded border px-3 py-2"
        min={1}
        required
      />

      <label className="mb-1 block text-sm font-medium">Selling Price</label>
      <input
        type="number"
        name="sellingPrice"
        value={Number(form.sellingPrice ?? 0)}
        onChange={onChange}
        className="mb-6 w-full rounded border px-3 py-2"
        min={1}
        required
      />

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={() => router.push("/manage-product")} className="rounded bg-gray-200 px-4 py-2">
          Cancel
        </button>
      </div>
    </form>
  );
}
