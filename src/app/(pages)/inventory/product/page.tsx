'use client';

import DateRangePickerV1 from '@/components/datepicker/DateRangePicker';
import { PaginationParam } from '@/models/GeneralDTO';
import { ProductByProductIdDTO, Product } from '@/models/Product';
import { useEffect, useMemo, useState } from 'react';
import Pagination from '@/components/pagination/Pagination';
import { PAGE_SIZES } from '@/constants/GlobalConstant';
import { useRouter } from 'next/navigation';
import { ProductService } from '@/services/api/ProductService';
import { FormatterService } from '@/services/ui/FormatterService';
import ProtectedRoute from '@/components/protected-route/ProtectedRoute';
import Modal from '@/components/modal/Modal';
import { RowActions } from '@/components/actions/actionBar';
import { MessageType, ResponseCode } from '@/enum/GlobalEnum';
import { MessageState } from '@/models/UIModels';
import { ERROR_MSG } from '@/constants/MessageConstant';
import { Download, Plus, RefreshCw } from 'lucide-react';

export default function MasterProduct() {
  const router = useRouter();

  const [data, setData] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');

  const [product, setProduct] = useState<Product | null>(null);

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  // #region LANDING
  const getAllProductsParam: PaginationParam = useMemo(
    () => ({
      pagination: true,
      perPage: pageSize,
      page: page,
      query: query,
      filter: filter,
    }),
    [page, pageSize, query, filter]
  );

  const getAllProducts = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await ProductService.getAllProductsPagination(getAllProductsParam);
      if (response.responseCode != '00') {
        setError(true);
      } else {
        setData(response.data.data);
        setTotal(response.data.total);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [getAllProductsParam]);
  // #endregion

  // #region CREATE
  const onCreate = () => {
    router.push('/inventory/product/create');
  };
  // #endregion

  // #region VIEW
  const [openView, setOpenView] = useState(false);

  const getProductByProductId = async (productId: string) => {
    const getProductByProductIdParam: ProductByProductIdDTO = {
      productId: productId,
    };

    try {
      const response = await ProductService.getProductByProductId(getProductByProductIdParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        return null;
      } else {
        return response.data;
      }
    } catch {
      return null;
    }
  };

  const onView = async (product: Product) => {
    const selectedProduct = await getProductByProductId(product.productId);
    setProduct(selectedProduct);

    setOpenView(true);
  };
  // #endregion

  // #region EDIT
  const onEdit = (product: Product) => {
    router.push(`/inventory/product/${product.productId}`);
  };
  // #endregion

  // #region DELETE
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msgDelete, setMsgDelete] = useState<MessageState | null>(null);

  const onDelete = (product: Product) => {
    setProduct(product);
    setMsgDelete(null);
    setOpenDelete(true);
  };

  const submitDelete = async (productId: string) => {
    setMsgDelete(null);

    try {
      setDeleting(true);

      const deleteProductParam: ProductByProductIdDTO = {
        productId: productId,
      };

      const response = await ProductService.deleteProduct(deleteProductParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        setMsgDelete({
          type: MessageType.ERROR,
          message: response.message || ERROR_MSG.DELETE('Product'),
        });
      } else {
        setOpenDelete(false);
        await getAllProducts();
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
            <h3 className='card-label'>Product</h3>
          </div>
        </div>

        {/* Toolbar */}
        <div className='card-toolbar'>
          <button className='btn--soft' onClick={onCreate}>
            <Plus />
            Add New Product
          </button>
          <button className='btn--soft'>
            <Download />
            Excel CSV
          </button>
          <button className='btn--soft' onClick={getAllProducts} title='Refresh'>
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
                  <th className='text-center'>PRODUCT ID</th>
                  <th className='text-center'>CATEGORY</th>
                  <th className='text-center'>PRODUCT NAME</th>
                  <th className='text-center'>STOCK</th>
                  <th className='text-center'>UNIT</th>
                  <th className='text-center'>SELLING PRICE</th>
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
                      Loading Product...
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
                    <tr key={item.productId}>
                      <td>
                        <RowActions
                          item={item}
                          onView={onView}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      </td>
                      <td className='text-center'>{item.productId}</td>
                      <td className='max-w-[70px] truncate text-center'>{item.categoryName}</td>
                      <td className='max-w-[200px] truncate text-center'>{item.productName}</td>
                      <td className='max-w-[200px] truncate text-center'>{FormatterService.formatStock(item.stock)}</td>
                      <td className='max-w-[200px] truncate text-center'>{item.unit}</td>
                      <td className='text-center'>
                        {FormatterService.formatRupiah(item.sellingPrice)}
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
            showFirstLast={true}
          />
        </div>
      </div>

      {/* Modal View */}
      <Modal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title='Detail Product'
        size='md'
        backdrop='blur'
      >
        {product ? (
          <div className='grid grid-cols-2 gap-x-6 gap-y-3 pb-2 text-sm'>
            <div>
              <div className='text-slate-500'>Product ID</div>
              <div className='font-medium'>{product.productId}</div>
            </div>
            <div>
              <div className='text-slate-500'>Product Name</div>
              <div className='font-medium'>{product.productName}</div>
            </div>
            <div>
              <div className='text-slate-500'>Category</div>
              <div className='font-medium'>{product.categoryName}</div>
            </div>
            <div>
              <div className='text-slate-500'>Stock</div>
              <div className='font-medium'>{FormatterService.formatStock(product.stock)}</div>
            </div>
            <div>
              <div className='text-slate-500'>Unit</div>
              <div className='font-medium'>{product.unit}</div>
            </div>
            <div>
              <div className='text-slate-500'>Base Price</div>
              <div className='font-medium'>{FormatterService.formatRupiah(product.basePrice)}</div>
            </div>
            <div>
              <div className='text-slate-500'>Selling Price</div>
              <div className='font-medium'>
                {FormatterService.formatRupiah(product.sellingPrice)}
              </div>
            </div>

            <div className='col-span-2'>
              <div className='mb-1 text-slate-500'>Suppliers</div>
              <div className='flex flex-wrap gap-2'>
                {product.suppliers && product.suppliers.length > 0 ? (
                  product.suppliers.map((s: any) => (
                    <span
                      key={s.value}
                      className='rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600'
                    >
                      {s.label}
                    </span>
                  ))
                ) : (
                  <span className='text-slate-400'>-</span>
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
          >
            OK
          </button>
        </div>
      </Modal>

      {/* Modal Delete */}
      <Modal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title='Delete Product'
        size='sm'
        backdrop='blur'
      >
        {msgDelete && <div className='alert--error mb-3'>{msgDelete.message}</div>}
        <p className='text-sm'>
          Are you sure you want to delete{' '}
          <span className='font-semibold'>{product?.productName}</span> (ID:{' '}
          <span className='font-semibold'>{product?.productId}</span>)?
        </p>

        <div className='modal-actions'>
          <button onClick={() => setOpenDelete(false)} className='btn--soft' disabled={deleting}>
            Cancel
          </button>
          <button
            onClick={() => submitDelete(product?.productId!)}
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
