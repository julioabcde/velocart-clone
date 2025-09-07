// 'use client';

// import { RowActions } from '@/components/actions/actionBar';
// import ProtectedRoute from '@/components/protected-route/ProtectedRoute';
// import { MessageType, ResponseCode } from '@/enum/GlobalEnum';
// import { DropdownOption } from '@/models/GeneralDTO';
// import { ProductByProductIdDTO } from '@/models/Product';
// import { CreateStockDTO } from '@/models/Stock';
// import { MessageState } from '@/models/UIModels';
// import { MasterService } from '@/services/api/MasterService';
// import { ProductService } from '@/services/api/ProductService';
// import { StockService } from '@/services/api/StockService';
// import debounce from 'lodash.debounce';
// import { useRouter } from 'next/navigation';
// import { useCallback, useEffect, useState } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import AsyncSelect from 'react-select/async';

// export default function CreateStock() {
//   const router = useRouter();

//   const [selectedAction, setSelectedAction] = useState('');
//   const [suppliers, setSuppliers] = useState<DropdownOption[] | null>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState<number | null>();
//   const [products, setProducts] = useState<DropdownOption[] | null>([]);
//   const [selectedProduct, setSelectedProduct] = useState<string | null>();
//   const [notesLength, setNotesLength] = useState(0);
//   const [stocks, setStocks] = useState<CreateStockDTO[]>([]);

//   const today = new Date().toISOString().split('T')[0];

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [staginfCreate, setStagingCreate] = useState(false);
//   const [savingCreate, setSavingCreate] = useState(false);
//   const [msgCreate, setMsgCreate] = useState<MessageState | null>(null);

//   const {
//     register: registerCreate,
//     handleSubmit: handleSubmitCreate,
//     control: controlCreate,
//     setValue,
//     reset: resetCreate,
//     formState: { errors: errorsCreate },
//   } = useForm<CreateStockDTO>({ shouldUnregister: true });

//   const getMasterSupplier = async (search?: string) => {
//     try {
//       const response = await MasterService.getMasterSupplier(search);
//       if (response.responseCode !== ResponseCode.SUCCESS) {
//         return null;
//       } else {
//         return response.data;
//       }
//     } catch {
//       return null;
//     }
//   };

//   const getMasterProductBySupplier = async (supplierId: number, search?: string) => {
//     try {
//       const response = await MasterService.getMasterProductBySupplier(supplierId, search);
//       if (response.responseCode !== ResponseCode.SUCCESS) {
//         return null;
//       } else {
//         return response.data;
//       }
//     } catch {
//       return null;
//     }
//   };

//   const getProductById = async (productId: string) => {
//     const getProductByIdParam: ProductByProductIdDTO = {
//       productId: productId,
//     };

//     try {
//       const response = await ProductService.getProductByProductId(getProductByIdParam);
//       if (response.responseCode !== ResponseCode.SUCCESS) {
//         return null;
//       } else {
//         return response.data;
//       }
//     } catch {
//       return null;
//     }
//   };

//   const onInitialLoad = async () => {
//     const supplierList = await getMasterSupplier();
//     setSuppliers(supplierList);
//   };

//   useEffect(() => {
//     onInitialLoad();
//   }, []);

//   useEffect(() => {
//     setValue('productId', '');
//     setSelectedProduct(null);
//     if (selectedSupplier && selectedSupplier !== 0) {
//       getMasterProductBySupplier(selectedSupplier).then(setProducts);
//     }
//   }, [selectedSupplier]);

//   useEffect(() => {
//     if (selectedProduct) {
//       getProductById(selectedProduct).then((product) => {
//         setValue('currentStock', product?.currentStock ?? 0);
//       });
//     } else {
//       setValue('currentStock', 0);
//     }
//   }, [selectedProduct]);

//   const debouncedGetAllSuppliers = useCallback(
//     debounce((query: string, callback: (options: any[]) => void) => {
//       getMasterSupplier(query).then((options) => {
//         callback(options ?? []);
//       });
//     }, 500),
//     []
//   );

//   const debouncedGetAllProducts = useCallback(
//     debounce((inputValue: string, callback: (options: any[]) => void) => {
//       getMasterProductBySupplier(Number(selectedSupplier), inputValue).then((options) => {
//         callback(options ?? []);
//       });
//     }, 500),
//     [selectedSupplier]
//   );

//   const resetForm = () => {
//     resetCreate();
//     setSelectedSupplier(0);
//     setSelectedProduct(null);
//     setProducts(null);
//     setNotesLength(0);
//   };

