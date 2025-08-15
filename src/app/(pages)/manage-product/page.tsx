// "use client";

// import DateRangePickerV1 from "@/components/datepicker/DateRangePicker";
// import { PaginatedData, PaginationParam, RequestStructure } from "@/models/GeneralDTO";
// import { Product } from "@/models/Product";
// import { useEffect, useState } from "react";
// import { FaSyncAlt } from "react-icons/fa";
// import { fetchData } from "@/services/GeneralService";
// import Pagination from "@/components/pagination/Pagination";
// import { PAGE_SIZES } from "@/constants/GlobalConstant";
// import { formatRupiah } from "@/services/UIService";
// import Modal from "@/components/modal/Modal";
// import { IoMdReturnLeft } from "react-icons/io";
// import { useRouter } from "next/navigation";

// export default function ManageProduct() {
//   const router = useRouter();
//   const [data, setData] = useState<Product[]>([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [isLoading, setLoading] = useState(false);
//   // const [isError, setError] = useState<string | null>(null);
//   const [isError, setError] = useState(false);
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const param: PaginationParam = {
//     pagination: true,
//     perPage: pageSize,
//     page,
//     query: "",
//     filter: "",
//   };

//   // useEffect(() => {
//   //   let alive = true;
//   //   (async () => {
//   //     setLoading(true); setError(null);
//   //     try {
//   //       const res = await ProductService.getAllProducts(param);
//   //       if (res.responseCode !== "00") throw new Error(res.responseDesc ?? res.message);
//   //       if (!alive) return;
//   //       setData(res.data.data);
//   //       setTotal(res.data.total);
//   //     } catch (e: any) {
//   //       if (!alive) return;
//   //       setError(e?.message ?? "Fetch error");
//   //     } finally {
//   //       if (alive) setLoading(false);
//   //     }
//   //   })();
//   //   return () => { alive = false; };
//   const request: RequestStructure<PaginationParam> = {
//     api: "/get-all-products",
//     method: "POST",
//     body: param,
//   };

//   const loadData = async () => {
//     setLoading(true);
//     setError(false);

//     try {
//       const response = await fetchData<PaginatedData<Product>>(request);
//       if (response.responseCode != "00") {
//         console.log("responseDate: ", response.responseDate);
//         console.log("responseCode: ", response.responseCode);
//         console.log("responseDesc: ", response.responseDesc);
//         console.log("message: ", response.message);

//         setError(true);
//       }
//       else {
//         const items = response.data.data;
//         const totalCount = response.data.total;

//         setData(items);
//         setTotal(totalCount);
//       }
//     }
//     catch (err) {
//       console.error("Fetch error:", err);

//       setError(true);
//     }
//     finally {
//       setLoading(false);
//     }
//   };

//   const openModal = (id: string) => {
//     setDeleteId(id);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setDeleteId(null);
//   };

//   const confirmDelete = async () => {
//     if (!deleteId) return;

//     try {
//       const request: RequestStructure<{ productId: string }> = {
//         api: "/delete-product",
//         method: "PATCH",
//         body: { productId: deleteId },
//       };

//       const response = await fetchData(request);
//       if (response.responseCode !== "00") {
//         throw new Error(response.responseDesc || "Failed to delete product");
//       }

//       console.log("Product deleted successfully");
//       closeModal();

//       loadData();
//     } catch (error) {
//       console.error("Error deleting product", error);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, [page, pageSize]);

//   const handleEdit = (id: string) => {
//     sessionStorage.setItem("selectedProductId", id);

//     router.push("/manage-product/view-product");
//   };

//   return (
//     <div className="card card-custom gutter-b">
//       {/* Header */}
//       <div className="card-header">
//         <div className="card-title">
//           <h3 className="card-label">Product</h3>
//         </div>
//         <div className="card-toolbar">
//           <button
//             className="btn-create mr-3"
//             onClick={() => router.push("/manage-product/create-manage-product")}
//           >
//             Add Product
//           </button>
//           <button className="btn btn-primary mr-3">Excel CSV</button>
//           <button className="btn btn-primary btn-refresh mr-10">
//             <FaSyncAlt />
//           </button>
//         </div>
//       </div>

//       {/* Modal */}
//       <Modal isOpen={isModalOpen} onClose={closeModal} title="Delete Product">
//         <p>Are you sure you want to delete this product?</p>
//         <div className="mt-4 flex justify-end space-x-2">
//           <button
//             onClick={closeModal}
//             className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={confirmDelete}
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//           >
//             Yes, Delete
//           </button>
//         </div>
//       </Modal>

//       {/* Body */}
//       <div className="card-body">
//         {/* Begin: Filtration Form */}
//         {/*
//             w-1/2	width: 50%	Half the parent width
//             w-1/3	width: 33%	One-third of parent
//             w-2/3	width: 66%	Two-thirds
//             w-1/4	width: 25%	One-fourth
//             w-full	width: 100%	Fills parent
//         */}
//         <div className="flex justify-between gap-4 mb-6">
//           <div className="w-1/3">
//             <DateRangePickerV1></DateRangePickerV1>
//           </div>

//           <div className="w-1/3">
//             <div>
//               <select className="filter-border">
//                 <option>Instalasi A</option>
//                 <option>Instalasi B</option>
//               </select>
//               <small className="filter-text">
//                 <b>Filter</b> Instalasi
//               </small>
//             </div>
//           </div>

//           <div className="w-1/3">
//             <div>
//               <input type="text" placeholder="Cari" className="filter-border" />
//               <small className="filter-text">
//                 <b>Kolom</b> pencarian
//               </small>
//             </div>
//           </div>
//         </div>

//         <div className="table-responsive-scrollable">
//           <table className="table table-head-custom table-vertical-center text-center w-full">
//             <thead>
//               <tr>
//                 <th className="text-center">PRODUCT ID</th>
//                 <th className="text-center">CATEGORY</th>
//                 <th className="text-center">PRODUCT NAME</th>
//                 <th className="text-center">BASE PRICE</th>
//                 <th className="text-center">SELLING PRICE</th>
//                 <th className="text-center">UNIT</th>
//                 <th className="text-center">ACTION</th>
//               </tr>
//             </thead>

//             <tbody>
//               {Array.isArray(data) && data.length > 0 ? (
//                 data.map((item) => (
//                   <tr key={item.productId}>
//                     <td className="text-center">{item.productId}</td>
//                     <td className="text-center truncate max-w-[70px]">
//                       {item.category}
//                     </td>
//                     <td className="text-center truncate max-w-[200px]">
//                       {item.productName}
//                     </td>
//                     <td className="text-center">
//                       {formatRupiah(item.basePrice)}
//                     </td>
//                     <td className="text-center">
//                       {formatRupiah(item.sellingPrice)}
//                     </td>
//                     <td className="text-center">{item.unit}</td>
//                     <td>
//                       <div className="align-action">
//                         {/* <button>
//                           <img src="/icon/ViewIcon.png" alt="view" width="35" />
//                         </button> */}
//                         <button
//                           onClick={() => handleEdit(item.productId ?? "")}
//                           // onClick={() =>
//                           //   router.push(`/get-product-by-product-id/${item.productId}`)}
//                         >
//                           <img src="/icon/EditIcon.png" alt="edit" width="35" />
//                         </button>
//                         <button
//                           onClick={() => openModal(item.productId ?? "")}
//                         >
//                           <img
//                             src="/icon/DelIcon.png"
//                             alt="delete"
//                             width="35"
//                           />
//                         </button>
//                         <button>
//                           <img
//                             src="/icon/PrintIcon.png"
//                             alt="view"
//                             width="35"
//                           />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={7} className="py-4 text-center text-gray-500">
//                     No data to display
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <Pagination
//           page={page}
//           pageSize={pageSize}
//           total={total}
//           pageSizes={PAGE_SIZES}
//           onPaginate={({ page: newPage, pageSize: newSize }) => {
//             setPage(newPage);
//             setPageSize(newSize);
//           }}
//           siblingCount={1}
//           boundaryCount={1}
//           showFirstLast={true}
//         />
//       </div>
//     </div>
//   );
// }