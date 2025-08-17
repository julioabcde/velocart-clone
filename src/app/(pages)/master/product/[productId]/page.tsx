"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { NOT_FOUND_CODE, SUCCESS_CODE } from "@/constants/GlobalConstant";
import { ProductByIdDTO, CreateEditProductDTO } from "@/models/Product";
import { ProductService } from "@/services/api/ProductService";
import ProtectedRoute from "@/components/protected-route/ProtectedRoute";
import Modal from "@/components/modal/Modal";
import { CategoryService } from "@/services/api/CategoryService";
import { PaginationParam } from "@/models/GeneralDTO";
import Spinner from "@/components/spinner/Spinner";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";
import { CategoryByIdDTO } from "@/models/Category";

export default function ViewEditProduct() {
  const router = useRouter();

  const { productId } = useParams<{ productId: string }>();

  const [categoryId, setCategoryId] = useState(1);
  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isNotFound, setNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

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

  const getProductById = async () => {
    try {
      const getProductByIdParam: ProductByIdDTO = {
        productId: productId
      };

      const response = await ProductService.getProductById(getProductByIdParam);
      if (response.responseCode !== SUCCESS_CODE) {
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
  }

  const getAllCategories = async (searchText?: string) => {
    try {
      const getAllCategoriesParam: PaginationParam = {
        pagination: false,
        perPage: 10,
        page: 1,
        query: searchText,
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

        return list;
      }
    }
    catch (err) {
      setError(true);

      return [];
    }
  };

  const getCategoryById = async (id: number) => {
    try {
      const getCategoryByIdParam: CategoryByIdDTO = {
        id: id
      }

      const response = await CategoryService.getCategoryById(getCategoryByIdParam);
      if (response.responseCode != SUCCESS_CODE) {
        console.log("responseDate: ", response.responseDate);
        console.log("responseCode: ", response.responseCode);
        console.log("responseDesc: ", response.responseDesc);
        console.log("message: ", response.message);

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
    const product = await getProductById();
    if (!product) {
      return;
    }

    setCategoryId(product.categoryId!);
    setProductName(product.productName!);
    setUnit(product.unit!);
    setBasePrice(product.basePrice!);
    setSellingPrice(product.sellingPrice!);

    const category = await getCategoryById(product.categoryId!);
    if (!category) {
      return;
    }

    setSelectedCategory({ value: category.id, label: category.categoryName! });

    const list = await getAllCategories();
    if (!list) {
      return;
    }

    setCategoryList(list);
  };

  useEffect(() => {
    onInitialLoad();
  }, []);

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

    if (!productName.trim()) {
      errors.productName = "Product Name is required!";
    }

    if (!unit.trim()) {
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
      setError(true);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasError = validateEditProduct();

    if (!hasError) {
      await editProduct();
    }
  };

  const handleCancel = () => {
    router.push("/master/product");
  };

  const closeModal = () => {
    router.push('/master/product');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl bg-white rounded-2xl shadow p-6">
          <h1 className="text-xl text-center font-bold mb-4">Edit Product</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="productId" className="block text-sm font-medium mb-1">Product ID</label>
                <input
                  type="text"
                  id="productId"
                  name="productId"
                  value={!isNotFound ? productId : ""}
                  readOnly={true}
                  className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
                  placeholder="e.g., BRG-0001"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                <AsyncSelect
                  inputId="category"
                  cacheOptions
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
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderWidth: '1px',
                      borderColor: fieldErrors.categoryId ? '#dc2626' : '#d1d5db',
                      boxShadow: state.isFocused
                        ? fieldErrors.categoryId
                          ? '0 0 0 2px #dc2626'
                          : '0 0 0 2px #3b82f6'
                        : 'none',
                      '&:hover': {
                        borderColor: fieldErrors.categoryId ? '#dc2626' : '#d1d5db',
                      },
                      borderRadius: '0.375rem',
                    }),
                    input: (base) => ({
                      ...base,
                      fontSize: '0.875rem',
                    }),
                    singleValue: (base) => ({
                      ...base,
                      fontSize: '0.875rem',
                    }),
                    placeholder: (base) => ({
                      ...base,
                      fontSize: '0.875rem',
                      color: '#9ca3af',
                    }),
                    menu: (base) => ({
                      ...base,
                      fontSize: '0.875rem',
                    }),
                  }}
                />
                {fieldErrors.categoryId && (
                  <p className="col-start-3 col-span-4 text-sm text-red-600">
                    {fieldErrors.categoryId}
                  </p>
                )}
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
                className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${fieldErrors.productName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
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
                  className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${fieldErrors.unit ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
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
                  className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${fieldErrors.basePrice ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
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
                  className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${fieldErrors.sellingPrice ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                />
                {fieldErrors.sellingPrice && (
                  <p className="col-start-3 col-span-4 text-sm text-red-600">
                    {fieldErrors.sellingPrice}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center pt-2 gap-5">
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
          <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit Product">
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

        {isLoading && <Spinner message="Saving product..." />}
      </div>
    </ProtectedRoute>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { SUCCESS_CODE } from "@/constants/GlobalConstant";
// import { ProductByIdDTO, Product } from "@/models/Product";
// import { ProductService } from "@/services/api/ProductService";
// import EditProductForm from "./EditProductForm";
// import ProtectedRoute from "@/components/protected-route/ProtectedRoute";

// export default function ViewEditProduct() {
//   const { productId } = useParams<{ productId: string }>();
//   const [product, setProduct] = useState<Product | null>(null);

//   const [isLoading, setLoading] = useState(false);
//   const [isError, setError] = useState(false);

//   const getProductByIdParam: ProductByIdDTO = {
//     productId: productId
//   };

//   const getProductById = async () => {
//     try {
//       const response = await ProductService.getProductById(getProductByIdParam);
//       if (response.responseCode !== SUCCESS_CODE) {
//         console.log("responseDate: ", response.responseDate);
//         console.log("responseCode: ", response.responseCode);
//         console.log("responseDesc: ", response.responseDesc);
//         console.log("message: ", response.message);

//         setError(true);
//       }
//       else {
//         setProduct(response.data);
//       }
//     }
//     catch (err) {
//       setError(true);
//     }
//     finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     getProductById();
//   }, [productId]);

//   if (!product) {
//     return (
//       <ProtectedRoute>
//         <div className="min-h-screen flex items-center justify-center">
//           <p className="text-gray-500">Product not found.</p>
//         </div>
//       </ProtectedRoute>
//     );
//   }

//   return (
//     <ProtectedRoute>
//       <EditProductForm data={product!} />
//     </ProtectedRoute>
//   );
// }