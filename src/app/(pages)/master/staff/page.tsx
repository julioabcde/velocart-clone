"use client";

import DateRangePickerV1 from "@/components/datepicker/DateRangePicker";
import Pagination from "@/components/pagination/Pagination";
import { PAGE_SIZES } from "@/constants/GlobalConstant";
import { PaginatedData, PaginationParam, RequestStructure } from "@/models/GeneralDTO";
import { Staff } from "@/models/Staff";
import { fetchData } from "@/services/GeneralService";
import { useEffect, useState } from "react";

export default function MasterStaff() {
  const [data, setData] = useState<Staff[]>([]);
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
    api: "/get-all-staffs",
    method: "POST",
    body: param,
  };

  const loadData = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetchData<PaginatedData<Staff>>(request);

      if (response.responseCode != "00") {
        console.log("responseDate: ", response.responseDate);
        console.log("responseCode: ", response.responseCode);
        console.log("responseDesc: ", response.responseDesc);
        console.log("message: ", response.message);

        setError(true);
      }
      else {
        const items = response.data.data;
        const totalCount = response.data.total;

        setData(items);
        setTotal(totalCount);
      }
    }
    catch (err) {
      console.error("Fetch error:", err);

      setError(true);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  return (
    <div className="card card-custom gutter-b">
      <div className="card-header">
        <div className="card-title">
          <h3 className="card-label">Staff</h3>
        </div>
      </div>

      <div className="card-body">
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
                <th className="text-center">ID</th>
                <th className="text-center">STAFF ID</th>
                <th className="text-center">STAFF NAME</th>
                <th className="text-center">ROLE</th>
                <th className="text-center">STATUS</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id}>
                    <td className="text-center">{item.id}</td>
                    <td className="text-center">{item.staffId}</td>
                    <td className="text-center truncate max-w-[70px]">
                      {item.staffName}
                    </td>
                    <td className="text-center">{item.roleName}</td>
                    <td className="text-center">{item.status}</td>
                    <td>
                      <div className="align-action">
                        <button>
                          <img src="/icon/ViewIcon.png" alt="view" width="35" />
                        </button>
                        <button>
                          <img src="/icon/EditIcon.png" alt="edit" width="35" />
                        </button>
                        <button>
                          <img src="/icon/DelIcon.png" alt="delete" width="35" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-500">
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
  );
}
