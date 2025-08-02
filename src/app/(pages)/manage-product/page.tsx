"use client";

interface productType {
  id: number;
  product_id: string;
  category_id: number;
  product_name: string;
  unit: string;
  base_price: number;
  selling_price: number;
  status: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

import DateRangePickerV1 from "@/components/datepicker/DateRangePicker";
import Pagination from "@/components/paginate/pagination";
import { useEffect, useState } from "react";
import { FaSyncAlt } from 'react-icons/fa';

export default function TestLaravel() {
  const [data, setData] = useState<productType[] | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         "http://127.0.0.1:8000/api/get-all-products",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             // Include Authorization if needed:
  //             // 'Authorization': Bearer ${yourToken},
  //           },
  //           body: JSON.stringify({
  //             pagination: false,
  //             perPage: 20,
  //             page: 1,
  //             query: "",
  //             filter: "",
  //           }),
  //         },
  //       );

  //       const json = await response.json();
  //       setData(json.data);
  //     } catch (err) {
  //       console.error("Fetch error:", err);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(
          'http://127.0.0.1:8000/api/get-all-products',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pagination: true,
              perPage: pageSize,
              page,
              query: '',
              filter: '',
            }),
          }
        );
        if (!response.ok) throw new Error('Network response was not OK');

        const json = await response.json();

        // 👉 Pull out the array and total correctly:
        const itemsArray = json.data.data;       // actual rows
        const totalCount = json.data.total;      // total items across all pages

        setData(itemsArray);
        setTotal(totalCount);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize]);


  return (
    <div className="card card-custom gutter-b">
      {/* Header */}
      <div className="card-header">
        <div className="card-title">
          <h3 className="card-label">Product</h3>
        </div>
        <div className="card-toolbar">
          <button className="btn btn-primary mr-2">Excel CSV</button>
          <button className="btn btn-primary btn-refresh">
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
              <input
                type="text"
                placeholder="Cari"
                className="filter-border"
              />
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
                <th>PRODUCT ID</th>
                <th>PRODUCT NAME</th>
                <th>BASE PRICE</th>
                <th>SELLING PRICE</th>
                <th>UNIT</th>
                <th>UPDATED_AT</th>
                <th>UPDATED_BY</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product_id}</td>
                    <td>{item.product_name}</td>
                    <td>{item.base_price}</td>
                    <td>{item.selling_price}</td>
                    <td>{item.unit}</td>
                    <td>{item.updated_at}</td>
                    <td>{item.updated_by}</td>
                    <td>
                      <div className="align-action">
                        <button>Edit</button>
                        <button>Delete</button>
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
          pageSizes={[3, 5, 10, 15, 50, 100, 1000]}
          onPaginate={({ page: newPage, pageSize: newSize }) => {
            setPage(newPage)
            setPageSize(newSize)
          }}
          siblingCount={1}
          boundaryCount={1}
          showFirstLast={true}
        />
      </div>
    </div>
  );
}
