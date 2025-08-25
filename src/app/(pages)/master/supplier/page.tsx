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
import { CreateEditSupplierDTO, EditSupplierDTO, Supplier } from '@/models/Supplier';
import { MessageState } from '@/models/UIModels';
import { SupplierService } from '@/services/api/SupplierService';
import { id } from 'date-fns/locale';
import { getMaxListeners } from 'events';
import { Download, Plus, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

function validateSupplierForm(f: {
  supplierName: string;
  phone?: string;
  email?: string;
  address?: string;
}) {
  if (!f.supplierName.trim()) return 'Supplier name must be filled!';
  // if (phone && (!f.password || f.password.length < 6)) return 'Password min 6 chars';
  // if (f.role === '' || Number.isNaN(f.role)) return 'Role must be a number';
  return null;
}

export default function MasterSupplier() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [data, setData] = useState<Supplier[]>([]);

  // LANDING
  const getAllSupplierParam: PaginationParam = useMemo(
    () => ({ pagination: true, perPage: pageSize, page, query: '', filter: '' }),
    [page, pageSize]
  );

  const getAllSuppliers = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await SupplierService.getAllSupplierPagination(getAllSupplierParam);
      if (res.responseCode !== ResponseCode.SUCCESS) {
        setError(true);
      } else {
        setData(res.data.data);
        setTotal(res.data.total);
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

  // CREATE SUPPLIER
  const [openCreate, setOpenCreate] = useState(false);
  const [savingCreate, setSavingCreate] = useState(false);
  const [msgCreate, setMsgCreate] = useState<MessageState | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
  } = useForm<CreateEditSupplierDTO>({ shouldUnregister: true });

  const onOpenCreate = () => {
    setMsgCreate(null);
    setOpenCreate(true);
  };

  const submitCreate = async (createSupplierParam: CreateEditSupplierDTO) => {
    setMsgCreate(null);

    try {
      setSavingCreate(true);

      const respons = await SupplierService.createSupplier(createSupplierParam);
      if (respons.responseCode !== ResponseCode.SUCCESS) {
        setMsgCreate({
          type: MessageType.ERROR,
          message: respons.message || ERROR_MSG.CREATE('Supplier'),
        });
      } else {
        setMsgCreate({
          type: MessageType.SUCCESS,
          message: respons.message || SUCCESS_MSG.CREATE('Supplier'),
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

  // VIEW SUPPLIER
  const [openView, setOpenView] = useState(false);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const onView = (supplier: Supplier) => {
    setSupplier(supplier);
    setOpenView(true);
  };

  // EDIT SUPPLIER
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
    // const res = await getAllSuppliers();

    resetEdit({
      id: supplier.id,
      supplierName: supplier.supplierName,
      phone: supplier?.phone,
      email: supplier?.email,
      address: supplier?.address,
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
          type: MessageType.ERROR,
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

  //DELETE SUPPLIER
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msgDelete, setMsgDelete] = useState<string | null>(null);

  const onDelete = (supplier: Supplier) => {
    setSupplier(supplier);
    setMsgDelete(null);
    setOpenDelete(true);
  };

  const submitDelete = async () => {
    if (!supplier?.id) return;
    setMsgDelete(null);
    try {
      setDeleting(true);
      const res = await SupplierService.deleteSupplier(supplier.id);
      if (!res || (res as any).responseCode !== '00')
        setMsgDelete((res as any)?.message || 'Failed to delete Supplier.');
      else {
        await getAllSuppliers();
        setOpenDelete(false);
      }
    } catch (error: any) {
      setMsgDelete(error?.message || 'An error occured.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className='card card-custom gutter-b'>
        <div className='card-header'>
          <div className='card-title'>
            <h3 className='card-label'>Supplier</h3>
          </div>
        </div>

        {/* Toolbar */}
        <div className='car-toolbar'>
          <button className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300' onClick={onOpenCreate}>
            <Plus />
            Add New Supplier
          </button>
          <button className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300'>
            <Download />
            Excel CSV
          </button>
          <button
            className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300' onClick={getAllSuppliers}
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

          {/* table */}
          <div className='table-responsive-scrollable'>
            <table className='table-head-custom table-vertical-center table w-full text-center'>
              <thead>
                <tr>
                  <th className='w-[240px]'>ACTION</th>
                  <th>SUPPLIER NAME</th>
                  <th>PHONE</th>
                  <th>EMAIL</th>
                  <th>ADDRESS</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {isError && (
                  <tr>
                    <td colSpan={7} className='py-4 text-center text-rose-600'>
                      Gagal memuat data.
                    </td>
                  </tr>
                )}
                {isLoading && !isError && (
                  <tr>
                    <td colSpan={7} className='py-4 text-center text-slate-500'>
                      Loading…
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
                          // onPrint={onPrint}
                        />
                      </td>
                      <td className='text-center'>{item.supplierName}</td>
                      <td className='text-center'>{item.phone}</td>
                      <td className='text-center'>{item.email}</td>
                      <td className='text-center'>{item.address}</td>
                      <td className='text-center'>{item.status}</td>
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

        {/* Create Modal */}
        <Modal
          isOpen={openCreate}
          onClose={() => setOpenCreate(false)}
          title='Create Staff'
          size='md'
          backdrop='blur'
        >
          <form onSubmit={handleSubmitCreate(submitCreate)} className='space-y-5'>
            {msgCreate && (
              <div
                className={
                  msgCreate.type === MessageType.SUCCESS ? 'alert--success' : 'alert--error'
                }
              >
                {msgCreate.message}
              </div>
            )}

            <div>
              <label htmlFor='supplierName' className='form-label'>
                Supplier Name
              </label>
              <input
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
                Supplier Phone
              </label>
              <input
                id='phone'
                className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                {...registerEdit('phone', {
                  minLength: {
                    value: 10,
                    message: 'Supplier phone must be at least 10 charaters!',
                  },
                  maxLength: {
                    value: 15,
                    message: 'Maximum supplier phone length is 15 characters!',
                  },
                })}
              />
              {errorsEdit.phone && (
                <p className='text-sm text-red-600'>{errorsEdit.phone.message}</p>
              )}
            </div>
            <div>
              <label htmlFor='email' className='form-label'>
                Supplier Email
              </label>
              <input
                id='email'
                className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                {...registerEdit('email', {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email format!',
                  },
                })}
              />
              {errorsEdit.supplierName && (
                <p className='text-sm text-red-600'>{errorsEdit.supplierName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor='staffName' className='form-label'>
                Supplier Address
              </label>
              <input
                id='address'
                className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                {...registerEdit('address', {
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

        {/* ===== Modal View ===== */}
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
                <div className='text-slate-500'>Staff Name</div>
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
        {/* ===== Modal Edit ===== */}
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
              <label htmlFor='id' className='form-label'>
                supplier ID
              </label>
              <input
                id='id'
                {...registerEdit('id')}
                disabled
                className='form-input border-gray-300 text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              />
            </div>

            <div>
              <label htmlFor='supplierName' className='form-label'>
                Supplier Name
              </label>
              <input
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
                Supplier Phone
              </label>
              <input
                id='phone'
                className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                {...registerEdit('phone', {
                  minLength: {
                    value: 10,
                    message: 'Supplier phone must be at least 10 charaters!',
                  },
                  maxLength: {
                    value: 15,
                    message: 'Maximum supplier phone length is 15 characters!',
                  },
                })}
              />
              {errorsEdit.phone && (
                <p className='text-sm text-red-600'>{errorsEdit.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor='email' className='form-label'>
                Supplier Email
              </label>
              <input
                id='email'
                className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                {...registerEdit('email', {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email format!',
                  },
                })}
              />
              {errorsEdit.supplierName && (
                <p className='text-sm text-red-600'>{errorsEdit.supplierName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor='staffName' className='form-label'>
                Supplier Address
              </label>
              <input
                id='address'
                className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                {...registerEdit('address', {
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

        {/* ===== Modal Delete ===== */}
        <Modal
          isOpen={openDelete}
          onClose={() => setOpenDelete(false)}
          title='Delete Supplier'
          size='sm'
          backdrop='blur'
        >
          {msgDelete && <div className='alert--error mb-3'>{msgDelete}</div>}
          <p className='text-sm'>
            Hapus Supplier <span className='font-semibold'>{supplier?.supplierName}</span> (ID:{' '}
            {supplier?.id})?
          </p>
          <div className='mt-4 flex justify-end gap-2'>
            <button onClick={() => setOpenDelete(false)} className='btn--soft' disabled={deleting}>
              Cancel
            </button>
            <button
              onClick={submitDelete}
              className='btn--danger btn--md btn--disabled'
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
