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

import { useEffect, useState } from "react";
import { FaSyncAlt } from 'react-icons/fa';

export default function TestLaravel() {
  const [data, setData] = useState<productType[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/get-all-products",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Include Authorization if needed:
              // 'Authorization': Bearer ${yourToken},
            },
            body: JSON.stringify({
              pagination: false,
              perPage: 20,
              page: 1,
              query: "",
              filter: "",
            }),
          }
        );

        const json = await response.json();
        setData(json.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);


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
        <div className="card-body space-y-4">
          {/* Filters Row */}
          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <input
                type="text"
                placeholder="Select date range"
                className="w-full border px-3 py-2 rounded"
              />
              <small className="block text-gray-500 text-sm">
                <b>Filter</b> tanggal
              </small>
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <select className="w-full border px-3 py-2 rounded">
                <option>Instalasi A</option>
                <option>Instalasi B</option>
              </select>
              <small className="block text-gray-500 text-sm">
                <b>Filter</b> Instalasi
              </small>
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <input
                type="text"
                placeholder="Cari"
                className="w-full border px-3 py-2 rounded"
              />
              <small className="block text-gray-500 text-sm">
                <b>Kolom</b> pencarian
              </small>
            </div>
          </div>
  
          {/* Table */}
          <div className="overflow-x-scroll max-w-full">
            <table className="divide-y divide-gray-200 text-sm text-center">
              <thead className="bg-blue-200 sticky top-0">
                <tr>
                  {[
                    'PRODUCT_ID',
                    'PRODUCT NAME',
                    'BASE PRICE',
                    'SELLING PRICE',
                    'UNIT',
                    'UPDATED_AT',
                    'UPDATED_BY',
                    'ACTION'
                    
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2 whitespace-nowrap font-medium text-gray-700"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {data && data.map((data) => (
                  <tr key={data.id}>
                    <td className="px-3 py-2">{data.product_id}</td>
                    <td className="px-3 py-2">{data.product_name}</td>
                    <td className="px-3 py-2">{data.base_price}</td>
                    <td className="px-3 py-2">{data.selling_price}</td>
                    <td className="px-3 py-2">{data.unit}</td>
                    <td className="px-3 py-2">{data.updated_at}</td>
                    <td className="px-3 py-2">{data.updated_by}</td>
                    <td>
                        <div className="flex gap-[50px]">
                            <button>
                                Edit
                            </button>
                            <button>
                                Delete
                            </button>
                        </div>
                        
                    </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Paginator (static preview) */}
          <div className="flex justify-between items-center pt-4">
            <button className="btn btn-default">Previous</button>
            <span className="text-sm text-gray-600">Page 1 of 5</span>
            <button className="btn btn-default">Next</button>
          </div>
        </div>
      </div>
    );
}
