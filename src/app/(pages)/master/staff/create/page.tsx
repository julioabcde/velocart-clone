'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/protected-route/ProtectedRoute';
import { StaffService } from "@/services/api/StaffService";
import Modal from "@/components/modal/Modal";

type FormState = {
  staffName: string;
  password: string;
  role: number | '';
};

export default function Page() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    staffName: '',
    password: '',
    role: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isModalOpen, setModalOpen] = useState(true); // langsung true supaya terbuka

  const onChange =
    (key: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = key === 'role'
          ? (e.target.value === '' ? '' : Number(e.target.value))
          : e.target.value;
        setForm((s) => ({ ...s, [key]: value }));
      };

  const validate = () => {
    if (!form.staffName.trim()) return 'Nama staff wajib diisi.';
    if (!form.password || form.password.length < 6) return 'Password minimal 6 karakter.';
    if (form.role === '' || Number.isNaN(form.role)) return 'Role wajib dipilih.';
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const err = validate();
    if (err) {
      setMessage({ type: 'error', text: err });
      return;
    }

    try {
      setSubmitting(true);
      const result = await StaffService.createStaff({
        staffName: form.staffName.trim(),
        password: form.password,
        role: Number(form.role),
      });

      if (!result || result?.responseCode !== "00") {
        setMessage({ type: 'error', text: result?.message || 'Gagal membuat staff.' });
      } else {
        setMessage({ type: 'success', text: 'Staff berhasil dibuat.' });
        setTimeout(() => {
          setModalOpen(false);
          router.push('/master/staff');
        }, 700);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Terjadi kesalahan saat menyimpan.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Staff"
        size="md"   // 👉 ini cara apply modal size
      >
        <form onSubmit={onSubmit} className="space-y-5">
          {message && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Staff Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Staff Name</label>
            <input
              type="text"
              placeholder="Masukkan nama staff"
              className="filter-border"
              value={form.staffName}
              onChange={onChange('staffName')}
              disabled={submitting}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                className="filter-border pr-16"
                value={form.password}
                onChange={onChange('password')}
                disabled={submitting}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs rounded-lg border border-slate-200 bg-white/90 px-2 py-1 text-slate-700"
                disabled={submitting}
              >
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              className="filter-border"
              value={form.role}
              onChange={onChange('role')}
              disabled={submitting}
              required
            >
              <option value="">Pilih role</option>
              <option value={1}>Admin</option>
              <option value={2}>Controller</option>
              <option value={3}>Staff</option>
            </select>
            <small className="filter-text">Disimpan sebagai angka (mis: 2 = Controller).</small>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
              className="btn-primary"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </ProtectedRoute>
  );
}
