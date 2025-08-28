'use client';

import { RowActions } from '@/components/actions/actionBar';
import DateRangePickerV1 from '@/components/datepicker/DateRangePicker';
import Modal from '@/components/modal/Modal';
import Pagination from '@/components/pagination/Pagination';
import ProtectedRoute from '@/components/protected-route/ProtectedRoute';
import { PAGE_SIZES } from '@/constants/GlobalConstant';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants/MessageConstant';
import { MessageType, ResponseCode } from '@/enum/GlobalEnum';
import { Category, CategoryByIdDTO, CreateCategoryDTO, EditCategoryDTO } from '@/models/Category';
import { PaginationParam } from '@/models/GeneralDTO';
import { MessageState } from '@/models/UIModels';
import { CategoryService } from '@/services/api/CategoryService';
import { Download, Plus, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function MasterCategory() {
  const [data, setData] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const [category, setCategory] = useState<Category | null>(null);

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

  // #region LANDING
  const getAllCategoriesParam: PaginationParam = useMemo(
    () => ({
      pagination: true,
      perPage: pageSize,
      page: page,
      query: query,
      filter: filter,
    }),
    [page, pageSize, query, filter]
  );

  const getAllCategories = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await CategoryService.getAllCategoriesPagination(getAllCategoriesParam);
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
    getAllCategories();
  }, [getAllCategoriesParam]);
  // #endregion

  // #region CREATE
  const [openCreate, setOpenCreate] = useState(false);
  const [savingCreate, setSavingCreate] = useState(false);
  const [msgCreate, setMsgCreate] = useState<MessageState | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
  } = useForm<CreateCategoryDTO>({ shouldUnregister: true });

  const onCreate = async () => {
    setMsgCreate(null);
    setOpenCreate(true);
  };

  const submitCreate = async (createCategoryParam: CreateCategoryDTO) => {
    setMsgCreate(null);

    try {
      setSavingCreate(true);

      const response = await CategoryService.createCategory(createCategoryParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgCreate({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.CREATE('Category'),
        });
      } else {
        setMsgCreate({
          type: MessageType.SUCCESS,
          message: response.message || SUCCESS_MSG.CREATE('Category'),
        });
        await getAllCategories();
        setOpenCreate(false);
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
  // #endregion

  // #region VIEW
  const [openView, setOpenView] = useState(false);

  const onView = async (category: Category) => {
    const selectedCategory = await getCategoryById(Number(category.id));
    setCategory(selectedCategory);

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
  } = useForm<EditCategoryDTO>({ shouldUnregister: true });

  const onEdit = async (category: Category) => {
    const selectedCategory = await getCategoryById(Number(category.id));
    resetEdit({
      id: Number(selectedCategory?.id) ?? 0,
      categoryName: selectedCategory?.categoryName ?? '',
    });

    setMsgEdit(null);
    setOpenEdit(true);
  };

  const submitEdit = async (editCategoryParam: EditCategoryDTO) => {
    setMsgEdit(null);

    try {
      setSavingEdit(true);

      const response = await CategoryService.updateCategory(editCategoryParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgEdit({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.UPDATE('Category'),
        });
      } else {
        setMsgEdit({
          type: MessageType.SUCCESS,
          message: response.message || SUCCESS_MSG.UPDATE('Category'),
        });
        await getAllCategories();
        setOpenEdit(false);
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
  // #endregion

  // #region DELETE
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msgDelete, setMsgDelete] = useState<MessageState | null>(null);

  const onDelete = async (category: Category) => {
    setCategory(category);
    setMsgDelete(null);
    setOpenDelete(true);
  };

  const submitDelete = async (id: number) => {
    setMsgDelete(null);

    try {
      setDeleting(true);

      const deleteCategoryParam: CategoryByIdDTO = {
        id: id,
      };

      const response = await CategoryService.deleteCategory(deleteCategoryParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgDelete({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.DELETE('Category'),
        });
      } else {
        setOpenDelete(false);
        await getAllCategories();
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
            <h3 className='card-label'>Category</h3>
          </div>
        </div>

        {/* Toolbar */}
        <div className='card-toolbar'>
          <button className='btn--soft' onClick={onCreate}>
            <Plus />
            Add New Category
          </button>
          <button className='btn--soft'>
            <Download />
            Excel CSV
          </button>
          <button className='btn--soft' onClick={getAllCategories} title='Refresh'>
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
                  <th>CATEGORY</th>
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
                      Loading Category…
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
                          onEdit={onEdit}
                          onDelete={onDelete}
                          disableEdit={(item) => item.id === 1}
                          disableDelete={(item) => item.id === 1}
                        />
                      </td>
                      <td className='text-center'>{item.categoryName}</td>
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
        title='Create Category'
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
            <label htmlFor='categoryName' className='form-label'>
              Category Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='categoryName'
              className={`form-input focus:outline-none focus:ring-1 ${errorsCreate.categoryName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerCreate('categoryName', {
                required: {
                  value: true,
                  message: 'Category name is required!',
                },
                minLength: {
                  value: 3,
                  message: 'Category name must be at least 3 characters!',
                },
                maxLength: {
                  value: 100,
                  message: 'Maximum category name length is 100 characters!',
                },
              })}
            />
            {errorsCreate.categoryName && (
              <p className='text-sm text-red-600'>{errorsCreate.categoryName.message}</p>
            )}
          </div>

          <div className='modal-actions'>
            <button
              type='submit'
              className='btn--gradient btn--md btn--disabled'
              disabled={savingCreate}
            >
              {savingCreate ? 'Saving...' : 'Save'}
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
        title='Detail Category'
        size='md'
        backdrop='blur'
      >
        {category ? (
          <div className='grid grid-cols-2 gap-x-6 gap-y-3 pb-2 text-sm'>
            <div>
              <div className='text-slate-500'>ID</div>
              <div className='font-medium'>{category.id}</div>
            </div>
            <div>
              <div className='text-slate-500'>Category</div>
              <div className='font-medium'>{category.categoryName}</div>
            </div>
          </div>
        ) : (
          <div className='text-sm text-slate-500'>Category not found!</div>
        )}

        <div className='modal-actions'>
          <button
            type='button'
            onClick={() => setOpenView(false)}
            className='btn--gradient btn--md'
          >
            OK
          </button>
        </div>
      </Modal>

      {/* Modal Edit */}
      <Modal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        title='Edit Category'
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
            <label htmlFor='categoryName' className='form-label'>
              Category Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='categoryName'
              className={`form-input focus:outline-none focus:ring-1 ${errorsEdit.categoryName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...registerEdit('categoryName', {
                required: {
                  value: true,
                  message: 'Category name is required!',
                },
                minLength: {
                  value: 3,
                  message: 'Category name must be at least 3 characters!',
                },
                maxLength: {
                  value: 100,
                  message: 'Maximum category name length is 100 characters!',
                },
              })}
            />
            {errorsEdit.categoryName && (
              <p className='text-sm text-red-600'>{errorsEdit.categoryName.message}</p>
            )}
          </div>

          <div className='modal-actions'>
            <button
              type='submit'
              className='btn--gradient btn--md btn--disabled'
              disabled={savingEdit}
            >
              {savingEdit ? 'Saving...' : 'Save'}
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
        title='Delete Category'
        size='sm'
        backdrop='blur'
      >
        {msgDelete && <div className='alert--error mb-3'>{msgDelete.message}</div>}
        <p className='text-sm'>
          Are you sure you want to delete{' '}
          <span className='font-semibold'>{category?.categoryName}</span>
        </p>
        <div className='mt-4 flex justify-end gap-2'>
          <button onClick={() => setOpenDelete(false)} className='btn--soft' disabled={deleting}>
            Cancel
          </button>
          <button
            onClick={() => submitDelete(Number(category?.id!))}
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
