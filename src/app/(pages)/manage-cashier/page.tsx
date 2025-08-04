'use client';

import React from 'react';
import { FaSyncAlt } from 'react-icons/fa';

export default function ManageCashier() {
  // dummy data for preview
  const items = [
    {
      noRegistrasi: 'REG001',
      namaBalita: 'Ani',
      noRM: 'RM123',
      usia: '2 thn',
      instalasi: 'Instalasi A',
      jenisKelamin: 'Perempuan',
      tanggalLahir: '01 Jan 2023',
      namaOrangTua: 'Budi',
      alamat: 'Jl. Merdeka 1',
      kecamatan: 'Cempaka',
      kelurahan: 'Dahlia',
      tanggalPengukuran: '01 Jul 2025',
      beratBadan: 12.3,
      tinggiBadan: 85,
    },
    {
      noRegistrasi: 'REG002',
      namaBalita: 'Budi',
      noRM: 'RM124',
      usia: '3 thn',
      instalasi: 'Instalasi B',
      jenisKelamin: 'Laki‑laki',
      tanggalLahir: '15 Feb 2022',
      namaOrangTua: 'Sari',
      alamat: 'Jl. Sudirman 2',
      kecamatan: 'Melati',
      kelurahan: 'Mawar',
      tanggalPengukuran: '02 Jul 2025',
      beratBadan: 14.1,
      tinggiBadan: 90,
    },
    {
      noRegistrasi: 'REG001',
      namaBalita: 'Ani',
      noRM: 'RM123',
      usia: '2 thn',
      instalasi: 'Instalasi A',
      jenisKelamin: 'Perempuan',
      tanggalLahir: '01 Jan 2023',
      namaOrangTua: 'Budi',
      alamat: 'Jl. Merdeka 1',
      kecamatan: 'Cempaka',
      kelurahan: 'Dahlia',
      tanggalPengukuran: '01 Jul 2025',
      beratBadan: 12.3,
      tinggiBadan: 85,
    },
    {
      noRegistrasi: 'REG001',
      namaBalita: 'Ani',
      noRM: 'RM123',
      usia: '2 thn',
      instalasi: 'Instalasi A',
      jenisKelamin: 'Perempuan',
      tanggalLahir: '01 Jan 2023',
      namaOrangTua: 'Budi',
      alamat: 'Jl. Merdeka 1',
      kecamatan: 'Cempaka',
      kelurahan: 'Dahlia',
      tanggalPengukuran: '01 Jul 2025',
      beratBadan: 12.3,
      tinggiBadan: 85,
    },
    {
      noRegistrasi: 'REG001',
      namaBalita: 'Ani',
      noRM: 'RM123',
      usia: '2 thn',
      instalasi: 'Instalasi A',
      jenisKelamin: 'Perempuan',
      tanggalLahir: '01 Jan 2023',
      namaOrangTua: 'Budi',
      alamat: 'Jl. Merdeka 1',
      kecamatan: 'Cempaka',
      kelurahan: 'Dahlia',
      tanggalPengukuran: '01 Jul 2025',
      beratBadan: 12.3,
      tinggiBadan: 85,
    },
    {
      noRegistrasi: 'REG001',
      namaBalita: 'Ani',
      noRM: 'RM123',
      usia: '2 thn',
      instalasi: 'Instalasi A',
      jenisKelamin: 'Perempuan',
      tanggalLahir: '01 Jan 2023',
      namaOrangTua: 'Budi',
      alamat: 'Jl. Merdeka 1',
      kecamatan: 'Cempaka',
      kelurahan: 'Dahlia',
      tanggalPengukuran: '01 Jul 2025',
      beratBadan: 12.3,
      tinggiBadan: 85,
    },
  ];

  return (
    <div className="card card-custom gutter-b">
      {/* Header */}
      <div className="card-header">
        <div className="card-title">
          <h3 className="card-label">Laporan Balita</h3>
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
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {[
                  'NO. REGISTRASI',
                  'NAMA BALITA',
                  'NO. RM',
                  'USIA',
                  'INSTALASI',
                  'JENIS KELAMIN',
                  'TANGGAL LAHIR',
                  'NAMA ORANGTUA',
                  'ALAMAT LENGKAP',
                  'KECAMATAN',
                  'KELURAHAN',
                  'TANGGAL PENGUKURAN',
                  'BERAT BADAN(kg)',
                  'PANJANG/TINGGI BADAN(cm)',
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
              {items.map((data) => (
                <tr key={data.noRegistrasi}>
                  <td className="px-3 py-2">{data.noRegistrasi}</td>
                  <td className="px-3 py-2">{data.namaBalita}</td>
                  <td className="px-3 py-2">{data.noRM}</td>
                  <td className="px-3 py-2">{data.usia}</td>
                  <td className="px-3 py-2">{data.instalasi}</td>
                  <td className="px-3 py-2">{data.jenisKelamin}</td>
                  <td className="px-3 py-2">{data.tanggalLahir}</td>
                  <td className="px-3 py-2">{data.namaOrangTua}</td>
                  <td className="px-3 py-2">{data.alamat}</td>
                  <td className="px-3 py-2">{data.kecamatan}</td>
                  <td className="px-3 py-2">{data.kelurahan}</td>
                  <td className="px-3 py-2">{data.tanggalPengukuran}</td>
                  <td className="px-3 py-2">{data.beratBadan}</td>
                  <td className="px-3 py-2">{data.tinggiBadan}</td>
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
