'use client';

import { useCallback, useEffect, useState } from 'react';
import ProtectedRoute from '@/components/protected-route/ProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import { DropdownOption } from '@/models/GeneralDTO';
import { MessageState } from '@/models/UIModels';
import { MasterService } from '@/services/api/MasterService';
import { Controller, useForm } from 'react-hook-form';
import { MessageType, ResponseCode } from '@/enum/GlobalEnum';
import { ProductService } from '@/services/api/ProductService';
import { ProductByProductIdDTO } from '@/models/Product';
import debounce from 'lodash.debounce';
import { StockService } from '@/services/api/StockService';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants/MessageConstant';
import AsyncSelect from 'react-select/async';
import Modal from '@/components/modal/Modal';
import Spinner from '@/components/spinner/Spinner';
import { RowActions } from '@/components/actions/actionBar';
import { CreateStockDTO, EditStockDTO, StockByIdDTO, StockDTO, StockForm } from '@/models/Stock';

export default function EditStock() {
  const router = useRouter();

  const { id } = useParams<{ id: string }>();

  const flows = [
    { value: 'IN', label: 'Incoming' },
    { value: 'OUT', label: 'Outgoing' },
  ];
  const [selectedAction, setSelectedAction] = useState<string>('IN');

  const [suppliers, setSuppliers] = useState<DropdownOption[] | null>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>();
  const [products, setProducts] = useState<DropdownOption[] | null>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>();
  const [notesLength, setNotesLength] = useState(0);
  const [stocks, setStocks] = useState<StockForm[]>([]);

  const today = new Date().toISOString().split('T')[0];

  const [isLoading, setLoading] = useState(false);
  const [isNotFound, setNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [msgEdit, setMsgEdit] = useState<MessageState | null>(null);

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    control: controlEdit,
    setValue,
    reset: resetEdit,
    formState: { errors: errorsEdit },
    getValues,
  } = useForm<StockForm>({ shouldUnregister: true });

  const getStockById = async (id: number) => {
    const getStockByIdParam: StockByIdDTO = {
      id: id,
    };

    try {
      const response = await StockService.getStockById(getStockByIdParam);
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

  const getMasterProductBySupplier = async (supplierId: number, search?: string) => {
    try {
      const response = await MasterService.getMasterProductBySupplier(supplierId, search);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        return null;
      } else {
        return response.data;
      }
    } catch {
      return null;
    }
  };

  const getProductById = async (productId: string) => {
    const getProductByIdParam: ProductByProductIdDTO = {
      productId: productId,
    };

    try {
      const response = await ProductService.getProductByProductId(getProductByIdParam);
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

    const supplierList = await getMasterSupplier();
    setSuppliers(supplierList);

    const selectedStock = await getStockById(Number(id));
    setSelectedSupplier(Number(selectedStock?.supplierId ?? 0));
    setSelectedAction(selectedStock?.action ?? 'IN');

    const productList = await getMasterProductBySupplier(Number(selectedStock?.supplierId ?? 0));
    setProducts(productList);
    setSelectedProduct(selectedStock?.productId ?? '');

    resetEdit({
      supplierId: Number(selectedStock?.supplierId ?? 0),
      productId: selectedStock?.productId ?? '',
      invoiceNo: selectedStock?.invoiceNo ?? '',
      invoiceDate: selectedStock?.invoiceDate ?? '',
      transactionDate: selectedStock?.transactionDate ?? '',
      newStock: Number(selectedStock?.stock ?? 0),
      notes: selectedStock?.notes ?? '',
    });

    setNotesLength(selectedStock?.notes?.length ?? 0);
  };

  useEffect(() => {
    onInitialLoad();
  }, []);

  useEffect(() => {
    setValue('productId', '');
    setSelectedProduct(null);
    if (selectedSupplier && selectedSupplier !== 0) {
      getMasterProductBySupplier(selectedSupplier).then(setProducts);
    }
  }, [selectedSupplier]);

  useEffect(() => {
    if (selectedProduct) {
      getProductById(selectedProduct).then((product) => {
        setValue('currentStock', Number(product?.stock ?? 0));
      });
    } else {
      setValue('currentStock', 0);
    }
  }, [selectedProduct]);

  const debouncedGetAllSuppliers = useCallback(
    debounce((query: string, callback: (options: any[]) => void) => {
      getMasterSupplier(query).then((options) => {
        callback(options ?? []);
      });
    }, 500),
    []
  );

  const debouncedGetAllProducts = useCallback(
    debounce((inputValue: string, callback: (options: any[]) => void) => {
      getMasterProductBySupplier(Number(selectedSupplier), inputValue).then((options) => {
        callback(options ?? []);
      });
    }, 500),
    [selectedSupplier]
  );

  const submitEdit = async (stock: StockDTO) => {
    setMsgEdit(null);

    const editStockParam: EditStockDTO = {
      action: selectedAction ?? '',
      id: Number(id),
      supplierId: Number(stock.supplierId),
      productId: stock.productId,
      invoiceNo: stock.invoiceNo ?? '',
      invoiceDate: stock.invoiceDate,
      transactionDate: stock.transactionDate,
      newStock: stock.newStock,
      notes: stock.notes,
    };

    try {
      setSavingEdit(true);

      const response = await StockService.updateStock(editStockParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgEdit({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.UPDATE('Stock'),
        });
      } else {
        setMsgEdit({
          type: MessageType.SUCCESS,
          message: response.message || SUCCESS_MSG.UPDATE('Stock'),
        });
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

  const closeModal = () => {
    router.push('/inventory/stock');
  };

  const onCancel = () => {
    router.push('/inventory/stock');
  };

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-slate-50'>
        <div className='flex min-h-screen flex-col gap-6 bg-slate-50 p-6'>
          <div className='w-full max-w-6xl rounded-2xl bg-white p-6 shadow'>
            <h1 className='mb-4 text-center text-xl font-bold'>Create Stock</h1>
            <form onSubmit={handleSubmitEdit(submitEdit)} className='space-y-5' noValidate>
              {msgEdit?.type === MessageType.ERROR && (
                <div className='alert--error'>{msgEdit.message}</div>
              )}

              <div>
                <label className='form-label'>Flow</label>
                <AsyncSelect
                  defaultOptions={flows}
                  options={flows}
                  value={flows.find((f) => f.value === selectedAction)}
                  onChange={(selected) => setSelectedAction(selected?.value || '')}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderWidth: '1px',
                      borderColor: '#d1d5db',
                      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                      '&:hover': {
                        borderColor: '#d1d5db',
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
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-4'>
                <div>
                  <label htmlFor='supplierId' className='form-label'>
                    Supplier
                  </label>
                  <Controller
                    name='supplierId'
                    control={controlEdit}
                    rules={{
                      required: {
                        value: true,
                        message: 'Please select a supplier!',
                      },
                      validate: (value) => (value === 0 ? 'Please select a supplier!' : true),
                    }}
                    render={({ field }) => {
                      return (
                        <AsyncSelect
                          inputId='supplierId'
                          cacheOptions
                          defaultOptions={suppliers || []}
                          loadOptions={debouncedGetAllSuppliers}
                          isSearchable
                          placeholder='Select a supplier...'
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              borderWidth: '1px',
                              borderColor: errorsEdit.supplierId ? '#dc2626' : '#d1d5db',
                              boxShadow: state.isFocused
                                ? errorsEdit.supplierId
                                  ? '0 0 0 1px #dc2626'
                                  : '0 0 0 1px #3b82f6'
                                : 'none',
                              '&:hover': {
                                borderColor: errorsEdit.supplierId ? '#dc2626' : '#d1d5db',
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
                          value={suppliers?.find((opt) => opt.value === field.value) || null}
                          onChange={(selected) => {
                            const value = selected?.value;
                            const label = selected?.label;
                            field.onChange(value);
                            setValue('supplierName', label ?? '', { shouldValidate: true });
                            setSelectedSupplier(Number(value));
                          }}
                        />
                      );
                    }}
                  />
                  {errorsEdit.supplierId && (
                    <p className='mt-1 text-sm text-red-500'>{errorsEdit.supplierId.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor='invoiceNo' className='form-label'>
                    Invoice No
                  </label>
                  <input
                    type='text'
                    id='invoiceNo'
                    className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.invoiceNo ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    {...registerEdit('invoiceNo', {
                      maxLength: {
                        value: 50,
                        message: 'Maximum invoice number length is 50 characters!!',
                      },
                    })}
                    placeholder='e.g., INV-S2500001-20251021132335'
                  />
                  {errorsEdit.invoiceNo && (
                    <p className='text-sm text-red-600'>{errorsEdit.invoiceNo.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor='invoiceDate' className='form-label'>
                    Invoice Date
                  </label>
                  <input
                    type='date'
                    id='invoiceDate'
                    {...registerEdit('invoiceDate', {
                      required: {
                        value: true,
                        message: 'Invoice date is required!',
                      },
                    })}
                    max={today}
                    className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.invoiceDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  />
                  {errorsEdit.invoiceDate && (
                    <p className='mt-1 text-sm text-red-500'>{errorsEdit.invoiceDate.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor='transactionDate' className='form-label'>
                    Transaction Date
                  </label>
                  <input
                    type='date'
                    id='transactionDate'
                    {...registerEdit('transactionDate', {
                      required: {
                        value: true,
                        message: 'Transaction date is required!',
                      },
                      validate: (value) => {
                        const invoiceDate = getValues('invoiceDate');
                        if (!invoiceDate) return true;
                        return (
                          value >= invoiceDate ||
                          'Transaction date must be after or equal to invoice date!'
                        );
                      },
                    })}
                    max={today}
                    className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.transactionDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  />
                  {errorsEdit.transactionDate && (
                    <p className='mt-1 text-sm text-red-500'>
                      {errorsEdit.transactionDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                <div>
                  <label htmlFor='productId' className='form-label'>
                    Product
                  </label>
                  <Controller
                    name='productId'
                    control={controlEdit}
                    rules={{
                      required: {
                        value: true,
                        message: 'Please select a product!',
                      },
                    }}
                    render={({ field }) => {
                      return (
                        <AsyncSelect
                          inputId='productId'
                          cacheOptions
                          defaultOptions={products || []}
                          loadOptions={debouncedGetAllProducts}
                          noOptionsMessage={() =>
                            !selectedSupplier || selectedSupplier === 0
                              ? 'Please select a supplier first'
                              : 'No products found'
                          }
                          isSearchable={!!selectedSupplier}
                          placeholder='Select a product...'
                          isOptionDisabled={(option) =>
                            stocks.some((stock) => stock.productId === option.value)
                          }
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              borderWidth: '1px',
                              borderColor: errorsEdit.productId ? '#dc2626' : '#d1d5db',
                              boxShadow: state.isFocused
                                ? errorsEdit.productId
                                  ? '0 0 0 1px #dc2626'
                                  : '0 0 0 1px #3b82f6'
                                : 'none',
                              '&:hover': {
                                borderColor: errorsEdit.productId ? '#dc2626' : '#d1d5db',
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
                          value={products?.find((opt) => opt.value === field.value) || null}
                          onChange={(selected) => {
                            const value = selected?.value;
                            const label = selected?.label;
                            field.onChange(value);
                            setValue('productName', label!, { shouldValidate: true });
                            setSelectedProduct(value?.toString());
                          }}
                        />
                      );
                    }}
                  />
                  {errorsEdit.productId && (
                    <p className='mt-1 text-sm text-red-500'>{errorsEdit.productId.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor='currentStock' className='form-label'>
                    Current Stock
                  </label>
                  <input
                    type='number'
                    id='previousStock'
                    {...registerEdit('currentStock')}
                    disabled
                    className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.currentStock ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  />
                </div>

                <div>
                  <label htmlFor='newStock' className='form-label'>
                    New Stock
                  </label>
                  <input
                    type='number'
                    id='outgoingStock'
                    step='0.01'
                    {...registerEdit('newStock', {
                      required: {
                        value: true,
                        message: 'New product stock is required!',
                      },
                      validate: {
                        positive: (value) => value > 0 || 'New stock must be greater than 0!',
                        decimal: (value) =>
                          /^\d+(\.\d{1,2})?$/.test(value.toString()) ||
                          'Stock can have at most 2 decimal places!',
                      },
                      valueAsNumber: true,
                    })}
                    className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.newStock ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  />
                  {errorsEdit.newStock && (
                    <p className='text-sm text-red-600'>{errorsEdit.newStock.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor='notes' className='form-label'>
                  Notes
                </label>
                <textarea
                  id='notes'
                  {...registerEdit('notes', {
                    onChange: (e) => setNotesLength(e.target.value.length),
                  })}
                  className={`form-input resize-none focus:outline-none focus:ring-1 ${errorsEdit.notes ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                  rows={3}
                  maxLength={500}
                />
                <p className='text-sm text-gray-500'>{notesLength}/500 characters</p>
                {errorsEdit.notes && (
                  <p className='mt-1 text-sm text-red-500'>{errorsEdit.notes.message}</p>
                )}
              </div>

              <div className='flex justify-end gap-3 pt-2'>
                <button
                  type='submit'
                  className='btn--gradient btn--md btn--disabled'
                  disabled={savingEdit}
                >
                  {savingEdit ? 'Saving...' : 'Save'}
                </button>
                <button type='button' onClick={onCancel} className='btn--soft'>
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <Modal isOpen={isModalOpen} onClose={closeModal} title='Create Stock'>
            <p>{msgEdit?.message}</p>
            <div className='mt-4 flex justify-end space-x-2'>
              <button onClick={closeModal} className='btn--gradient btn--md'>
                OK
              </button>
            </div>
          </Modal>

          {savingEdit && (
            <Spinner message={stocks.length > 1 ? 'Saving new stocks...' : 'Saving new stock...'} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
