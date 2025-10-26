'use client';

import { RowActions } from '@/components/actions/actionBar';
import DateRangePickerV1 from '@/components/datepicker/DateRangePicker';
import Modal from '@/components/modal/Modal';
import Pagination from '@/components/pagination/Pagination';
import ProtectedRoute from '@/components/protected-route/ProtectedRoute';
import { PAGE_SIZES } from '@/constants/GlobalConstant';
import { ResponseCode, StockMovement } from '@/enum/GlobalEnum';
import { PaginationParam } from '@/models/GeneralDTO';
import { Stock, StockByIdDTO } from '@/models/Stock';
import { StockService } from '@/services/api/StockService';
import { GeneralService } from '@/services/GeneralService';
import { FormatterService } from '@/services/ui/FormatterService';
import axios from 'axios';
import {
  ArrowDownCircle,
  ArrowDownUp,
  ArrowUpCircle,
  CircleSlash,
  Download,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function MasterStock() {
  const router = useRouter();

  const [data, setData] = useState<Stock[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');

  const [stock, setStock] = useState<Stock | null>(null);

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  // #region LANDING
  const getAllStocksParam: PaginationParam = useMemo(
    () => ({
      pagination: true,
      perPage: pageSize,
      page: page,
      query: query,
      filter: filter,
    }),
    [page, pageSize, query, filter]
  );

  const getAllStocks = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await StockService.getAllStocksPagination(getAllStocksParam);
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
    getAllStocks();
  }, [getAllStocksParam]);
  // #endregion

  // #region CREATE
  const onCreate = async () => {
    router.push('/inventory/stock/create');
  };
  // #endregion

  // #region VIEW
  const [openView, setOpenView] = useState(false);

  const getStockById = async (id: number) => {
    const getStockByIdParam: StockByIdDTO = {
      id: id,
    };

    try {
      const response = await StockService.getStockById(getStockByIdParam);
      if (response.responseCode !== ResponseCode.SUCCESS) {
        return null;
      } else {
        return response.data;
      }
    } catch {
      return null;
    }
  };

  const onView = async (stock: Stock) => {
    const selectedStock = await getStockById(Number(stock.id));
    setStock(selectedStock);

    setOpenView(true);
  };
  // #endregion

  // #region EDIT
  const onEdit = async (stock: Stock) => {
    router.push(`/inventory/stock/${stock.id}`);
  };
  // #endregion

  // #region DOWNLOAD
  const downloadStockReport = async (filters: { from: string; to: string }) => {
    try {
      const blob = await GeneralService.callDownloadApi(
        `/stock/report?from=${filters.from}&to=${filters.to}`
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `stock-report-${filters.from}-to-${filters.to}.xlsx`; // auto filename
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };
  // #endregion

  return (
    <ProtectedRoute>
      <div>
        <div className='card card-custom gutter-b'>
          <div className='card-header'>
            <div className='card-title'>
              <h3 className='card-label'>Stock</h3>
            </div>
          </div>

          {/* Toolbar */}
          <div className='card-toolbar'>
            <button className='btn--soft' onClick={onCreate}>
              <Plus />
              Add New Stock
            </button>
            <button className='btn--soft'>
              <Download />
              Excel CSV
            </button>
            <button className='btn--soft' onClick={getAllStocks} title='Refresh'>
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
                    <th className='w-[150px]'>ACTION</th>
                    <th className='text-center'>PRODUCT NAME</th>
                    <th className='text-center'>SUPPLIER NAME</th>
                    <th className='text-center'>FLOW</th>
                    <th className='text-center'>INVOICE DATE</th>
                    <th className='text-center'>TRANSACTION DATE</th>
                    <th className='text-center'>STOCK</th>
                    <th className='text-center'>UNIT</th>
                  </tr>
                </thead>
                <tbody>
                  {isError && (
                    <tr>
                      <td colSpan={8} className='py-4 text-center text-rose-600'>
                        Fail to load data.
                      </td>
                    </tr>
                  )}
                  {isLoading && !isError && (
                    <tr>
                      <td colSpan={8} className='py-4 text-center text-slate-500'>
                        Loading Product...
                      </td>
                    </tr>
                  )}
                  {!isLoading && !isError && data.length === 0 && (
                    <tr>
                      <td colSpan={8} className='py-4 text-center text-gray-500'>
                        No data to display
                      </td>
                    </tr>
                  )}
                  {!isLoading &&
                    !isError &&
                    data.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <RowActions
                            item={item}
                            onView={onView}
                            onEdit={onEdit}
                            disableEdit={(item) =>
                              item.disabledFlag === 'Y' || item.action === StockMovement.TRANSACTION
                            }
                          />
                        </td>
                        <td className='max-w-[200px] truncate text-center'>{item.productName}</td>
                        <td className='max-w-[70px] truncate text-center'>{item.supplierName}</td>
                        <td className='max-w-[30px] truncate text-center'>
                          <div title={item.flow}>
                            {item.action === StockMovement.IN ? (
                              <ArrowDownCircle className='mx-auto h-5 w-5 text-green-600' />
                            ) : item.action === StockMovement.OUT ? (
                              <ArrowUpCircle className='mx-auto h-5 w-5 text-red-600' />
                            ) : item.action === StockMovement.TRANSACTION ? (
                              <ArrowDownUp className='mx-auto h-5 w-5 text-blue-600' />
                            ) : (
                              <CircleSlash className='mx-auto h-5 w-5 text-gray-400' />
                            )}
                          </div>
                        </td>
                        <td className='max-w-[60px] truncate text-center'>
                          {item.invoiceDate}
                        </td>
                        <td className='max-w-[60px] truncate text-center'>
                          {item.transactionDate}
                        </td>
                        <td className='max-w-[150px] truncate text-center'>
                          {FormatterService.formatStock(item.stock)}
                        </td>
                        <td className='max-w-[150px] truncate text-center'>{item.unit}</td>
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
          title='Detail Stock'
          size='md'
          backdrop='blur'
        >
          {stock ? (
            <div className='grid grid-cols-2 gap-x-6 gap-y-3 pb-2 text-sm'>
              <div>
                <div className='text-slate-500'>Product</div>
                <div className='font-medium'>{stock.productName}</div>
              </div>
              <div>
                <div className='text-slate-500'>Supplier</div>
                <div className='font-medium'>{stock.supplierName}</div>
              </div>
              <div>
                <div className='text-slate-500'>Invoice No</div>
                <div className='font-medium'>{stock.invoiceNo || '-'}</div>
              </div>
              <div>
                <div className='text-slate-500'>Invoice Date</div>
                <div className='font-medium'>{stock.invoiceDate}</div>
              </div>
              <div>
                <div className='text-slate-500'>Transaction Date</div>
                <div className='font-medium'>{stock.transactionDate}</div>
              </div>
              <div>
                <div className='text-slate-500'>Stock</div>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{stock.stock}</span>
                  <div title={stock.flow}>
                    {stock.action === StockMovement.IN ? (
                      <ArrowDownCircle className='h-5 w-5 text-green-600' />
                    ) : stock.action === StockMovement.OUT ? (
                      <ArrowUpCircle className='h-5 w-5 text-red-600' />
                    ) : stock.action === StockMovement.TRANSACTION ? (
                      <ArrowDownUp className='h-5 w-5 text-blue-600' />
                    ) : (
                      <CircleSlash className='h-5 w-5 text-gray-400' />
                    )}
                  </div>
                </div>
              </div>
              <div className='col-span-2'>
                <div className='text-slate-500'>Notes</div>
                <div className='font-medium'>{stock.notes}</div>
              </div>
            </div>
          ) : (
            <div className='text-sm text-slate-500'>Stock not found!</div>
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

        {/* <button onClick={() => downloadStockReport({ from: '2025-09-01', to: '2025-09-30' })}>
        Download Stock Report
      </button> */}
      </div>
    </ProtectedRoute>
  );
}
