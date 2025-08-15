// // app/manage-product/[id]/page.tsx
// import type { Product } from "@/models/Product";
// import EditForm from "./EditForm"
// import { ProductService } from "@/services/api/ProductService";

// type PageProps = { params: { id: string } };

// export default async function ProductDetailPage({ params }: PageProps) {
//   const { id } = params;

//   const res = await ProductService.getProductById(id);
//   if (res.responseCode !== "00") {
//     return (
//       <div className="p-6 text-red-600">
//         {res.responseDesc ?? "Gagal mengambil data produk"}
//       </div>
//     );
//   }

//   const product = res.data as Product;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <EditForm initialData={product} />
//     </div>
//   );
// }
