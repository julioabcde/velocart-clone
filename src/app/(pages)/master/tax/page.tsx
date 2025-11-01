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
import { taxAdapter } from '@/models/Tax';
import { TaxService } from '@/services/api/TaxService';
import { Download, Plus, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

type MessageState = {
  type: MessageType;
  message: string;
};

export default function MasterTax() {
  const [data, setData] = useState<taxAdapter[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const [tax, setTax] = useState<taxAdapter | null>(null);

  // #region LANDING
  const getAllTaxParam: PaginationParam = useMemo(
    () => ({
      pagination: true,
      perPage: pageSize,
      page: page,
      query: query,
      filter: filter,
    }),
    [page, pageSize, query, filter]
  );

  const getAllTaxes = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await TaxService.getAllTaxPagination(getAllTaxParam);
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
    getAllTaxes();
  }, [getAllTaxParam]);
  // #endregion

  // #region CREATE
  const [openCreate, setOpenCreate] = useState(false);
  const [savingCreate, setSavingCreate] = useState(false);
  const [msgCreate, setMsgCreate] = useState<MessageState | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm<taxAdapter>({ shouldUnregister: true });

  const onOpenCreate = () => {
    setMsgCreate(null);
    setOpenCreate(true);
    resetCreate();
  };

  const submitCreate = async (createTaxParam: taxAdapter) => {
    setMsgCreate(null);

    try {
      setSavingCreate(true);

      const response = await TaxService.createTax(createTaxParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgCreate({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.CREATE('Tax'),
        });
      } else {
        setMsgCreate({
          type: MessageType.SUCCESS,
          message: response.message || SUCCESS_MSG.CREATE('Tax'),
        });
        await getAllTaxes();
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
  const onView = async (tax: taxAdapter) => {
    const response = await TaxService.getTaxById({ id: tax.id });
    setTax(response.data);
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
  } = useForm<taxAdapter>({ shouldUnregister: true });

  const onOpenEdit = async (tax: taxAdapter) => {
    const response = await TaxService.getTaxById({ id: tax.id });
    resetEdit(response.data);
    setMsgEdit(null);
    setOpenEdit(true);
  };

  const submitEdit = async (editTaxParam: taxAdapter) => {
    setMsgEdit(null);

    try {
      setSavingEdit(true);

      const response = await TaxService.updateTax(editTaxParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgEdit({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.UPDATE('Tax'),
        });
      } else {
        setMsgEdit({
          type: MessageType.SUCCESS,
          message: response.message || SUCCESS_MSG.UPDATE('Tax'),
        });
        await getAllTaxes();
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

  const onDelete = (tax: taxAdapter) => {
    setTax(tax);
    setMsgDelete(null);
    setOpenDelete(true);
  };

  const submitDelete = async (id: number) => {
    setMsgDelete(null);

    try {
      setDeleting(true);

      const response = await TaxService.deleteTax({ id });
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgDelete({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.DELETE('Tax'),
        });
      } else {
        setOpenDelete(false);
        await getAllTaxes();
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
            <h3 className='card-label'>Tax</h3>
          </div>
        </div>

        <div className='card-toolbar'>
          <button
            className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300'
            onClick={onOpenCreate}
          >
            <Plus />
            Add New Tax
          </button>
          <button className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300'>
            <Download />
            Excel CSV
          </button>
          <button
            className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300'
            onClick={getAllTaxes}
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
                  <th>TAX NAME</th>
                  <th>PERCENTAGE</th>
                  <th>STATUS</th>
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
                      Loading Tax…
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
                      <td className='text-center'>{item.tax_name}</td>
                      <td className='text-center'>{item.tax_percentage}%</td>
                      <td className='text-center'>
                        {String(item.status) === '1' ? (
                          <span className="badge badge--active">Active</span>
                        ) : (
                          <span className="badge badge--inactive">Inactive</span>
                        )}
                      </td>
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
        title='Create Tax'
        size='md'
        backdrop='blur'
      >
        <form onSubmit={handleSubmitCreate(submitCreate)} className='space-y-5' noValidate>
          {msgCreate && (
            <div
              className={msgCreate.type === MessageType.SUCCESS ? 'alert--success' : 'alert--error'}
            >
              {msgCreate.message}
            </div>
          )}

          <div>
            <label htmlFor='tax_name' className='form-label'>
              Tax Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='tax_name'
              className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.tax_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerCreate('tax_name', {
                required: {
                  value: true,
                  message: 'Tax name is required!',
                },
                minLength: {
                  value: 2,
                  message: 'Tax name must be at least 2 characters!',
                },
                maxLength: {
                  value: 100,
                  message: 'Maximum tax name length is 100 characters!',
                },
              })}
            />
            {errorsCreate.tax_name && (
              <p className='text-sm text-red-600'>{errorsCreate.tax_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='tax_percentage' className='form-label'>
              Tax Percentage <span className='text-red-500'>*</span>
            </label>
            <input
              type='number'
              id='tax_percentage'
              step='0.01'
              className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.tax_percentage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerCreate('tax_percentage', {
                required: {
                  value: true,
                  message: 'Tax percentage is required!',
                },
                min: {
                  value: 0,
                  message: 'Tax percentage must be at least 0!',
                },
                max: {
                  value: 100,
                  message: 'Tax percentage must be at most 100!',
                },
              })}
            />
            {errorsCreate.tax_percentage && (
              <p className='text-sm text-red-600'>{errorsCreate.tax_percentage.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='status' className='form-label'>
              Status <span className='text-red-500'>*</span>
            </label>
            <select
              id='status'
              className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.status ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerCreate('status', { required: 'Status is required!' })}
              defaultValue={1}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
            {errorsCreate.status && (
              <p className='text-sm text-red-600'>{errorsCreate.status.message}</p>
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
        title='Detail Tax'
        size='md'
        backdrop='blur'
      >
        {tax ? (
          <div className='grid grid-cols-2 gap-x-6 gap-y-3 pb-2 text-sm'>
            <div>
              <div className='text-slate-500'>Tax Name</div>
              <div className='font-medium'>{tax.tax_name}</div>
            </div>
            <div>
              <div className='text-slate-500'>Percentage</div>
              <div className='font-medium'>{tax.tax_percentage}%</div>
            </div>
            <div>
              <div className='text-slate-500'>Status</div>
              <div className='font-medium'>
                {tax.status === '1' || tax.status === '1' ? (
                  <span className="badge badge--active">Active</span>
                ) : (
                  <span className="badge badge--inactive">Inactive</span>
                )}
              </div>
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
        title='Edit Tax'
        size='md'
        backdrop='blur'
      >
        <form onSubmit={handleSubmitEdit(submitEdit)} className='space-y-5' noValidate>
          {msgEdit && (
            <div
              className={msgEdit.type === MessageType.SUCCESS ? 'alert--success' : 'alert--error'}
            >
              {msgEdit.message}
            </div>
          )}

          <div>
            <label htmlFor='tax_name' className='form-label'>
              Tax Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='tax_name'
              className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.tax_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerEdit('tax_name', {
                required: {
                  value: true,
                  message: 'Tax name is required!',
                },
                minLength: {
                  value: 2,
                  message: 'Tax name must be at least 2 characters!',
                },
                maxLength: {
                  value: 100,
                  message: 'Maximum tax name length is 100 characters!',
                },
              })}
            />
            {errorsEdit.tax_name && (
              <p className='text-sm text-red-600'>{errorsEdit.tax_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='tax_percentage' className='form-label'>
              Tax Percentage <span className='text-red-500'>*</span>
            </label>
            <input
              type='number'
              id='tax_percentage'
              step='0.01'
              className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.tax_percentage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerEdit('tax_percentage', {
                required: {
                  value: true,
                  message: 'Tax percentage is required!',
                },
                min: {
                  value: 0,
                  message: 'Tax percentage must be at least 0!',
                },
                max: {
                  value: 100,
                  message: 'Tax percentage must be at most 100!',
                },
              })}
            />
            {errorsEdit.tax_percentage && (
              <p className='text-sm text-red-600'>{errorsEdit.tax_percentage.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='status' className='form-label'>
              Status <span className='text-red-500'>*</span>
            </label>
            <select
              id='status'
              className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.status ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerEdit('status', { required: 'Status is required!' })}
              defaultValue={1}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
            {errorsEdit.status && (
              <p className='text-sm text-red-600'>{errorsEdit.status.message}</p>
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
        title='Delete Tax'
        size='sm'
        backdrop='blur'
      >
        {msgDelete && <div className='alert--error mb-3'>{msgDelete.message}</div>}
        <p className='text-sm'>
          Are you sure you want to delete the tax{' '}
          <span className='font-semibold'>{tax?.tax_name}</span>?
        </p>
        <div className='mt-4 flex justify-end gap-2'>
          <button onClick={() => setOpenDelete(false)} className='btn--soft' disabled={deleting}>
            Cancel
          </button>
          <button
            onClick={() => submitDelete(Number(tax?.id!))}
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
