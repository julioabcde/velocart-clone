"use client";

import DateRangePickerV1 from "@/components/datepicker/DateRangePicker";
import { PaginationParam } from "@/models/GeneralDTO";
import { ProductByIdDTO, Product } from "@/models/Product";
import { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import Pagination from "@/components/pagination/Pagination";
import { PAGE_SIZES } from "@/constants/GlobalConstant";
// import Modal from "@/components/modal/Modal";
import { useRouter } from "next/navigation";
import { ProductService } from "@/services/api/ProductService";
import { FormatterService } from "@/services/ui/FormatterService";
import ProtectedRoute from "@/components/protected-route/ProtectedRoute";
import Spinner from "@/components/spinner/Spinner";
import Modal from "@/components/modal/Modal";

export default function MasterProduct() {
  const router = useRouter();

  const [data, setData] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState("");
  const [productName, setProductName] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAllProductsParam: PaginationParam = {
    pagination: true,
    perPage: pageSize,
    page: page,
    query: "",
    filter: "",
  };

  const getAllProducts = async () => {
    try {
      const response = await ProductService.getAllProductsPagination(getAllProductsParam);
      if (response.responseCode != "00") {
        console.log("responseDate: ", response.responseDate);
        console.log("responseCode: ", response.responseCode);
        console.log("responseDesc: ", response.responseDesc);
        console.log("message: ", response.message);

        setError(true);
      }
      else {
        const items = response.data.data;
        const totalCount = response.data.total;

        setData(items);
        setTotal(totalCount);
      }
    }
    catch (err) {
      setError(true);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [page, pageSize]);

  const handleAddNewProduct = () => {
    router.push("/master/product/create");
  };

  const handleEdit = (productId: string) => {
    router.push(`/master/product/${productId}`);
  };

  const openModal = (productId: string, productName: string) => {
    setDeleteId(productId);
    setProductName(productName)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setDeleteId("");
    setProductName("");
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      const deleteProductParam: ProductByIdDTO = {
        productId: deleteId
      };

      const response = await ProductService.deleteProduct(deleteProductParam);
      if (response.responseCode !== "00") {
        console.log("responseDate: ", response.responseDate);
        console.log("responseCode: ", response.responseCode);
        console.log("responseDesc: ", response.responseDesc);
        console.log("message: ", response.message);

        setError(true);
      }
      else {
        closeModal();
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
        getAllProducts();
      }
    }
    catch (error) {
      setError(true);
    }
  };

  return (
    <ProtectedRoute>
      <div className="card card-custom gutter-b">
        <div className="card-header">
          <div className="card-title">
            <h3 className="card-label">Product</h3>
          </div>

          <div className="card-toolbar">
            <button
              className="mr-3 px-4 py-2 rounded-lg text-sm text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition"
              onClick={handleAddNewProduct}
            >
              Add New Product
            </button>
            <button className="btn btn-primary mr-3">Excel CSV</button>
            <button className="btn btn-primary btn-refresh mr-10">
              <FaSyncAlt />
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="flex justify-between gap-4 mb-6">
            <div className="w-1/3">
              <DateRangePickerV1></DateRangePickerV1>
            </div>

            <div className="w-1/3">
              <div>
                <select className="filter-border">
                  <option>Instalasi A</option>
                  <option>Instalasi B</option>
                </select>
                <small className="filter-text">
                  <b>Filter</b> Instalasi
                </small>
              </div>
            </div>

            <div className="w-1/3">
              <div>
                <input type="text" placeholder="Cari" className="filter-border" />
                <small className="filter-text">
                  <b>Kolom</b> pencarian
                </small>
              </div>
            </div>
          </div>

          <div className="table-responsive-scrollable">
            <table className="table table-head-custom table-vertical-center text-center w-full">
              <thead>
                <tr>
                  <th className="text-center">PRODUCT ID</th>
                  <th className="text-center">CATEGORY</th>
                  <th className="text-center">PRODUCT NAME</th>
                  <th className="text-center">BASE PRICE</th>
                  <th className="text-center">SELLING PRICE</th>
                  <th className="text-center">UNIT</th>
                  <th className="text-center">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.productId}>
                      <td className="text-center">{item.productId}</td>
                      <td className="text-center truncate max-w-[70px]">
                        {item.categoryName}
                      </td>
                      <td className="text-center truncate max-w-[200px]">
                        {item.productName}
                      </td>
                      <td className="text-center">
                        {FormatterService.formatRupiah(item.basePrice)}
                      </td>
                      <td className="text-center">
                        {FormatterService.formatRupiah(item.sellingPrice)}
                      </td>
                      <td className="text-center">{item.unit}</td>
                      <td>
                        <div className="align-action">
                          <button onClick={() => handleEdit(item.productId ?? "")}>
                            <img src="/icon/EditIcon.png" alt="edit" width="35" />
                          </button>
                          <button onClick={() => openModal(item.productId ?? "", item.productName ?? "")}>
                            <img src="/icon/DelIcon.png" alt="delete" width="35" />
                          </button>
                          <button>
                            <img src="/icon/PrintIcon.png" alt="view" width="35" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      No data to display
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            pageSizes={PAGE_SIZES}
            onPaginate={({ page: newPage, pageSize: newSize }) => {
              setPage(newPage);
              setPageSize(newSize);
            }}
            siblingCount={1}
            boundaryCount={1}
            showFirstLast={true}
          />
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} title="Delete Product">
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold break-words">{productName}</span>?
          </p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </Modal>

        {isLoading && <Spinner message="Deleting product..." />}
      </div>
    </ProtectedRoute>
  );
}