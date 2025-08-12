// "use client";

// import React, { useEffect, useState } from "react";
// import { fetchData } from "@/services/GeneralService";
// import { Product } from "@/models/Product";
// import { useRouter } from "next/navigation";

// export default function ViewProduct() {
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState<Product | null>(null);
//   const router = useRouter();
//   useEffect(() => {
//     const productId = sessionStorage.getItem("selectedProductId");

//     if (!productId) {
//       setError("No product ID found.");
//       setLoading(false);
//       return;
//     }

//     const request = {
//       api: "/get-product-by-product-id",
//       method: "POST",
//       body: { productId },
//     };

//     fetchData<Product>(request)
//       .then((res) => {
//         if (res.responseCode === "00") {
//           setProduct(res.data);
//           setFormData(res.data);
//         } else {
//           setError(res.responseDesc || "Failed to fetch product");
//         }
//       })
//       .catch(() => {
//         setError("Error fetching product details");
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!formData) return;
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]:
//         name === "base_price" || name === "selling_price"
//           ? Number(value)
//           : value,
//     });
//   };

//   const handleSave = async () => {
//     if (!formData) return;

//     try {
//       console.log("Saving product...", formData);

//       // API update product

//       console.log("Product updated successfully");
//     } catch (error) {
//       console.error("Error updating product:", error);
//     }
//   };

//   const handleCancel = () => {
//     setFormData(product);
//     router.push("/manage-product");
//   };

//   if (loading) return <p className="text-center">Loading product details...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;
//   if (!formData) return null;

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <form
//         className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleSave();
//         }}
//       >
//         <h1 className="text-2xl font-bold mb-4 text-center">Edit Product</h1>

//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Product Name</label>
//           <input
//             type="text"
//             name="productName"
//             value={formData.productName}
//             onChange={handleChanges}
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Base Price</label>
//           <input
//             type="number"
//             name="basePrice"
//             value={formData.basePrice}
//             onChange={handleChanges}
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Selling Price</label>
//           <input
//             type="number"
//             name="sellingPrice"
//             value={formData.sellingPrice}
//             onChange={handleChanges}
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Unit</label>
//           <input
//             type="text"
//             name="unit"
//             value={formData.unit}
//             onChange={handleChanges}
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>

//         {/* <p className="text-sm text-gray-500">
//           Updated At: {formData.updated_at}
//         </p>
//         <p className="text-sm text-gray-500 mb-4">
//           Updated By: {formData.updated_by}
//         </p> */}

//         <div className="flex justify-between">
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Save
//           </button>
//           <button
//             type="button"
//             onClick={handleCancel}
//             className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductService } from "@/services/_api.services/product.api.services";
import type { Product } from "@/models/Product";

export default function ViewProduct() {
  const [formData, setFormData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
  const loadProduct = async () => {
    const productId = sessionStorage.getItem("selectedProductId");
    if (!productId) {
      throw new Error("No product ID found");
    }

    try {
      const res = await ProductService.getProductById(productId);
      if (res.responseCode !== "00") throw new Error(res.responseDesc || "Failed to fetch");
      setFormData(res.data);
    } catch (e: any) {
      setError(e?.message ?? "Error fetching product details");
    } finally {
      setLoading(false);
    }
  };

  loadProduct();
}, []);


  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value, type } = e.target;
    setFormData(prev => prev ? {
      ...prev,
      [name]: (type === "number" || name === "basePrice" || name === "sellingPrice")
        ? Number(value)
        : value,
    } as Product : prev);
  };

  const handleSave = async () => {
    if (!formData || !formData.productId) return;
    setSaving(true); setError(null);
    try {
      const res = await ProductService.updateProduct(formData as Product & { productId: string });
      if (res.responseCode !== "00") throw new Error(res.responseDesc || "Update failed");
      router.push("/manage-product");
    } catch (e: any) {
      setError(e?.message ?? "Error updating product");
    } finally {
      setSaving(false);
    }
  };


  if (loading) return <p className="text-center">Loading product details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!formData) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        onSubmit={(e) => { e.preventDefault(); if (!saving) handleSave(); }}>
        <h1 className="text-2xl font-bold mb-4 text-center">Edit Product</h1>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Category</label>
          <input type="text" name="category" value={formData.category ?? ""}
            onChange={handleChanges} className="w-full border rounded px-3 py-2" required />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">ProdName</label>
          <input type="text" name="productName" value={formData.productName ?? ""}
            onChange={handleChanges} className="w-full border rounded px-3 py-2" required />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Base Price</label>
          <input type="number" name="basePrice" value={Number(formData.basePrice ?? 0)}
            onChange={handleChanges} className="w-full border rounded px-3 py-2" min={1} required />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Selling Price</label>
          <input type="number" name="sellingPrice" value={Number(formData.sellingPrice ?? 0)}
            onChange={handleChanges} className="w-full border rounded px-3 py-2" min={1} required />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Unit</label>
          <input type="text" name="unit" value={formData.unit ?? ""}
            onChange={handleChanges} className="w-full border rounded px-3 py-2" required />
        </div>

        <div className="flex justify-between">
          <button type="submit"
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60">
            {saving ? "Saving..." : "Save"}
          </button>
          <button type="button"
            onClick={() => router.push("/manage-product")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

