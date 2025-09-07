'use client';

import { RowActions } from '@/components/actions/actionBar';
import Modal from '@/components/modal/Modal';
import Spinner from '@/components/spinner/Spinner';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants/MessageConstant';
import { MessageType, ResponseCode } from '@/enum/GlobalEnum';
import { DropdownOption } from '@/models/GeneralDTO';
import { ProductByProductIdDTO } from '@/models/Product';
import { CreateIncomingStockDTO, IncomingStock } from '@/models/Stock';
import { MessageState } from '@/models/UIModels';
import { MasterService } from '@/services/api/MasterService';
import { ProductService } from '@/services/api/ProductService';
import { StockService } from '@/services/api/StockService';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import AsyncSelect from 'react-select/async';

export default function IncomingStockForm() {
  const router = useRouter();

  const [selectedAction, setSelectedAction] = useState('');
  const [suppliers, setSuppliers] = useState<DropdownOption[] | null>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>();
  const [products, setProducts] = useState<DropdownOption[] | null>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>();
  const [notesLength, setNotesLength] = useState(0);
  const [stocks, setStocks] = useState<IncomingStock[]>([]);

  const today = new Date().toISOString().split('T')[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingCreate, setSavingCreate] = useState(false);
  const [msgCreate, setMsgCreate] = useState<MessageState | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    control: controlCreate,
    setValue,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<IncomingStock>({ shouldUnregister: true });

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
    const supplierList = await getMasterSupplier();
    setSuppliers(supplierList);
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

  const resetForm = () => {
    resetCreate();
    setSelectedSupplier(0);
    setSelectedProduct(null);
    setProducts(null);
    setValue('currentStock', 0);
    setNotesLength(0);
  };

  const onAdd = async (stock: IncomingStock) => {
    setStocks((prev) => {
      const existing = prev.findIndex(
        (item) =>
          item.productId === stock.productId &&
          item.supplierId === stock.supplierId &&
          item.invoiceDate === stock.invoiceDate &&
          item.receivedDate === stock.receivedDate
      );

      if (existing !== -1) {
        const updated = [...prev];
        updated[existing].incomingStock += Number(stock.incomingStock);

        return updated;
      } else {
        return [...prev, stock];
      }
    });
    resetForm();
  };

  const onDelete = async (stock: IncomingStock) => {
    setStocks((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === stock.productId &&
            item.supplierId === stock.supplierId &&
            item.invoiceDate === stock.invoiceDate &&
            item.receivedDate === stock.receivedDate
          )
      )
    );
  };

  const submitCreate = async () => {
    setMsgCreate(null);

    const createStockParam: CreateIncomingStockDTO[] = stocks.map((form) => ({
      supplierId: form.supplierId,
      productId: form.productId,
      invoiceDate: form.invoiceDate,
      receivedDate: form.receivedDate,
      incomingStock: form.incomingStock,
      notes: form.notes,
    }));

    try {
      setSavingCreate(true);

      const response = await StockService.createStock(createStockParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgCreate({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.CREATE('Stock'),
        });
      } else {
        setMsgCreate({
          type: MessageType.SUCCESS,
          message: response.message || SUCCESS_MSG.CREATE('Stock'),
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

  const onClearTable = () => {
    setStocks([]);
  };

  const closeModal = () => {
    router.push('/master/stock');
  };

  return (
    <div className='flex min-h-screen flex-col gap-6 bg-slate-50 p-6'>
      <div className='w-full max-w-6xl rounded-2xl bg-white p-6 shadow'>
        <h1 className='mb-4 text-center text-xl font-bold'>Create Incoming Stock</h1>
        <form onSubmit={handleSubmitCreate(onAdd)} className='space-y-5' noValidate>
          {msgCreate?.type === MessageType.ERROR && (
            <div className='alert--error'>{msgCreate.message}</div>
          )}

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <div>
              <label htmlFor='supplierId' className='form-label'>
                Supplier
              </label>
              <Controller
                name='supplierId'
                control={controlCreate}
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
                          borderColor: errorsCreate.supplierId ? '#dc2626' : '#d1d5db',
                          boxShadow: state.isFocused
                            ? errorsCreate.supplierId
                              ? '0 0 0 1px #dc2626'
                              : '0 0 0 1px #3b82f6'
                            : 'none',
                          '&:hover': {
                            borderColor: errorsCreate.supplierId ? '#dc2626' : '#d1d5db',
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
              {errorsCreate.supplierId && (
                <p className='mt-1 text-sm text-red-500'>{errorsCreate.supplierId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor='invoiceDate' className='form-label'>
                Invoice Date
              </label>
              <input
                type='date'
                id='invoiceDate'
                {...registerCreate('invoiceDate', {
                  required: {
                    value: true,
                    message: 'Invoice date is required!',
                  },
                })}
                max={today}
                className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.invoiceDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              />
              {errorsCreate.invoiceDate && (
                <p className='mt-1 text-sm text-red-500'>{errorsCreate.invoiceDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor='receivedDate' className='form-label'>
                Received Date
              </label>
              <input
                type='date'
                id='receivedDate'
                {...registerCreate('receivedDate', {
                  required: {
                    value: true,
                    message: 'Received date is required!',
                  },
                })}
                max={today}
                className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.receivedDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              />
              {errorsCreate.receivedDate && (
                <p className='mt-1 text-sm text-red-500'>{errorsCreate.receivedDate.message}</p>
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
                control={controlCreate}
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
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderWidth: '1px',
                          borderColor: errorsCreate.productId ? '#dc2626' : '#d1d5db',
                          boxShadow: state.isFocused
                            ? errorsCreate.productId
                              ? '0 0 0 1px #dc2626'
                              : '0 0 0 1px #3b82f6'
                            : 'none',
                          '&:hover': {
                            borderColor: errorsCreate.productId ? '#dc2626' : '#d1d5db',
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
              {errorsCreate.productId && (
                <p className='mt-1 text-sm text-red-500'>{errorsCreate.productId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor='currentStock' className='form-label'>
                Current Stock
              </label>
              <input
                type='number'
                id='previousStock'
                {...registerCreate('currentStock')}
                disabled
                className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.currentStock ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              />
            </div>

            <div>
              <label htmlFor='incomingStock' className='form-label'>
                Incoming Stock
              </label>
              <input
                type='number'
                id='incomingStock'
                step='0.01'
                {...registerCreate('incomingStock', {
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
                className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.incomingStock ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              />
              {errorsCreate.incomingStock && (
                <p className='text-sm text-red-600'>{errorsCreate.incomingStock.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor='notes' className='form-label'>
              Notes
            </label>
            <textarea
              id='notes'
              {...registerCreate('notes', {
                onChange: (e) => setNotesLength(e.target.value.length),
              })}
              className={`form-input resize-none focus:outline-none focus:ring-1 ${errorsCreate.notes ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              rows={3}
              maxLength={500}
            />
            <p className='text-sm text-gray-500'>{notesLength}/500 characters</p>
            {errorsCreate.notes && (
              <p className='mt-1 text-sm text-red-500'>{errorsCreate.notes.message}</p>
            )}
          </div>

          <div className='flex justify-end gap-3 pt-2'>
            <button type='submit' className='btn--gradient btn--md'>
              Add
            </button>
            <button type='button' onClick={resetForm} className='btn--soft'>
              Reset Form
            </button>
          </div>
        </form>
      </div>

      <div className='max-w-6xl rounded-2xl bg-white p-6 shadow'>
        <div className='table-responsive-scrollable'>
          <table className='table-head-custom table-vertical-center table w-full text-center'>
            <thead>
              <tr>
                <th className='w-[120px]'>ACTION</th>
                <th className='w-[130px]'>SUPPLIER</th>
                <th className='w-[130px]'>PRODUCT</th>
                <th className='w-[100px]'>INVOICE DATE</th>
                <th className='w-[110px]'>RECEIVED DATE</th>
                <th className='w-[50px]'>STOCK</th>
                <th className='w-[170px]'>NOTES</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((item, id) => (
                <tr key={id}>
                  <td className='text-center'>
                    <RowActions item={item} onDelete={onDelete} />
                  </td>
                  <td className='max-w-[130px] whitespace-normal break-words text-center'>
                    {item.supplierName}
                  </td>
                  <td className='max-w-[130px] whitespace-normal break-words text-center'>
                    {item.productName}
                  </td>
                  <td className='text-center'>{item.invoiceDate}</td>
                  <td className='text-center'>{item.receivedDate}</td>
                  <td className='text-center'>{item.incomingStock}</td>
                  <td className='max-w-[170px] whitespace-normal break-words text-center'>
                    {item.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stocks.length > 0 && (
          <div className='flex justify-end gap-3 pt-2'>
            <button
              type='button'
              onClick={submitCreate}
              className='btn--gradient btn--md'
              disabled={savingCreate}
            >
              {savingCreate ? 'Saving...' : 'Save'}
            </button>
            <button type='button' onClick={onClearTable} className='btn--soft'>
              Clear All
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title='Create Stock'>
        <p>{msgCreate?.message}</p>
        <div className='mt-4 flex justify-end space-x-2'>
          <button onClick={closeModal} className='btn--gradient btn--md'>
            OK
          </button>
        </div>
      </Modal>

      {savingCreate && (
        <Spinner message={stocks.length > 1 ? 'Saving new stocks...' : 'Saving new stock...'} />
      )}
    </div>
  );
}
