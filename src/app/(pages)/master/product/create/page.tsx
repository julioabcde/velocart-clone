'use client';

import { useCallback, useEffect, useState } from 'react';
import { DropdownOption } from '@/models/GeneralDTO';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import { ProductService } from '@/services/api/ProductService';
import { useRouter } from 'next/navigation';
import { CreateEditProductDTO } from '@/models/Product';
import ProtectedRoute from '@/components/protected-route/ProtectedRoute';
import Modal from '@/components/modal/Modal';
import Spinner from '@/components/spinner/Spinner';
import { MasterService } from '@/services/api/MasterService';
import { MessageType, ResponseCode } from '@/enum/GlobalEnum';
import { MessageState } from '@/models/UIModels';
import { Controller, useForm } from 'react-hook-form';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants/MessageConstant';

export default function CreateProduct() {
  const router = useRouter();

  const [categories, setCategories] = useState<DropdownOption[] | null>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingCreate, setSavingCreate] = useState(false);
  const [msgCreate, setMsgCreate] = useState<MessageState | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    control: controlCreate,
    formState: { errors: errorsCreate },
  } = useForm<CreateEditProductDTO>({ shouldUnregister: true });

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

  const onInitialLoad = async () => {
    const categoryList = await getMasterCategory('');
    setCategories(categoryList);
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

  const submitCreate = async (createProductParam: CreateEditProductDTO) => {
    setMsgCreate(null);

    try {
      setSavingCreate(true);

      const response = await ProductService.createProduct(createProductParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgCreate({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.CREATE('Product'),
        });
      } else {
        setMsgCreate({
          type: MessageType.SUCCESS,
          message: response.message || SUCCESS_MSG.CREATE('Product'),
        });
        setIsModalOpen(true);
      }
    } catch (e: any) {
      setMsgCreate({
        type: MessageType.ERROR,
        message: e?.message || ERROR_MSG.GENERAL,
      });
    } finally {
      setSavingCreate(false);
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
          <h1 className='mb-4 text-center text-xl font-bold'>Create Product</h1>
          <form onSubmit={handleSubmitCreate(submitCreate)} className='space-y-5'>
            {msgCreate?.type === MessageType.ERROR && (
              <div className='alert--error'>{msgCreate.message}</div>
            )}

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div>
                <label htmlFor='productId' className='form-label'>
                  Product ID / Barcode <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='productId'
                  className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.productId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  {...registerCreate('productId', {
                    required: {
                      value: true,
                      message: 'Product ID is required!',
                    },
                  })}
                  placeholder='e.g., BRG-0001'
                />
                {errorsCreate.productId && (
                  <p className='text-sm text-red-600'>{errorsCreate.productId.message}</p>
                )}
              </div>

              <div>
                <label htmlFor='categoryId' className='form-label'>
                  Category <span className='text-red-500'>*</span>
                </label>
                <Controller
                  name='categoryId'
                  control={controlCreate}
                  rules={{
                    required: {
                      value: true,
                      message: 'Please select a category!',
                    },
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
                            borderColor: errorsCreate.categoryId ? '#dc2626' : '#d1d5db',
                            boxShadow: state.isFocused
                              ? errorsCreate.categoryId
                                ? '0 0 0 1px #dc2626'
                                : '0 0 0 1px #3b82f6'
                              : 'none',
                            '&:hover': {
                              borderColor: errorsCreate.categoryId ? '#dc2626' : '#d1d5db',
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

                {errorsCreate.categoryId && (
                  <p className='text-sm text-red-600'>{errorsCreate.categoryId.message}</p>
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
                className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.productName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                {...registerCreate('productName', {
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
              {errorsCreate.productName && (
                <p className='text-sm text-red-600'>{errorsCreate.productName.message}</p>
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
                  className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.unit ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  {...registerCreate('unit', {
                    required: {
                      value: true,
                      message: 'Unit is required!',
                    },
                  })}
                  placeholder='e.g., strip, box'
                />
                {errorsCreate.unit && (
                  <p className='text-sm text-red-600'>{errorsCreate.unit.message}</p>
                )}
              </div>

              <div>
                <label htmlFor='basePrice' className='form-label'>
                  Base Price <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  id='basePrice'
                  {...registerCreate('basePrice', {
                    required: {
                      value: true,
                      message: 'Base price is required!',
                    },
                    validate: (value) => value > 0 || 'Base price must be greater than 0!',
                    valueAsNumber: true,
                  })}
                  className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.basePrice ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {errorsCreate.basePrice && (
                  <p className='text-sm text-red-600'>{errorsCreate.basePrice.message}</p>
                )}
              </div>

              <div>
                <label htmlFor='sellingPrice' className='form-label'>
                  Selling Price <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  id='sellingPrice'
                  {...registerCreate('sellingPrice', {
                    required: {
                      value: true,
                      message: 'Selling price is required!',
                    },
                    validate: (value) => value > 0 || 'Selling price must be greater than 0!',
                    valueAsNumber: true,
                  })}
                  className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.sellingPrice ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {errorsCreate.sellingPrice && (
                  <p className='text-sm text-red-600'>{errorsCreate.sellingPrice.message}</p>
                )}
              </div>
            </div>

            <div className='flex justify-end gap-3 pt-2'>
              <button
                type='submit'
                className='btn--gradient btn--md btn--disabled'
                disabled={savingCreate}
              >
                {savingCreate ? 'Saving...' : 'Save'}
              </button>
              <button
                type='button'
                onClick={onCancel}
                className='btn--soft'
                disabled={savingCreate}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} title='Create Product'>
          <p>{msgCreate?.message}</p>
          <div className='mt-4 flex justify-end space-x-2'>
            <button onClick={closeModal} className='btn--gradient'>
              OK
            </button>
          </div>
        </Modal>

        {savingCreate && <Spinner message='Saving new product...' />}
      </div>
    </ProtectedRoute>
  );
}
