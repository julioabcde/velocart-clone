'use client';

import { RowActions } from '@/components/actions/actionBar';
import DateRangePickerV1 from '@/components/datepicker/DateRangePicker';
import Modal from '@/components/modal/Modal';
import Pagination from '@/components/pagination/Pagination';
import ProtectedRoute from '@/components/protected-route/ProtectedRoute';
import { PAGE_SIZES } from '@/constants/GlobalConstant';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants/MessageConstant';
import { MessageType, ResponseCode } from '@/enum/GlobalEnum';
import { PaginationParam } from '@/models/GeneralDTO';
import { CreateSupplierDTO, EditSupplierDTO, Supplier, SupplierByIdDTO } from '@/models/Supplier';
import { MessageState } from '@/models/UIModels';
import { SupplierService } from '@/services/api/SupplierService';
import { Download, Plus, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function MasterSupplier() {
  const [data, setData] = useState<Supplier[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const [supplier, setSupplier] = useState<Supplier | null>(null);

  const getSupplierById = async (id: number) => {
    const getSupplierByIdParam: SupplierByIdDTO = {
      id: Number(id),
    };

    try {
      const response = await SupplierService.getSupplierById(getSupplierByIdParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        return null;
      } else {
        return response.data;
      }
    } catch {
      return null;
    }
  };

  // #region LANDING
  const getAllSupplierParam: PaginationParam = useMemo(
    () => ({
      pagination: true,
      perPage: pageSize,
      page: page,
      query: query,
      filter: filter,
    }),
    [page, pageSize, query, filter]
  );

  const getAllSuppliers = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await SupplierService.getAllSupplierPagination(getAllSupplierParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setError(true);
      } else {
        setData(response.data.data);
        setTotal(response.data.total);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSuppliers();
  }, [getAllSupplierParam]);
  // #endregion

  // #region CREATE
  const [openCreate, setOpenCreate] = useState(false);
  const [savingCreate, setSavingCreate] = useState(false);
  const [msgCreate, setMsgCreate] = useState<MessageState | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
  } = useForm<CreateSupplierDTO>({ shouldUnregister: true });

  const onOpenCreate = () => {
    setMsgCreate(null);
    setOpenCreate(true);
  };

  const submitCreate = async (createSupplierParam: CreateSupplierDTO) => {
    setMsgCreate(null);

    try {
      setSavingCreate(true);

      const response = await SupplierService.createSupplier(createSupplierParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgCreate({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.CREATE('Supplier'),
        });
      } else {
        setMsgCreate({
          type: MessageType.SUCCESS,
          message: response.message || SUCCESS_MSG.CREATE('Supplier'),
        });
        await getAllSuppliers();
        setOpenCreate(false);
      }
    } catch (error: any) {
      setMsgCreate({
        type: MessageType.ERROR,
        message: error?.message || ERROR_MSG.GENERAL,
      });
    } finally {
      setSavingCreate(false);
    }
  };
  // #endregion

  // #region VIEW
  const [openView, setOpenView] = useState(false);
  const onView = async (supplier: Supplier) => {
    const selectedSupplier = await getSupplierById(Number(supplier.id));
    setSupplier(selectedSupplier);

    setOpenView(true);
  };
  // #endregion

  // #region EDIT
  const [openEdit, setOpenEdit] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [msgEdit, setMsgEdit] = useState<MessageState | null>(null);
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<EditSupplierDTO>({ shouldUnregister: true });

  const onOpenEdit = async (supplier: Supplier) => {
    const selectedSupplier = await getSupplierById(Number(supplier.id));
    resetEdit({
      id: selectedSupplier?.id ?? 0,
      supplierName: selectedSupplier?.supplierName ?? '',
      phone: selectedSupplier?.phone ?? '',
      email: selectedSupplier?.email ?? '',
      address: selectedSupplier?.address ?? '',
    });

    setMsgEdit(null);
    setOpenEdit(true);
  };

  const submitEdit = async (editSupplierParam: EditSupplierDTO) => {
    setMsgEdit(null);

    try {
      setSavingEdit(true);

      const response = await SupplierService.updateSupplier(editSupplierParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgEdit({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.UPDATE('Supplier'),
        });
      } else {
        setMsgEdit({
          type: MessageType.SUCCESS,
          message: response.message || ERROR_MSG.UPDATE('Supplier'),
        });
        await getAllSuppliers();
        setOpenEdit(false);
      }
    } catch (error: any) {
      setMsgEdit({ type: MessageType.ERROR, message: error?.message || ERROR_MSG.GENERAL });
    } finally {
      setSavingEdit(false);
    }
  };
  // #endregion

  // #region DELETE
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msgDelete, setMsgDelete] = useState<MessageState | null>(null);

  const onDelete = (supplier: Supplier) => {
    setSupplier(supplier);
    setMsgDelete(null);
    setOpenDelete(true);
  };

  const submitDelete = async (id: number) => {
    setMsgDelete(null);

    try {
      setDeleting(true);

      const deleteSupplierParam: SupplierByIdDTO = {
        id: id,
      };

      const response = await SupplierService.deleteSupplier(deleteSupplierParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgDelete({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.DELETE('Supplier'),
        });
      } else {
        setOpenDelete(false);
        await getAllSuppliers();
      }
    } catch (e: any) {
      setMsgDelete({
        type: MessageType.ERROR,
        message: e?.message || ERROR_MSG.GENERAL,
      });
    } finally {
      setDeleting(false);
    }
  };
  // #endregion

  return (
    <ProtectedRoute>
      <div className='card card-custom gutter-b'>
        <div className='card-header'>
          <div className='card-title'>
            <h3 className='card-label'>Supplier</h3>
          </div>
        </div>

        <div className='card-toolbar'>
          <button
            className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300'
            onClick={onOpenCreate}
          >
            <Plus />
            Add New Supplier
          </button>
          <button className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300'>
            <Download />
            Excel CSV
          </button>
          <button
            className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300'
            onClick={getAllSuppliers}
            title='Refresh'
          >
            <RefreshCw />
            Refresh
          </button>
        </div>

        <div className='card-body'>
          <div className='mb-6 flex justify-between gap-4'>
            <div className='glass-card w-1/3'>
              <small className='filter-text text-xs'>
                <b>Filter</b> Tanggal
              </small>
              <DateRangePickerV1 />
            </div>

            <div className='glass-card w-1/3'>
              <small className='filter-text text-xs'>
                <b>Filter</b> Instalasi
              </small>
              <select className='filter-border2'>
                <option>Instalasi A</option>
                <option>Instalasi B</option>
              </select>
            </div>

            <div className='glass-card w-1/3'>
              <small className='filter-text text-xs'>
                <b>Kolom</b> pencarian
              </small>
              <input type='text' placeholder='Cari' className='filter-border2' />
            </div>
          </div>

          <div className='table-responsive-scrollable'>
            <table className='table-head-custom table-vertical-center table w-full text-center'>
              <thead>
                <tr>
                  <th className='w-[240px]'>ACTION</th>
                  <th>SUPPLIER NAME</th>
                  <th>PHONE</th>
                  <th>EMAIL</th>
                  <th>ADDRESS</th>
                </tr>
              </thead>
              <tbody>
                {isError && (
                  <tr>
                    <td colSpan={7} className='py-4 text-center text-rose-600'>
                      Fail to load data.
                    </td>
                  </tr>
                )}
                {isLoading && !isError && (
                  <tr>
                    <td colSpan={7} className='py-4 text-center text-slate-500'>
                      Loading Supplier…
                    </td>
                  </tr>
                )}
                {!isLoading && !isError && data.length === 0 && (
                  <tr>
                    <td colSpan={7} className='py-4 text-center text-gray-500'>
                      No data to display
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  !isError &&
                  data.map((item) => (
                    <tr key={item.id}>
                      <td className='text-center'>
                        <RowActions
                          item={item}
                          onView={onView}
                          onEdit={onOpenEdit}
                          onDelete={onDelete}
                        />
                      </td>
                      <td className='text-center'>{item.supplierName}</td>
                      <td className='text-center'>{item.phone}</td>
                      <td className='text-center'>{item.email}</td>
                      <td className='text-center'>{item.address}</td>
                    </tr>
                  ))}
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
            showFirstLast
          />
        </div>
      </div>

      {/* Modal Create */}
      <Modal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        title='Create Supplier'
        size='md'
        backdrop='blur'
      >
        <form onSubmit={handleSubmitCreate(submitCreate)} className='space-y-5'>
          {msgCreate && (
            <div
              className={msgCreate.type === MessageType.SUCCESS ? 'alert--success' : 'alert--error'}
            >
              {msgCreate.message}
            </div>
          )}

          <div>
            <label htmlFor='supplierName' className='form-label'>
              Supplier Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='supplierName'
              className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.supplierName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerCreate('supplierName', {
                required: {
                  value: true,
                  message: 'Supplier name is required!',
                },
                minLength: {
                  value: 3,
                  message: 'Supplier name must be at least 3 charaters!',
                },
                maxLength: {
                  value: 100,
                  message: 'Maximum supplier name length is 100 characters!',
                },
              })}
            />
            {errorsCreate.supplierName && (
              <p className='text-sm text-red-600'>{errorsCreate.supplierName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='phone' className='form-label'>
              Phone Number
            </label>
            <input
              type='text'
              id='phone'
              className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerCreate('phone', {
                maxLength: {
                  value: 15,
                  message: 'Maximum phone number length is 15 characters!',
                },
                pattern: {
                  value: /^\+?[0-9]{1,15}$/,
                  message: 'Phone number must contain only digits and may start with +',
                },
              })}
            />
            {errorsCreate.phone && (
              <p className='text-sm text-red-600'>{errorsCreate.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='email' className='form-label'>
              Email
            </label>
            <input
              type='email'
              id='email'
              className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerCreate('email', {
                maxLength: {
                  value: 50,
                  message: 'Maximum email length is 50 characters!',
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Email is invalid!',
                },
              })}
            />
            {errorsCreate.email && (
              <p className='text-sm text-red-600'>{errorsCreate.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='address' className='form-label'>
              Address
            </label>
            <input
              type='text'
              id='address'
              className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerCreate('address', {
                maxLength: {
                  value: 200,
                  message: 'Maximum address length is 200 characters!',
                },
              })}
            />
            {errorsCreate.address && (
              <p className='text-sm text-red-600'>{errorsCreate.address.message}</p>
            )}
          </div>

          <div className='modal-actions'>
            <button
              type='submit'
              disabled={savingCreate}
              className='btn--gradient btn--md btn--disabled'
            >
              {savingCreate ? 'Saving…' : 'Save'}
            </button>
            <button
              type='button'
              onClick={() => setOpenCreate(false)}
              className='btn--soft'
              disabled={savingCreate}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal View */}
      <Modal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title='Detail Supplier'
        size='md'
        backdrop='blur'
      >
        {supplier ? (
          <div className='grid grid-cols-2 gap-x-6 gap-y-3 pb-2 text-sm'>
            <div>
              <div className='text-slate-500'>Supplier Name</div>
              <div className='font-medium'>{supplier.supplierName}</div>
            </div>
            <div>
              <div className='text-slate-500'>Phone</div>
              <div className='font-medium'>{supplier.phone}</div>
            </div>
            <div>
              <div className='text-slate-500'>Email</div>
              <div className='font-medium'>{supplier.email}</div>
            </div>
            <div>
              <div className='text-slate-500'>Address</div>
              <div className='font-medium'>{supplier.address}</div>
            </div>
          </div>
        ) : (
          <div className='text-sm text-slate-500'>No data found!</div>
        )}

        <div className='modal-actions'>
          <button
            type='button'
            onClick={() => setOpenView(false)}
            className='btn--gradient btn--md'
            disabled={savingCreate}
          >
            OK
          </button>
        </div>
      </Modal>

      {/* Modal Edit */}
      <Modal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        title='Edit Supplier'
        size='md'
        backdrop='blur'
      >
        <form onSubmit={handleSubmitEdit(submitEdit)} className='space-y-5'>
          {msgEdit && (
            <div
              className={msgEdit.type === MessageType.SUCCESS ? 'alert--success' : 'alert--error'}
            >
              {msgEdit.message}
            </div>
          )}

          <div>
            <label htmlFor='supplierName' className='form-label'>
              Supplier Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='supplierName'
              className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.supplierName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerEdit('supplierName', {
                required: {
                  value: true,
                  message: 'Supplier name is required!',
                },
                minLength: {
                  value: 3,
                  message: 'Supplier name must be at least 3 charaters!',
                },
                maxLength: {
                  value: 100,
                  message: 'Maximum supplier name length is 100 characters!',
                },
              })}
            />
            {errorsEdit.supplierName && (
              <p className='text-sm text-red-600'>{errorsEdit.supplierName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='phone' className='form-label'>
              Phone Number
            </label>
            <input
              type='text'
              id='phone'
              className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerEdit('phone', {
                maxLength: {
                  value: 15,
                  message: 'Maximum phone number length is 15 characters!',
                },
                pattern: {
                  value: /^\+?[0-9]{1,15}$/,
                  message: 'Phone number must contain only digits and may start with +',
                },
              })}
            />
            {errorsEdit.phone && <p className='text-sm text-red-600'>{errorsEdit.phone.message}</p>}
          </div>

          <div>
            <label htmlFor='email' className='form-label'>
              Email
            </label>
            <input
              type='email'
              id='email'
              className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerEdit('email', {
                maxLength: {
                  value: 50,
                  message: 'Maximum email length is 50 characters!',
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Email is invalid!',
                },
              })}
            />
            {errorsEdit.email && <p className='text-sm text-red-600'>{errorsEdit.email.message}</p>}
          </div>

          <div>
            <label htmlFor='address' className='form-label'>
              Address
            </label>
            <input
              type='text'
              id='address'
              className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerEdit('address', {
                maxLength: {
                  value: 200,
                  message: 'Maximum address length is 200 characters!',
                },
              })}
            />
            {errorsEdit.address && (
              <p className='text-sm text-red-600'>{errorsEdit.address.message}</p>
            )}
          </div>

          <div className='modal-actions'>
            <button
              type='submit'
              disabled={savingEdit}
              className='btn--gradient btn--md btn--disabled'
            >
              {savingEdit ? 'Saving…' : 'Save'}
            </button>
            <button
              type='button'
              onClick={() => setOpenEdit(false)}
              className='btn--soft'
              disabled={savingEdit}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Delete */}
      <Modal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title='Delete Supplier'
        size='sm'
        backdrop='blur'
      >
        {msgDelete && <div className='alert--error mb-3'>{msgDelete.message}</div>}
        <p className='text-sm'>
          Are you sure you want to delete the supplier{' '}
          <span className='font-semibold'>{supplier?.supplierName}</span>?
        </p>
        <div className='mt-4 flex justify-end gap-2'>
          <button onClick={() => setOpenDelete(false)} className='btn--soft' disabled={deleting}>
            Cancel
          </button>
          <button
            onClick={() => submitDelete(Number(supplier?.id!))}
            className='btn--danger btn--md btn--disabled'
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </Modal>
    </ProtectedRoute>
  );
}
