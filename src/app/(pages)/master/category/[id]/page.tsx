'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { NOT_FOUND_CODE, SUCCESS_CODE } from "@/constants/GlobalConstant";
import ProtectedRoute from "@/components/protected-route/ProtectedRoute";
import Modal from "@/components/modal/Modal";
import { CategoryService } from "@/services/api/CategoryService";
import Spinner from "@/components/spinner/Spinner";
import { CategoryByIdDTO, EditCategoryDTO } from "@/models/Category";

export default function ViewEditCategory() {
  const router = useRouter();

  const { id } = useParams<{ id: string }>();

  const [categoryName, setCategoryName] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isNotFound, setNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof EditCategoryDTO, string>>>({});
  const [message, setMessage] = useState('');

  const editCategoryParam: EditCategoryDTO = {
    id: Number(id),
    categoryName: categoryName
  };

  const getCategoryById = async () => {
    try {
      const getCategoryByIdParam: CategoryByIdDTO = {
        id: Number(id)
      }

      const response = await CategoryService.getCategoryById(getCategoryByIdParam);
      if (response.responseCode != SUCCESS_CODE) {
        console.log("responseDate: ", response.responseDate);
        console.log("responseCode: ", response.responseCode);
        console.log("responseDesc: ", response.responseDesc);
        console.log("message: ", response.message);

        if (response.responseCode === NOT_FOUND_CODE) {
          setNotFound(true);
        }

        setError(true);
        setMessage(response.message);
        setIsModalOpen(true);

        return null;
      }
      else {
        return response.data;
      }
    }
    catch (err) {
      setError(true);

      return null;
    }
  };

  const onInitialLoad = async () => {
    const category = await getCategoryById();
    if (!category) {
      return;
    }

    setCategoryName(category.categoryName!);
  };

  useEffect(() => {
    onInitialLoad();
  }, []);

  const validateEditCategory = () => {
    const errors: Partial<Record<keyof EditCategoryDTO, string>> = {};

    if (!categoryName.trim()) {
      errors.categoryName = "Category Name is required!";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length > 0;
  };

  const editCategory = async () => {
    try {
      setLoading(true);

      const response = await CategoryService.updateCategory(editCategoryParam);
      if (response.responseCode !== SUCCESS_CODE) {
        console.log("responseDate:", response.responseDate);
        console.log("responseCode:", response.responseCode);
        console.log("responseDesc:", response.responseDesc);
        console.log("message:", response.message);

        setMessage(response.message);
        setError(true);
        setLoading(false);
      }
      else {
        setSuccess(true);
        setMessage(response.message);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setIsModalOpen(true);
        }, 1500);
      }
    }
    catch (err) {
      console.error("Fetch error:", err);
      setError(true);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasError = validateEditCategory();

    if (!hasError) {
      await editCategory();
    }
  };

  const handleCancel = () => {
    router.push('/master/category');
  };

  const closeModal = () => {
    router.push('/master/category');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl bg-white rounded-2xl shadow p-6">
          <h1 className="text-xl text-center font-bold mb-4">Edit Category</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium mb-1">Category Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="categoryName"
                name="categoryName"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  if (fieldErrors.categoryName) {
                    setFieldErrors((prev) => ({ ...prev, categoryName: undefined }));
                  }
                }}
                className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${fieldErrors.categoryName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                placeholder="e.g., Food and Beverages"
              />
              {fieldErrors.categoryName && (
                <p className="col-start-3 col-span-4 text-sm text-red-600">
                  {fieldErrors.categoryName}
                </p>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <p className="text-xs text-red-500">* Required</p>
              <div className="flex justify-center gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="text-[15px] px-3.5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={handleCancel} className="text-[15px] px-3.5 py-2.5 rounded-xl bg-gray-400 text-white font-semibold hover:bg-gray-500 disabled:opacity-50">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        {isNotFound &&
          <Modal isOpen={isModalOpen} onClose={closeModal} title="Not Found">
            <p>{message}</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </Modal>
        }

        {isSuccess &&
          <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit Category">
            <p>{message}</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </Modal>
        }

        {isLoading && <Spinner message="Saving category..." />}
      </div>
    </ProtectedRoute>
  );
}