'use client';

import Modal from "@/components/modal/Modal";
import ProtectedRoute from "@/components/protected-route/ProtectedRoute";
import Spinner from "@/components/spinner/Spinner";
import { SUCCESS_CODE } from "@/constants/GlobalConstant";
import { CreateCategoryDTO } from "@/models/Category";
import { CategoryService } from "@/services/api/CategoryService";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateCategory() {
  const router = useRouter();

  const [categoryName, setCategoryName] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateCategoryDTO, string>>>({});
  const [message, setMessage] = useState('');

  const createCategoryParam: CreateCategoryDTO = {
    categoryName: categoryName,
  };

  const validateCreateCategory = () => {
    const errors: Partial<Record<keyof CreateCategoryDTO, string>> = {};

    if (!categoryName.trim()) {
      errors.categoryName = "Category Name is required!";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length > 0;
  };

  const createCategory = async () => {
    try {
      setLoading(true);

      const response = await CategoryService.createCategory(createCategoryParam);
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

    const hasError = validateCreateCategory();

    if (!hasError) {
      await createCategory();
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
          <h1 className="text-xl text-center font-bold mb-4">Create Category</h1>
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

        <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Category">
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

        {isLoading && <Spinner message="Saving new category..." />}
      </div>
    </ProtectedRoute>
  );
}