//   const onAdd = async (stock: CreateStockDTO) => {
//     setStocks((prev) => {
//       const existing = prev.findIndex(
//         (item) =>
//           item.productId === stock.productId &&
//           item.supplierId === stock.supplierId &&
//           item.invoiceDate === stock.invoiceDate &&
//           item.receivedDate === stock.receivedDate
//       );

//       if (existing !== -1) {
//         const updated = [...prev];
//         updated[existing].newStock += Number(stock.newStock);
//         return updated;
//       }

//       return [...prev, stock];
//     });

//     resetForm();
//   };

//   const onDelete = async (stock: CreateStockDTO) => {
//     setStocks((prev) =>
//       prev.filter(
//         (item) =>
//           !(
//             item.productId === stock.productId &&
//             item.supplierId === stock.supplierId &&
//             item.invoiceDate === stock.invoiceDate &&
//             item.receivedDate === stock.receivedDate
//           )
//       )
//     );
//   };

//   const onCancel = () => {
//     router.push('/master/stock');
//   };

//   const submitCreate = async (createStockParam: CreateStockDTO) => {
//     const response = await StockService.createStock(createStockParam);
//   };

//   return (
//     <ProtectedRoute>
//       <div className='flex flex-col min-h-screen bg-slate-50 p-6 gap-6'>
//         <div className='max-w-6xl rounded-2xl bg-white p-6 shadow'>
//           <h1 className='mb-4 text-center text-xl font-bold'>Create Incoming Stock</h1>
//           <form onSubmit={handleSubmitCreate(onAdd)} className='space-y-5'>
//             {msgCreate?.type === MessageType.ERROR && (
//               <div className='alert--error'>{msgCreate.message}</div>
//             )}

//             {/* <div>
//               <label className='form-label'>Action</label>
//               <Controller
//                 name='action'
//                 control={controlCreate}
//                 render={({ field }) => (
//                   <div className='flex gap-2'>
//                     <label>
//                       <input
//                         type='radio'
//                         value='IN'
//                         checked={field.value === 'IN'}
//                         onChange={() => {
//                           field.onChange('IN');
//                           setSelectedAction('IN');
//                         }}
//                       />{' '}
//                       Incoming
//                     </label>
//                     <label>
//                       <input
//                         type='radio'
//                         value='OUT'
//                         checked={field.value === 'OUT'}
//                         onChange={() => {
//                           field.onChange('OUT');
//                           setSelectedAction('OUT');
//                         }}
//                       />{' '}
//                       Outgoing
//                     </label>
//                   </div>
//                 )}
//               />
//             </div> */}

//             <div>
//               <label htmlFor='supplierId' className='form-label'>
//                 Supplier
//               </label>
//               <Controller
//                 name='supplierId'
//                 control={controlCreate}
//                 rules={{
//                   required: {
//                     value: true,
//                     message: 'Please select a supplier!',
//                   },
//                   validate: (value) => (value === 0 ? 'Please select a supplier!' : true),
//                 }}
//                 render={({ field }) => {
//                   return (
//                     <AsyncSelect
//                       inputId='supplierId'
//                       cacheOptions
//                       defaultOptions={suppliers || []}
//                       loadOptions={debouncedGetAllSuppliers}
//                       isSearchable
//                       placeholder='Select a supplier...'
//                       styles={{
//                         control: (base, state) => ({
//                           ...base,
//                           borderWidth: '1px',
//                           borderColor: errorsCreate.supplierId ? '#dc2626' : '#d1d5db',
//                           boxShadow: state.isFocused
//                             ? errorsCreate.supplierId
//                               ? '0 0 0 1px #dc2626'
//                               : '0 0 0 1px #3b82f6'
//                             : 'none',
//                           '&:hover': {
//                             borderColor: errorsCreate.supplierId ? '#dc2626' : '#d1d5db',
//                           },
//                           borderRadius: '0.375rem',
//                         }),
//                         input: (base) => ({
//                           ...base,
//                           fontSize: '0.875rem',
//                         }),
//                         singleValue: (base) => ({
//                           ...base,
//                           fontSize: '0.875rem',
//                         }),
//                         placeholder: (base) => ({
//                           ...base,
//                           fontSize: '0.875rem',
//                           color: '#9ca3af',
//                         }),
//                         menu: (base) => ({
//                           ...base,
//                           fontSize: '0.875rem',
//                         }),
//                       }}
//                       value={suppliers?.find((opt) => opt.value === field.value) || null}
//                       onChange={(selected) => {
//                         const value = selected?.value;
//                         field.onChange(value);
//                         setSelectedSupplier(Number(value));
//                       }}
//                     />
//                   );
//                 }}
//               />
//               {errorsCreate.supplierId && (
//                 <p className='mt-1 text-sm text-red-500'>{errorsCreate.supplierId.message}</p>
//               )}
//             </div>

