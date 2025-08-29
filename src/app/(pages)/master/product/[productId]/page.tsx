'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductByProductIdDTO, CreateEditProductDTO, Product } from '@/models/Product';
import { ProductService } from '@/services/api/ProductService';
import ProtectedRoute from '@/components/protected-route/ProtectedRoute';
import Modal from '@/components/modal/Modal';
import { CategoryService } from '@/services/api/CategoryService';
import { DropdownOption } from '@/models/GeneralDTO';
import Spinner from '@/components/spinner/Spinner';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import { CategoryByIdDTO } from '@/models/Category';
import { MessageState } from '@/models/UIModels';
import { Controller, useForm } from 'react-hook-form';
import { MessageType, ResponseCode } from '@/enum/GlobalEnum';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants/MessageConstant';
import { MasterService } from '@/services/api/MasterService';

export default function ViewEditProduct() {
  const router = useRouter();

  const { productId } = useParams<{ productId: string }>();

  const [categories, setCategories] = useState<DropdownOption[] | null>(null);
  const [suppliers, setSuppliers] = useState<DropdownOption[] | null>([]);

  const [isLoading, setLoading] = useState(false);
  const [isNotFound, setNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [msgEdit, setMsgEdit] = useState<MessageState | null>(null);

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    control: controlEdit,
    formState: { errors: errorsEdit },
  } = useForm<CreateEditProductDTO>({ shouldUnregister: true });

  const getProductById = async (productId: string) => {
    const getProductByIdParam: ProductByProductIdDTO = {
      productId: productId,
    };

    try {
      const response = await ProductService.getProductByProductId(getProductByIdParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        if (response.responseCode === ResponseCode.NOT_FOUND) {
          setNotFound(true);
          setMsgEdit({
            type: MessageType.ERROR,
            message: response.message || ERROR_MSG.NOTFOUND,
          });
        }
        setIsModalOpen(true);

        return null;
      } else {
        return response.data;
      }
    } catch {
      return null;
    }
  };

  const getCategoryById = async (id: number) => {
    const getCategoryByIdParam: CategoryByIdDTO = {
      id: Number(id),
    };

    try {
      const response = await CategoryService.getCategoryById(getCategoryByIdParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        return null;
      } else {
        return response.data;
      }
    } catch {
      return null;
    }
  };

  const getMasterCategory = async (search?: string) => {
    try {
      const response = await MasterService.getMasterCategory(search);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        return null;
      } else {
        return response.data;
      }
    } catch {
      return null;
    }
  };

  const getMasterSupplier = async (search?: string) => {
    try {
      const response = await MasterService.getMasterSupplier(search);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        return null;
      } else {
        return response.data;
      }
    } catch {
      return null;
    }
  };

  const onInitialLoad = async () => {
    setLoading(true);

    const categoryList = await getMasterCategory('');
    setCategories(categoryList);

    const supplierList = await getMasterSupplier('');
    setSuppliers(supplierList);

    const selectedProduct = await getProductById(productId);
    const selectedCategory = await getCategoryById(selectedProduct?.categoryId!);
    resetEdit({
      productId: selectedProduct?.productId ?? '',
      categoryId: Number(selectedCategory?.id ?? 0),
      productName: selectedProduct?.productName ?? '',
      unit: selectedProduct?.unit ?? '',
      basePrice: selectedProduct?.basePrice ?? 0,
      sellingPrice: selectedProduct?.sellingPrice ?? 0,
      suppliers: selectedProduct?.suppliers?.map((s) => Number(s.value)) ?? [],
    });
    
    setLoading(false);
  };

  useEffect(() => {
    onInitialLoad();
  }, []);

  const debouncedGetAllCategories = useCallback(
    debounce((query: string, callback: (options: any[]) => void) => {
      getMasterCategory(query).then((options) => {
        callback(options ?? []);
      });
    }, 500),
    []
  );

  const debouncedGetAllSuppliers = useCallback(
    debounce((query: string, callback: (options: any[]) => void) => {
      getMasterSupplier(query).then((options) => {
        callback(options ?? []);
      });
    }, 500),
    []
  );

  const submitEdit = async (editProductParam: CreateEditProductDTO) => {
    setMsgEdit(null);

    try {
      setSavingEdit(true);

      const response = await ProductService.updateProduct(editProductParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgEdit({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.UPDATE('Product'),
        });
      } else {
        setMsgEdit({
          type: MessageType.SUCCESS,
          message: response.message || SUCCESS_MSG.UPDATE('Product'),
        });
        setSuccess(true);
        setIsModalOpen(true);
      }
    } catch (e: any) {
      setMsgEdit({
        type: MessageType.ERROR,
        message: e?.message || ERROR_MSG.GENERAL,
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const onCancel = () => {
    router.push('/master/product');
  };

  const closeModal = () => {
    router.push('/master/product');
  };

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-slate-50 p-6'>
        <div className='mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow'>
          <h1 className='mb-4 text-center text-xl font-bold'>Edit Product</h1>
          <form onSubmit={handleSubmitEdit(submitEdit)} className='space-y-5'>
            {msgEdit?.type === MessageType.ERROR && !isNotFound && (
              <div className='alert--error'>{msgEdit.message}</div>
            )}

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div>
                <label htmlFor='productId' className='form-label'>
                  Product ID / Barcode <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='productId'
                  className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.productId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  disabled
                  {...registerEdit('productId')}
                  placeholder='e.g., BRG-0001'
                />
                {errorsEdit.productId && (
                  <p className='text-sm text-red-600'>{errorsEdit.productId.message}</p>
                )}
              </div>

              <div>
                <label htmlFor='categoryId' className='form-label'>
                  Category <span className='text-red-500'>*</span>
                </label>
                <Controller
                  name='categoryId'
                  control={controlEdit}
                  rules={{
                    required: {
                      value: true,
                      message: 'Please select a category!',
                    },
                    validate: (value) => (value === 0 ? 'Please select a category!' : true),
                  }}
                  render={({ field }) => {
                    return (
                      <AsyncSelect
                        inputId='categoryId'
                        cacheOptions
                        defaultOptions={categories || []}
                        loadOptions={debouncedGetAllCategories}
                        isSearchable
                        placeholder='Select a category...'
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderWidth: '1px',
                            borderColor: errorsEdit.categoryId ? '#dc2626' : '#d1d5db',
                            boxShadow: state.isFocused
                              ? errorsEdit.categoryId
                                ? '0 0 0 1px #dc2626'
                                : '0 0 0 1px #3b82f6'
                              : 'none',
                            '&:hover': {
                              borderColor: errorsEdit.categoryId ? '#dc2626' : '#d1d5db',
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
                        value={categories?.find((opt) => opt.value === field.value)}
                        onChange={(selected) => field.onChange(selected?.value)}
                      />
                    );
                  }}
                />

                {errorsEdit.categoryId && (
                  <p className='text-sm text-red-600'>{errorsEdit.categoryId.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor='productName' className='form-label'>
                Product Name <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='productName'
                className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.productName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                {...registerEdit('productName', {
                  required: {
                    value: true,
                    message: 'Product name is required!',
                  },
                  maxLength: {
                    value: 255,
                    message: 'Maximum product name length is 255 characters!',
                  },
                })}
                placeholder='e.g., Amoxilin BPJS'
              />
              {errorsEdit.productName && (
                <p className='text-sm text-red-600'>{errorsEdit.productName.message}</p>
              )}
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
              <div>
                <label htmlFor='unit' className='form-label'>
                  Unit <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='unit'
                  className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.unit ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  {...registerEdit('unit', {
                    required: {
                      value: true,
                      message: 'Unit is required!',
                    },
                  })}
                  placeholder='e.g., strip, box'
                />
                {errorsEdit.unit && (
                  <p className='text-sm text-red-600'>{errorsEdit.unit.message}</p>
                )}
              </div>

              <div>
                <label htmlFor='basePrice' className='form-label'>
                  Base Price <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  id='basePrice'
                  {...registerEdit('basePrice', {
                    required: {
                      value: true,
                      message: 'Base price is required!',
                    },
                    validate: (value) => value > 0 || 'Base price must be greater than 0!',
                    valueAsNumber: true,
                  })}
                  className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.basePrice ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {errorsEdit.basePrice && (
                  <p className='text-sm text-red-600'>{errorsEdit.basePrice.message}</p>
                )}
              </div>

              <div>
                <label htmlFor='sellingPrice' className='form-label'>
                  Selling Price <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  id='sellingPrice'
                  {...registerEdit('sellingPrice', {
                    required: {
                      value: true,
                      message: 'Selling price is required!',
                    },
                    validate: (value) => value > 0 || 'Selling price must be greater than 0!',
                    valueAsNumber: true,
                  })}
                  className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.sellingPrice ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {errorsEdit.sellingPrice && (
                  <p className='text-sm text-red-600'>{errorsEdit.sellingPrice.message}</p>
                )}
              </div>
            </div>

            <div>
              <div>
                <label htmlFor='suppliers' className='form-label'>
                  Suppliers <span className='text-red-500'>*</span>
                </label>
                <Controller
                  name='suppliers'
                  control={controlEdit}
                  rules={{
                    required: {
                      value: true,
                      message: 'Please select at least one supplier!',
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <AsyncSelect
                        inputId='suppliers'
                        cacheOptions
                        defaultOptions={suppliers || []}
                        loadOptions={debouncedGetAllSuppliers}
                        isSearchable
                        isMulti
                        placeholder='Select suppliers...'
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderWidth: '1px',
                            borderColor: errorsEdit.suppliers ? '#dc2626' : '#d1d5db',
                            boxShadow: state.isFocused
                              ? errorsEdit.suppliers
                                ? '0 0 0 1px #dc2626'
                                : '0 0 0 1px #3b82f6'
                              : 'none',
                            '&:hover': {
                              borderColor: errorsEdit.suppliers ? '#dc2626' : '#d1d5db',
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
                        value={
                          (field.value || []).map((id: number) =>
                            suppliers?.find((opt) => opt.value === id)
                          ) || []
                        }
                        onChange={(selected) =>
                          field.onChange(selected ? selected.map((opt) => opt?.value) : [])
                        }
                      />
                    );
                  }}
                />

                {errorsEdit.suppliers && (
                  <p className='text-sm text-red-600'>{errorsEdit.suppliers.message}</p>
                )}
              </div>
            </div>

            <div className='flex justify-end gap-3 pt-2'>
              <button
                type='submit'
                className='btn--gradient btn--md btn--disabled'
                disabled={savingEdit}
              >
                {savingEdit ? 'Saving...' : 'Save'}
              </button>
              <button type='button' onClick={onCancel} className='btn--soft' disabled={savingEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>

        {isNotFound && (
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title='Not Found'
            size='sm'
            backdrop='blur'
          >
            <p>{msgEdit?.message}</p>
            <div className='mt-4 flex justify-end space-x-2'>
              <button onClick={closeModal} className='btn--gradient btn--md'>
                OK
              </button>
            </div>
          </Modal>
        )}

        {isSuccess && (
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title='Edit Product'
            size='sm'
            backdrop='blur'
          >
            <p>{msgEdit?.message}</p>
            <div className='mt-4 flex justify-end space-x-2'>
              <button onClick={closeModal} className='btn--gradient btn--md'>
                OK
              </button>
            </div>
          </Modal>
        )}

        {savingEdit && <Spinner message='Saving product...' />}

        {isLoading && <Spinner message='Loading product...' />}
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
