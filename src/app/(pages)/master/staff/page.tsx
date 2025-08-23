"use client";

import { RowActions } from "@/components/actions/actionBar";
import DateRangePickerV1 from "@/components/datepicker/DateRangePicker";
import Pagination from "@/components/pagination/Pagination";
import ProtectedRoute from "@/components/protected-route/ProtectedRoute";
import Modal from "@/components/modal/Modal";
import { PAGE_SIZES } from "@/constants/GlobalConstant";
import { PaginationParam } from "@/models/GeneralDTO";
import { Staff } from "@/models/Staff";
import { StaffService } from "@/services/api/StaffService";
import { useEffect, useMemo, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { Download, Plus, RefreshCw } from "lucide-react";

/* ---------- Helpers ---------- */
function validateStaffForm(f: { staffName: string; password?: string; role: number | "" }, requirePwd = false) {
  if (!f.staffName.trim()) return "Nama staff wajib diisi.";
  if (requirePwd && (!f.password || f.password.length < 6)) return "Password minimal 6 karakter.";
  if (f.role === "" || Number.isNaN(f.role)) return "Role wajib angka.";
  return null;
}

export default function MasterStaff() {
  const [data, setData] = useState<Staff[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  // ===== List fetching =====
  const getAllStaffsParam: PaginationParam = useMemo(
    () => ({ pagination: true, perPage: pageSize, page, query: "", filter: "" }),
    [page, pageSize]
  );

  const getAllStaffs = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await StaffService.getAllStaffsPagination(getAllStaffsParam);
      if (res.responseCode !== "00") setError(true);
      else {
        setData(res.data.data);
        setTotal(res.data.total);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getAllStaffs(); }, [getAllStaffsParam]);

  /* ===================== CREATE ===================== */
  const [openCreate, setOpenCreate] = useState(false);
  const [savingCreate, setSavingCreate] = useState(false);
  const [msgCreate, setMsgCreate] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formCreate, setFormCreate] = useState<{ staffName: string; password: string; role: number | "" }>({
    staffName: "", password: "", role: ""
  });

  const onOpenCreate = () => {
    setFormCreate({ staffName: "", password: "", role: "" });
    setMsgCreate(null);
    setOpenCreate(true);
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgCreate(null);
    const err = validateStaffForm(formCreate, true);
    if (err) return setMsgCreate({ type: "error", text: err });

    try {
      setSavingCreate(true);
      const res = await StaffService.saveNewStaff({
        staffName: formCreate.staffName.trim(),
        password: formCreate.password,
        role: Number(formCreate.role),
      });
      if (!res || res.responseCode !== "00") setMsgCreate({ type: "error", text: res?.message || "Gagal membuat staff." });
      else {
        setMsgCreate({ type: "success", text: "Staff berhasil dibuat." });
        await getAllStaffs();
        setOpenCreate(false);
      }
    } catch (e: any) {
      setMsgCreate({ type: "error", text: e?.message || "Terjadi kesalahan saat menyimpan." });
    } finally {
      setSavingCreate(false);
    }
  };

  /* ===================== VIEW ===================== */
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<Staff | null>(null);
  const onView = (row: Staff) => { setSelected(row); setOpenView(true); };

  /* ===================== EDIT ===================== */
  const [openEdit, setOpenEdit] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [msgEdit, setMsgEdit] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formEdit, setFormEdit] = useState<{ id?: number; staffId?: string; staffName: string; role: number | "" }>({
    staffName: "", role: ""
  });

  const onEdit = (row: Staff) => {
    setSelected(row);
    setFormEdit({
      id: row.id,
      staffId: row.staffId,
      staffName: row.staffName ?? "",
      role: (row as any).role ?? ""  // kalau API tidak kembalikan role number, sesuaikan
    });
    setMsgEdit(null);
    setOpenEdit(true);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgEdit(null);
    const err = validateStaffForm({ staffName: formEdit.staffName, role: formEdit.role }, false);
    if (err) return setMsgEdit({ type: "error", text: err });

    try {
      setSavingEdit(true);
      const res = await StaffService.updateStaff({
        id: formEdit.id,
        staffId: formEdit.staffId,
        staffName: formEdit.staffName.trim(),
        // jika role disimpan sebagai number field lain (misal roleId), sesuaikan:
        role: formEdit.role === "" ? undefined : Number(formEdit.role),
      } as Partial<Staff>);
      if (!res || (res as any).responseCode !== "00") setMsgEdit({ type: "error", text: (res as any)?.message || "Gagal update staff." });
      else {
        setMsgEdit({ type: "success", text: "Perubahan disimpan." });
        await getAllStaffs();
        setOpenEdit(false);
      }
    } catch (e: any) {
      setMsgEdit({ type: "error", text: e?.message || "Terjadi kesalahan saat menyimpan." });
    } finally {
      setSavingEdit(false);
    }
  };

  /* ===================== DELETE ===================== */
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msgDelete, setMsgDelete] = useState<string | null>(null);

  const onDelete = (row: Staff) => { setSelected(row); setMsgDelete(null); setOpenDelete(true); };

  const submitDelete = async () => {
    if (!selected?.staffId) return;
    setMsgDelete(null);
    try {
      setDeleting(true);
      const res = await StaffService.deleteStaff(String(selected.staffId));
      if (!res || (res as any).responseCode !== "00") setMsgDelete((res as any)?.message || "Gagal menghapus staff.");
      else {
        await getAllStaffs();
        setOpenDelete(false);
      }
    } catch (e: any) {
      setMsgDelete(e?.message || "Terjadi kesalahan saat menghapus.");
    } finally {
      setDeleting(false);
    }
  };

  /* ===================== PRINT ===================== */
  const onPrint = () => window.print();

  return (
    <ProtectedRoute>
      <div className="card card-custom gutter-b">
        <div className="card-header">
          <div className="card-title">
            <h3 className="card-label">Staff</h3>
          </div>
        </div>

        {/* Toolbar */}
        <div className="card-toolbar">
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            onClick={onOpenCreate}
          >
            <Plus/>
            Add New Staff
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <Download />
            Excel CSV
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            onClick={getAllStaffs}
            title="Refresh"
          >
            <RefreshCw />
            Refresh
          </button>
        </div>

        <div className="card-body">
          {/* filters */}
          <div className="flex justify-between gap-4 mb-6">
            <div className="glass-card w-1/3">
              <small className="text-xs filter-text"><b>Filter</b> Tanggal</small>
              <DateRangePickerV1 />
            </div>

            <div className="glass-card w-1/3">
              <small className="text-xs filter-text"><b>Filter</b> Instalasi</small>
              <select className="filter-border2">
                <option>Instalasi A</option>
                <option>Instalasi B</option>
              </select>
            </div>

            <div className="glass-card w-1/3">
              <small className="text-xs filter-text"><b>Kolom</b> pencarian</small>
              <input type="text" placeholder="Cari" className="filter-border2" />
            </div>
          </div>

          {/* table */}
          <div className="table-responsive-scrollable">
            <table className="table table-head-custom table-vertical-center text-center w-full">
              <thead>
                <tr>
                  <th className="w-[240px]">ACTION</th>
                  <th>ID</th>
                  <th>STAFF ID</th>
                  <th>STAFF NAME</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {isError && (
                  <tr><td colSpan={7} className="py-4 text-center text-rose-600">Gagal memuat data.</td></tr>
                )}
                {isLoading && !isError && (
                  <tr><td colSpan={7} className="py-4 text-center text-slate-500">Loading…</td></tr>
                )}
                {!isLoading && !isError && data.length === 0 && (
                  <tr><td colSpan={7} className="py-4 text-center text-gray-500">No data to display</td></tr>
                )}
                {!isLoading && !isError && data.map((item) => (
                  <tr key={item.id}>
                    <td className="text-center">
                      <RowActions
                        item={item}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onPrint={onPrint}
                      />
                    </td>
                    <td className="text-center">{item.id}</td>
                    <td className="text-center">{item.staffId}</td>
                    <td className="text-center">{item.staffName}</td>
                    <td className="text-center">{item.roleName}</td>
                    <td className="text-center">{item.status}</td>
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
      <Modal isOpen={openCreate} onClose={() => setOpenCreate(false)} title="Create Staff" size="md" backdrop="blur">
        <form onSubmit={submitCreate} className="space-y-5">
          {msgCreate && (
            <div className={msgCreate.type === "success" ? "alert--success" : "alert--error"}>
              {msgCreate.text}
            </div>
          )}

          <div>
            <label className="form-label">Staff Name</label>
            <input className="form-input" value={formCreate.staffName}
              onChange={(e) => setFormCreate(s => ({ ...s, staffName: e.target.value }))} required />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input type="password" className="form-input" minLength={6}
              value={formCreate.password}
              onChange={(e) => setFormCreate(s => ({ ...s, password: e.target.value }))} required />
          </div>

          <div>
            <label className="form-label">Role (angka)</label>
            <input type="number" className="form-input" placeholder="Contoh: 2"
              value={formCreate.role}
              onChange={(e) => setFormCreate(s => ({ ...s, role: e.target.value === "" ? "" : Number(e.target.value) }))} required />
          </div>

          <div className="modal-actions">
            <button type="submit" disabled={savingCreate}
              className="btn--gradient btn--md btn--disabled">
              {savingCreate ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setOpenCreate(false)} className="btn--soft" disabled={savingCreate}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>


      {/* ===== Modal View ===== */}
      <Modal isOpen={openView} onClose={() => setOpenView(false)} title="Detail Staff" size="md" backdrop="blur">
        {selected ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div><div className="text-slate-500">ID</div><div className="font-medium">{selected.id}</div></div>
            <div><div className="text-slate-500">Staff ID</div><div className="font-medium">{selected.staffId}</div></div>
            <div><div className="text-slate-500">Nama</div><div className="font-medium">{selected.staffName}</div></div>
            <div><div className="text-slate-500">Role</div><div className="font-medium">{selected.roleName}</div></div>
            <div><div className="text-slate-500">Status</div><div className="font-medium">{selected.status}</div></div>
          </div>
        ) : (
          <div className="text-slate-500 text-sm">Tidak ada data.</div>
        )}
      </Modal>


      {/* ===== Modal Edit ===== */}
      <Modal isOpen={openEdit} onClose={() => setOpenEdit(false)} title="Edit Staff" size="md" backdrop="blur">
        <form onSubmit={submitEdit} className="space-y-5">
          {msgEdit && (
            <div className={msgEdit.type === "success" ? "alert--success" : "alert--error"}>
              {msgEdit.text}
            </div>
          )}
          <div>
            <label className="form-label">Staff ID</label>
            <input className="form-input" value={formEdit.staffId ?? ""} disabled />
          </div>
          <div>
            <label className="form-label">Staff Name</label>
            <input className="form-input" value={formEdit.staffName}
              onChange={(e) => setFormEdit(s => ({ ...s, staffName: e.target.value }))} required />
          </div>
          <div>
            <label className="form-label">Role (angka)</label>
            <input type="number" className="form-input" value={formEdit.role}
              onChange={(e) => setFormEdit(s => ({ ...s, role: e.target.value === "" ? "" : Number(e.target.value) }))} required />
          </div>
          <div className="modal-actions">
            <button type="submit" disabled={savingEdit}
              className="btn--gradient btn--md btn--disabled">
              {savingEdit ? "Saving…" : "Save changes"}
            </button>
            <button type="button" onClick={() => setOpenEdit(false)} className="btn--soft" disabled={savingEdit}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>


      {/* ===== Modal Delete ===== */}
      <Modal isOpen={openDelete} onClose={() => setOpenDelete(false)} title="Delete Staff" size="sm" backdrop="blur">
        {msgDelete && <div className="alert--error mb-3">{msgDelete}</div>}
        <p className="text-sm">
          Hapus staff <span className="font-semibold">{selected?.staffName}</span> (ID: {selected?.staffId})?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => setOpenDelete(false)} className="btn--soft" disabled={deleting}>Cancel</button>
          <button onClick={submitDelete} className="btn--danger btn--md btn--disabled" disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </Modal>
    </ProtectedRoute>
  );
}
