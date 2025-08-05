"use client";

import DateRangePickerV1 from "@/components/datepicker/DateRangePicker";
import {
  PaginatedData,
  PaginationParam,
  RequestStructure,
} from "@/models/GeneralDTO";
import { Product } from "@/models/Product";
import { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { fetchData } from "@/services/GeneralService";
import Pagination from "@/components/pagination/Pagination";

export default function ManageProduct() {
  const [data, setData] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const param: PaginationParam = {
    pagination: true,
    perPage: pageSize,
    page,
    query: "",
    filter: "",
  };

  const request: RequestStructure<PaginationParam> = {
    api: "/get-all-products",
    method: "POST",
    body: param,
  };

  const loadData = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetchData<PaginatedData<Product>>(request);
      if (response.responseCode != "00") {
        console.log("responseDate: ", response.responseDate);
        console.log("responseCode: ", response.responseCode);
        console.log("responseDesc: ", response.responseDesc);
        console.log("message: ", response.message);
        setError(true);
      } else {
        const items = response.data.data;
        const totalCount = response.data.total;
        setData(items);
        setTotal(totalCount);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  return (
    <div className="card card-custom gutter-b">
      {/* Header */}
      <div className="card-header">
        <div className="card-title">
          <h3 className="card-label">Product</h3>
        </div>
        <div className="card-toolbar">
          <button className="btn btn-primary mr-3">Excel CSV</button>
          <button className="btn btn-primary btn-refresh mr-10">
            <FaSyncAlt />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="card-body">
        {/* Begin: Filtration Form */}
        {/*
            w-1/2	width: 50%	Half the parent width
            w-1/3	width: 33%	One-third of parent
            w-2/3	width: 66%	Two-thirds
            w-1/4	width: 25%	One-fourth
            w-full	width: 100%	Fills parent
        */}
        <div className="flex justify-between gap-4 mb-6">
          <div className="w-1/3">
            <DateRangePickerV1></DateRangePickerV1>
          </div>

          <div className="w-1/3">
            <div>
              <select className="filter-border">
                <option>Instalasi A</option>
                <option>Instalasi B</option>
              </select>
              <small className="filter-text">
                <b>Filter</b> Instalasi
              </small>
            </div>
          </div>

          <div className="w-1/3">
            <div>
              <input type="text" placeholder="Cari" className="filter-border" />
              <small className="filter-text">
                <b>Kolom</b> pencarian
              </small>
            </div>
          </div>
        </div>

        <div className="table-responsive-scrollable">
          <table className="table table-head-custom table-vertical-center text-center w-full">
            <thead>
              <tr>
                <th className="text-center">PRODUCT ID</th>
                <th className="text-center">PRODUCT NAME</th>
                <th className="text-center">BASE PRICE</th>
                <th className="text-center">SELLING PRICE</th>
                <th className="text-center">UNIT</th>
                <th className="text-center">UPDATED_AT</th>
                <th className="text-center">UPDATED_BY</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.product_id}>
                    <td className="text-center">{item.product_id}</td>
                    <td className="text-center truncate max-w-[200px]">
                      {item.product_name}
                    </td>
                    <td className="text-center">{item.base_price}</td>
                    <td className="text-center">{item.selling_price}</td>
                    <td className="text-center">{item.unit}</td>
                    <td className="text-center">{item.updated_at}</td>
                    <td className="text-center">{item.updated_by}</td>
                    <td>
                      <div className="align-action">
                        <button><img src="/icon/ViewIcon.png" alt="view" width="35"/></button>
                        <button><img src="/icon/EditIcon.png" alt="edit" width="35" /></button>
                        <button><img src="/icon/DelIcon.png" alt="delete" width="35" /></button>
                        <button><img src="/icon/PrintIcon.png" alt="view" width="35" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-gray-500">
                    No data to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          pageSizes={[3, 5, 10, 15, 50, 100]}
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
  );
}
