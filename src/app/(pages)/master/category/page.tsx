"use client";

import DateRangePickerV1 from "@/components/datepicker/DateRangePicker";
import Modal from "@/components/modal/Modal";
import Pagination from "@/components/pagination/Pagination";
import ProtectedRoute from "@/components/protected-route/ProtectedRoute";
import Spinner from "@/components/spinner/Spinner";
import { PAGE_SIZES } from "@/constants/GlobalConstant";
import { Category, CategoryByIdDTO } from "@/models/Category";
import { PaginationParam } from "@/models/GeneralDTO";
import { CategoryService } from "@/services/api/CategoryService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";

export default function MasterCategory() {
  const router = useRouter();

  const [data, setData] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState(0);
  const [categoryName, setCategoryName] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAllCategoriesParam: PaginationParam = {
    pagination: true,
    perPage: pageSize,
    page,
    query: "",
    filter: "",
  };

  const getAllCategories = async () => {
    try {
      const response = await CategoryService.getAllCategoriesPagination(getAllCategoriesParam);
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
      console.error("Fetch error:", err);

      setError(true);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, [page, pageSize]);

  const handleAddNewCategory = () => {
    router.push("/master/category/create");
  }

  const handleEdit = (id: number) => {
    router.push(`/master/category/${id}`);
  };

  const openModal = (id: number, categoryName: string) => {
    setDeleteId(id);
    setCategoryName(categoryName)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setDeleteId(0);
    setCategoryName("");
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      const deleteCategoryParam: CategoryByIdDTO = {
        id: deleteId
      };

      const response = await CategoryService.deleteCategory(deleteCategoryParam);
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
        getAllCategories();
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
            <h3 className="card-label">Category</h3>
          </div>

          <div className="card-toolbar">
            <button
              className="mr-3 px-4 py-2 rounded-lg text-sm text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition"
              onClick={handleAddNewCategory}
            >
              Add New Category
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
                  <th className="text-center">CATEGORY</th>
                  <th className="text-center">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.id}>
                      <td className="text-center truncate max-w-[70px]">
                        {item.categoryName}
                      </td>
                      <td>
                        <div className="align-action">
                          <button disabled={item.id === 1} className="disabled:opacity-50" onClick={() => handleEdit(item.id ?? 0)}>
                            <img src="/icon/EditIcon.png" alt="edit" width="30" />
                          </button>
                          <button disabled={item.id === 1} className="disabled:opacity-50" onClick={() => openModal(item.id ?? 0, item.categoryName ?? "")}>
                            <img src="/icon/DelIcon.png" alt="delete" width="30" />
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
            Are you sure you want to delete <span className="font-semibold break-words">{categoryName}</span>?
          </p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={closeModal}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </Modal>

        {isLoading && <Spinner message="Deleting category..." />}
      </div>
    </ProtectedRoute >
  );
}