//             <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
//               <div>
//                 <label htmlFor='invoiceDate' className='form-label'>
//                   Invoice Date
//                 </label>
//                 <input
//                   type='date'
//                   id='invoiceDate'
//                   {...registerCreate('invoiceDate', {
//                     required: {
//                       value: true,
//                       message: 'Invoice date is required!',
//                     },
//                   })}
//                   max={today}
//                   className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.invoiceDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
//                 />
//                 {errorsCreate.invoiceDate && (
//                   <p className='mt-1 text-sm text-red-500'>{errorsCreate.invoiceDate.message}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor='receivedDate' className='form-label'>
//                   Received Date
//                 </label>
//                 <input
//                   type='date'
//                   id='receivedDate'
//                   {...registerCreate('receivedDate', {
//                     required: {
//                       value: true,
//                       message: 'Received date is required!',
//                     },
//                   })}
//                   max={today}
//                   className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.receivedDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
//                 />
//                 {errorsCreate.receivedDate && (
//                   <p className='mt-1 text-sm text-red-500'>{errorsCreate.receivedDate.message}</p>
//                 )}
//               </div>
//             </div>

//             <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
//               <div>
//                 <label htmlFor='productId' className='form-label'>
//                   Product
//                 </label>
//                 <Controller
//                   name='productId'
//                   control={controlCreate}
//                   rules={{
//                     required: {
//                       value: true,
//                       message: 'Please select a product!',
//                     },
//                   }}
//                   render={({ field }) => {
//                     return (
//                       <AsyncSelect
//                         inputId='productId'
//                         cacheOptions
//                         defaultOptions={products || []}
//                         loadOptions={debouncedGetAllProducts}
//                         noOptionsMessage={() =>
//                           !selectedSupplier || selectedSupplier === 0
//                             ? 'Please select a supplier first'
//                             : 'No products found'
//                         }
//                         isSearchable={!!selectedSupplier}
//                         placeholder='Select a product...'
//                         styles={{
//                           control: (base, state) => ({
//                             ...base,
//                             borderWidth: '1px',
//                             borderColor: errorsCreate.productId ? '#dc2626' : '#d1d5db',
//                             boxShadow: state.isFocused
//                               ? errorsCreate.productId
//                                 ? '0 0 0 1px #dc2626'
//                                 : '0 0 0 1px #3b82f6'
//                               : 'none',
//                             '&:hover': {
//                               borderColor: errorsCreate.productId ? '#dc2626' : '#d1d5db',
//                             },
//                             borderRadius: '0.375rem',
//                           }),
//                           input: (base) => ({
//                             ...base,
//                             fontSize: '0.875rem',
//                           }),
//                           singleValue: (base) => ({
//                             ...base,
//                             fontSize: '0.875rem',
//                           }),
//                           placeholder: (base) => ({
//                             ...base,
//                             fontSize: '0.875rem',
//                             color: '#9ca3af',
//                           }),
//                           menu: (base) => ({
//                             ...base,
//                             fontSize: '0.875rem',
//                           }),
//                         }}
//                         value={products?.find((opt) => opt.value === field.value) || null}
//                         onChange={(selected) => {
//                           const value = selected?.value;
//                           field.onChange(value);
//                           setSelectedProduct(value?.toString());
//                         }}
//                       />
//                     );
//                   }}
//                 />
//                 {errorsCreate.productId && (
//                   <p className='mt-1 text-sm text-red-500'>{errorsCreate.productId.message}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor='currentStock' className='form-label'>
//                   Current Stock
//                 </label>
//                 <input
//                   type='number'
//                   id='previousStock'
//                   {...registerCreate('currentStock')}
//                   disabled
//                   className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.currentStock ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
//                 />
//               </div>

