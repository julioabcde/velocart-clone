'use client';

import { RowActions } from '@/components/actions/actionBar';
import DateRangePickerV1 from '@/components/datepicker/DateRangePicker';
import Pagination from '@/components/pagination/Pagination';
import ProtectedRoute from '@/components/protected-route/ProtectedRoute';
import Modal from '@/components/modal/Modal';
import { PAGE_SIZES } from '@/constants/GlobalConstant';
import { DropdownOptions, PaginationParam } from '@/models/GeneralDTO';
import { CreateStaffDTO, EditStaffDTO, Staff } from '@/models/Staff';
import { StaffService } from '@/services/api/StaffService';
import { useEffect, useMemo, useState } from 'react';
import { Download, Plus, RefreshCw } from 'lucide-react';
import { MasterService } from '@/services/api/MasterService';
import { useForm } from 'react-hook-form';
import { MessageState } from '@/models/UIModels';
import { MessageType, ResponseCode } from '@/enum/GlobalEnum';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants/MessageConstant';

export default function MasterStaff() {
  const [data, setData] = useState<Staff[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const [roles, setRoles] = useState<DropdownOptions[] | null>([]);

  const getMasterRole = async (search?: string) => {
    try {
      const response = await MasterService.getMasterRole('');
      if (response.responseCode !== ResponseCode.SUCCESS) {
        console.log('error: ', response.message);
        return null;
      } else {
        return response.data;
      }
    } catch (e: any) {
      return null;
    }
  };

  // #region LANDING
  const getAllStaffsParam: PaginationParam = useMemo(
    () => ({ pagination: true, perPage: pageSize, page: page, query: query, filter: filter }),
    [page, pageSize, query, filter]
  );

  const getAllStaffs = async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await StaffService.getAllStaffsPagination(getAllStaffsParam);
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
    getAllStaffs();
  }, [getAllStaffsParam]);
  // #endregion

  // #region CREATE
  const [openCreate, setOpenCreate] = useState(false);
  const [savingCreate, setSavingCreate] = useState(false);
  const [msgCreate, setMsgCreate] = useState<MessageState | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
  } = useForm<CreateStaffDTO>({ shouldUnregister: true });

  const onOpenCreate = async () => {
    const roleList = await getMasterRole('');
    setRoles(roleList);

    setMsgCreate(null);
    setOpenCreate(true);
  };

  const submitCreate = async (createStaffParam: CreateStaffDTO) => {
    setMsgCreate(null);

    try {
      setSavingCreate(true);

      const response = await StaffService.createStaff(createStaffParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgCreate({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.CREATE('Staff'),
        });
      } else {
        setMsgCreate({
          type: MessageType.SUCCESS,
          message: response.message || SUCCESS_MSG.CREATE('Staff'),
        });
        await getAllStaffs();
        setOpenCreate(false);
      }
    } catch (e: any) {
      setMsgCreate({ type: MessageType.ERROR, message: e?.message || ERROR_MSG.GENERAL });
    } finally {
      setSavingCreate(false);
    }
  };
  // #endregion

  // #region VIEW
  const [openView, setOpenView] = useState(false);
  const [staff, setStaff] = useState<Staff | null>(null);

  const onOpenView = (staff: Staff) => {
    setRoles([]);
    setStaff(staff);
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
  } = useForm<EditStaffDTO>({ shouldUnregister: true });

  const onOpenEdit = async (staff: Staff) => {
    const roleList = await getMasterRole('');
    setRoles(roleList);

    const selectedRole = await getMasterRole(staff.roleName);
    resetEdit({
      staffId: staff.staffId,
      staffName: staff.staffName ?? '',
      role: selectedRole ? Number(selectedRole[0].value) : 0,
    });

    setMsgEdit(null);
    setOpenEdit(true);
  };

  const submitEdit = async (editStaffParam: EditStaffDTO) => {
    setMsgEdit(null);

    try {
      setSavingEdit(true);

      const response = await StaffService.updateStaff(editStaffParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgEdit({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.UPDATE('Staff'),
        });
      } else {
        setMsgEdit({
          type: MessageType.SUCCESS,
          message: response.message || SUCCESS_MSG.UPDATE('Staff'),
        });
        await getAllStaffs();
        setOpenEdit(false);
      }
    } catch (e: any) {
      setMsgEdit({ type: MessageType.ERROR, message: e?.message || ERROR_MSG.GENERAL });
    } finally {
      setSavingEdit(false);
    }
  };
  // #endregion

  // #region DELETE
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msgDelete, setMsgDelete] = useState<string | null>(null);

  const onDelete = (staff: Staff) => {
    setStaff(staff);
    setMsgDelete(null);
    setOpenDelete(true);
  };

  const submitDelete = async () => {
    if (!staff?.staffId) return;
    setMsgDelete(null);
    try {
      setDeleting(true);
      const res = await StaffService.deleteStaff(String(staff.staffId));
      if (!res || (res as any).responseCode !== '00')
        setMsgDelete((res as any)?.message || 'Gagal menghapus staff.');
      else {
        await getAllStaffs();
        setOpenDelete(false);
      }
    } catch (e: any) {
      setMsgDelete(e?.message || 'Terjadi kesalahan saat menghapus.');
    } finally {
      setDeleting(false);
    }
  };
  // #endregion

  // #region PRINT
  const onPrint = () => window.print();
  // #endregion

  return (
    <ProtectedRoute>
      <div className='card card-custom gutter-b'>
        <div className='card-header'>
          <div className='card-title'>
            <h3 className='card-label'>Staff</h3>
          </div>
        </div>

        {/* Toolbar */}
        <div className='card-toolbar'>
          <button className='btn--soft' onClick={onOpenCreate}>
            <Plus />
            Add New Staff
          </button>
          <button className='btn--soft'>
            <Download />
            Excel CSV
          </button>
          <button className='btn--soft' onClick={getAllStaffs} title='Refresh'>
            <RefreshCw />
            Refresh
          </button>
        </div>

        <div className='card-body'>
          {/* filters */}
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
                  <th>STAFF ID</th>
                  <th>STAFF NAME</th>
                  <th>ROLE</th>
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
                      Loading Staff…
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
                          onView={onOpenView}
                          onEdit={onOpenEdit}
                          onDelete={onDelete}
                          onPrint={onPrint}
                        />
                      </td>
                      <td className='text-center'>{item.staffId}</td>
                      <td className='text-center'>{item.staffName}</td>
                      <td className='text-center'>{item.roleName}</td>
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
      </div>

      {/* ===== Modal Create ===== */}
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
              className={msgCreate.type === MessageType.SUCCESS ? 'alert--success' : 'alert--error'}
            >
              {msgCreate.message}
            </div>
          )}

          <div>
            <label htmlFor='staffName' className='form-label'>
              Staff Name
            </label>
            <input
              id='staffName'
              className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.staffName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerCreate('staffName', {
                required: {
                  value: true,
                  message: 'Staff name is required!',
                },
                minLength: {
                  value: 3,
                  message: 'Staff name must be at least 3 charaters!',
                },
                maxLength: {
                  value: 100,
                  message: 'Maximum staff name length is 100 characters!',
                },
              })}
            />
            {errorsCreate.staffName && (
              <p className='text-sm text-red-600'>{errorsCreate.staffName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <input
              id='password'
              type='password'
              className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerCreate('password', {
                required: {
                  value: true,
                  message: 'Password is required!',
                },
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters!',
                },
                maxLength: {
                  value: 16,
                  message: 'Maximum password length is 16 characters!',
                },
              })}
            />
            {errorsCreate.password && (
              <p className='text-sm text-red-600'>{errorsCreate.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='role' className='form-label'>
              Role
            </label>
            <select
              id='role'
              className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.role ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerCreate('role', {
                required: {
                  value: true,
                  message: 'Please select a role!',
                },
                validate: (value) => value !== 0 || 'Please select a role!',
                valueAsNumber: true,
              })}
              defaultValue={0}
            >
              <option value={0} disabled hidden>
                Select a role
              </option>
              {roles?.map((role: DropdownOptions) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errorsCreate.role && (
              <p className='text-sm text-red-600'>{errorsCreate.role.message}</p>
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
        title='Detail Staff'
        size='md'
        backdrop='blur'
      >
        {staff ? (
          <div className='grid grid-cols-2 gap-x-6 gap-y-3 pb-2 text-sm'>
            <div>
              <div className='text-slate-500'>Staff ID</div>
              <div className='font-medium'>{staff.staffId}</div>
            </div>
            <div>
              <div className='text-slate-500'>Staff Name</div>
              <div className='font-medium'>{staff.staffName}</div>
            </div>
            <div>
              <div className='text-slate-500'>Role</div>
              <div className='font-medium'>{staff.roleName}</div>
            </div>
            <div>
              <div className='text-slate-500'>Status</div>
              <div className='font-medium'>{staff.status}</div>
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
        title='Edit Staff'
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
            <label htmlFor='staffId' className='form-label'>
              Staff ID
            </label>
            <input
              id='staffId'
              {...registerEdit('staffId')}
              disabled
              className='form-input focus:outline-none focus:ring-1 border-gray-300 focus:ring-blue-500 text-gray-500'
            />
          </div>

          <div>
            <label htmlFor='staffName' className='form-label'>
              Staff Name
            </label>
            <input
              id='staffName'
              className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.staffName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerEdit('staffName', {
                required: {
                  value: true,
                  message: 'Staff name is required!',
                },
                minLength: {
                  value: 3,
                  message: 'Staff name must be at least 3 charaters!',
                },
                maxLength: {
                  value: 100,
                  message: 'Maximum staff name length is 100 characters!',
                },
              })}
            />
            {errorsEdit.staffName && (
              <p className='text-sm text-red-600'>{errorsEdit.staffName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='role' className='form-label'>
              Role
            </label>
            <select
              id='role'
              className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.role ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerEdit('role', {
                required: {
                  value: true,
                  message: 'Please select a role!',
                },
                validate: (value) => value !== 0 || 'Please select a role!',
                valueAsNumber: true,
              })}
              defaultValue={0}
            >
              <option value={0} disabled hidden>
                Select a role
              </option>
              {roles?.map((role: DropdownOptions) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errorsEdit.role && (
              <p className='text-sm text-red-600'>{errorsEdit.role.message}</p>
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
        title='Delete Staff'
        size='sm'
        backdrop='blur'
      >
        {msgDelete && <div className='alert--error mb-3'>{msgDelete}</div>}
        <p className='text-sm'>
          Hapus staff <span className='font-semibold'>{staff?.staffName}</span> (ID:{' '}
          {staff?.staffId})?
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
    </ProtectedRoute>
  );
}
