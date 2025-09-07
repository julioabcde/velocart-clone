"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CreateEditProductDTO, Product } from "@/models/Product";
import { ProductService } from "@/services/api/ProductService";
import AsyncSelect from "react-select/async";
import { PaginationParam } from "@/models/GeneralDTO";
import { CategoryService } from "@/services/api/CategoryService";
import { SUCCESS_CODE } from "@/constants/GlobalConstant";
import debounce from "lodash.debounce";
import Modal from "@/components/modal/Modal";
import Spinner from "@/components/spinner/Spinner";

export default function EditProductForm({ data }: { data: Product }) {
  const router = useRouter();

  const [productId, setProductId] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [categoryList, setCategoryList] = useState<{ value: number; label: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<{ value: number; label: string } | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateEditProductDTO, string>>>({});
  const [message, setMessage] = useState('');

  const editProductParam: CreateEditProductDTO = {
    productId: productId,
    categoryId: categoryId,
    productName: productName,
    unit: unit,
    basePrice: basePrice!,
    sellingPrice: sellingPrice!,
  };

  const getAllCategories = async (searchText?: string) => {
    try {
      const getAllCategoriesParam: PaginationParam = {
        pagination: false,
        perPage: 10,
        page: 1,
        query: searchText || "",
        filter: "",
      };

      const response = await CategoryService.getAllCategories(getAllCategoriesParam);
      if (response.responseCode != SUCCESS_CODE) {
        console.log("responseDate: ", response.responseDate);
        console.log("responseCode: ", response.responseCode);
        console.log("responseDesc: ", response.responseDesc);
        console.log("message: ", response.message);

        return [];
      }
      else {
        const list = response.data?.map((c) => ({
          value: c.id,
          label: c.categoryName || ''
        })) || [];

        setCategoryList(list);
        setSelectedCategory(list.find(c => c.value === Number(categoryId)) || null);

        return list;
      }
    }
    catch (err) {
      console.error("Fetch error:", err);

      return [];
    }
  };

  useEffect(() => {
    if (data) {
      setProductId(data.productId);
      setCategoryId(data.categoryId!);
      setProductName(data.productName!);
      setUnit(data.unit!);
      setBasePrice(data.basePrice!);
      setSellingPrice(data.sellingPrice!);

      getAllCategories();
    }
  }, [data]);

  const debouncedGetAllCategories = useCallback(
    debounce((query: string, callback: (options: any[]) => void) => {
      getAllCategories(query).then((options) => {
        callback(options);
      });
    }, 500),
    []
  );

  const validateEditProduct = () => {
    const errors: Partial<Record<keyof CreateEditProductDTO, string>> = {};

    if (categoryId === 0) {
      errors.categoryId = "Category is requried!";
    }

    if (!productName?.trim()) {
      errors.productName = "Product Name is required!";
    }

    if (!unit?.trim()) {
      errors.unit = "Unit is required!";
    }

    if (basePrice === 0) {
      errors.basePrice = "Base Price must be greater than 0!";
    }

    if (sellingPrice === 0) {
      errors.sellingPrice = "Selling Price must be grater than 0!";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length > 0;
  };

  const editProduct = async () => {
    try {
      setLoading(true);

      const response = await ProductService.updateProduct(editProductParam);
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

        router.push('/master/product');
      }
    }
    catch (err) {
      console.error("Fetch error:", err);
      setError(true);
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasError = validateEditProduct();

    if (!hasError) {
      await editProduct();
    }
  };

  const handleCancel = () => {
    router.push("/master/product");
  }

  const closeModal = () => {
    setIsModalOpen(false);
    router.push('/master/product');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl bg-white rounded-2xl shadow p-6">
        <h1 className="mb-6 text-2xl font-bold text-center">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="productId" className="block text-sm font-medium mb-1">Product ID</label>
              <input
                type="text"
                id="productId"
                name="productId"
                value={productId}
                readOnly={true}
                className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring border-gray-300 focus:ring-blue-500"
                placeholder="e.g., BRG-0001"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
              <AsyncSelect
                inputId="category"
                cacheOptions={false}
                defaultOptions={categoryList}
                value={selectedCategory}
                loadOptions={debouncedGetAllCategories}
                onChange={(e: any) => {
                  setSelectedCategory(e)
                  setCategoryId(Number(e?.value) || 0);
                  if (fieldErrors.categoryId) {
                    setFieldErrors((prev) => ({ ...prev, categoryId: undefined }));
                  }
                }}
                isSearchable
                placeholder="Select a category..."
                className={`w-full rounded-md text-sm shadow-sm focus:outline-none focus:ring ${fieldErrors.categoryId ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="productName" className="block text-sm font-medium mb-1">Product Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
                if (fieldErrors.productName) {
                  setFieldErrors((prev) => ({ ...prev, productName: undefined }));
                }
              }}
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring ${fieldErrors.productName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
              placeholder="e.g., Amoxilin BPJS"
            />
            {fieldErrors.productName && (
              <p className="col-start-3 col-span-4 text-sm text-red-600">
                {fieldErrors.productName}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="unit" className="block text-sm font-medium mb-1">Unit <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value);
                  if (fieldErrors.unit) {
                    setFieldErrors((prev) => ({ ...prev, unit: undefined }));
                  }
                }}
                className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring ${fieldErrors.unit ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                placeholder="e.g., strip, box"
              />
              {fieldErrors.unit && (
                <p className="col-start-3 col-span-4 text-sm text-red-600">
                  {fieldErrors.unit}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="basePrice" className="block text-sm font-medium mb-1">Base Price <span className="text-red-500">*</span></label>
              <input
                type="number"
                id="basePrice"
                name="basePrice"
                inputMode="decimal"
                value={basePrice === 0 ? '' : basePrice}
                onChange={(e) => {
                  setBasePrice(Number(e.target.value));
                  if (fieldErrors.basePrice) {
                    setFieldErrors((prev) => ({ ...prev, basePrice: undefined }));
                  }
                }}
                className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring ${fieldErrors.basePrice ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
              />
              {fieldErrors.basePrice && (
                <p className="col-start-3 col-span-4 text-sm text-red-600">
                  {fieldErrors.basePrice}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="sellingPrice" className="block text-sm font-medium mb-1">Selling Price <span className="text-red-500">*</span></label>
              <input
                type="number"
                id="sellingPrice"
                name="sellingPrice"
                inputMode="decimal"
                value={sellingPrice === 0 ? '' : sellingPrice}
                onChange={(e) => {
                  setSellingPrice(Number(e.target.value));
                  if (fieldErrors.sellingPrice) {
                    setFieldErrors((prev) => ({ ...prev, sellingPrice: undefined }));
                  }
                }}
                className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring ${fieldErrors.sellingPrice ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
              />
              {fieldErrors.sellingPrice && (
                <p className="col-start-3 col-span-4 text-sm text-red-600">
                  {fieldErrors.sellingPrice}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center pt-4 gap-5">
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
        </form>

        {/* @julioabcde kayaknya ini bisa dibikin modal */}
        {message && <div className="mt-4 text-sm">{message}</div>}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Product">
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

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Product">
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

      {isLoading && <Spinner message="Saving product..." />}
    </div>
  );
}