//               <div>
//                 <label htmlFor='newStock' className='form-label'>
//                   New Stock
//                 </label>
//                 <input
//                   type='number'
//                   id='newStock'
//                   {...registerCreate('newStock', {
//                     required: {
//                       value: true,
//                       message: 'New product stock is required!',
//                     },
//                     validate: (value) => value > 0 || 'Base price must be greater than 0!',
//                     valueAsNumber: true,
//                   })}
//                   className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.newStock ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
//                 />
//                 {errorsCreate.newStock && (
//                   <p className='text-sm text-red-600'>{errorsCreate.newStock.message}</p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <label htmlFor='notes' className='form-label'>
//                 Notes
//               </label>
//               <textarea
//                 id='notes'
//                 {...registerCreate('notes', {
//                   onChange: (e) => setNotesLength(e.target.value.length),
//                 })}
//                 className={`form-input resize-none focus:outline-none focus:ring-1 ${errorsCreate.notes ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
//                 rows={3}
//                 maxLength={500}
//               />
//               <p className='text-sm text-gray-500'>{notesLength}/500 characters</p>
//               {errorsCreate.notes && (
//                 <p className='mt-1 text-sm text-red-500'>{errorsCreate.notes.message}</p>
//               )}
//             </div>

//             <div className='flex justify-end gap-3 pt-2'>
//               <button type='submit' className='btn--gradient btn--md'>
//                 Add
//               </button>
//               {/* <button
//                 type='submit'
//                 className='btn--gradient btn--md btn--disabled'
//                 disabled={savingCreate}
//               >
//                 {savingCreate ? 'Saving...' : 'Save'}
//               </button> */}
//               <button
//                 type='button'
//                 onClick={onCancel}
//                 className='btn--soft'
//                 disabled={savingCreate}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>

//         <div className='max-w-6xl rounded-2xl bg-white p-6 shadow'>
//           <div className='table-responsive-scrollable'>
//             <table className='table-head-custom table-vertical-center table w-full text-center'>
//               <thead>
//                 <tr>
//                   <th className='w-[120px]'>ACTION</th>
//                   <th>SUPPLIER</th>
//                   <th>PRODUCT</th>
//                   <th>INVOICE DATE</th>
//                   <th>RECEIVED DATE</th>
//                   <th>NEW STOCK</th>
//                   <th>NOTES</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {stocks.map((item, id) => (
//                   <tr key={id}>
//                     <td className='text-center'>
//                       <RowActions item={item} onDelete={onDelete} />
//                     </td>
//                     <td className='text-center'>{item.supplierId}</td>
//                     <td className='text-center'>{item.productId}</td>
//                     <td className='text-center'>{item.invoiceDate}</td>
//                     <td className='text-center'>{item.receivedDate}</td>
//                     <td className='text-center'>{item.newStock}</td>
//                     <td className='text-center'>{item.notes}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }

'use client';

import { useState } from 'react';
import IncomingStockForm from './IncomingStockForm';
import OutgoingStockForm from './OutgoingStockForm';
import ProtectedRoute from '@/components/protected-route/ProtectedRoute';
import { useRouter } from 'next/navigation';

export default function CreateStock() {
  const router = useRouter();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const onCancel = () => {
    router.push('/master/stock');
  };

  return (
    <ProtectedRoute>
      {!selectedAction ? (
        <div className='flex min-h-full items-center justify-center bg-gray-50 p-6'>
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow'>
            <h1 className='mb-6 text-center text-xl font-bold'>Select Stock Type</h1>
            <select
              className='form-input focus:outline-none focus:ring-1 border-gray-300 focus:ring-blue-500'
              onChange={(e) => setSelectedAction(e.target.value)}
              defaultValue=''
            >
              <option value='' disabled hidden>
                Select type...
              </option>
              <option value='IN'>Incoming</option>
              <option value='OUT'>Outgoing</option>
            </select>

            <div className='flex justify-center gap-3 pt-3'>
              <button type='button' onClick={onCancel} className='btn--gradient btn--md'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        // <div className='min-h-screen bg-gray-50 p-6'>
        //   <div className='mx-auto max-w-md rounded-2xl bg-white p-6 shadow'>
        //     <h1 className='mb-6 text-center text-2xl font-bold'>Select Stock Type</h1>
        //     <select
        //       className='form-input w-full'
        //       onChange={(e) => setSelectedAction(e.target.value as 'IN' | 'OUT')}
        //       defaultValue=''
        //     >
        //       <option value='' disabled>
        //         Select type...
        //       </option>
        //       <option value='IN'>Incoming</option>
        //       <option value='OUT'>Outgoing</option>
        //     </select>
        //   </div>
        // </div>
        <div className='min-h-screen bg-slate-50'>
          <div className='px-6 pt-6'>
            <button onClick={() => setSelectedAction(null)}>
              ← Change Selection
            </button>
          </div>
          {selectedAction === 'IN' ? <IncomingStockForm /> : <OutgoingStockForm />}
        </div>
      )}
    </ProtectedRoute>
  );
}
