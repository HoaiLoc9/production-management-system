'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Search, Trash2, Eye, PlusCircle } from 'lucide-react';

import CreateDefectForm from './createdefectform';
import TicketDetailView from './ticketdetailveiw';
import ConfirmModal from './ConfirmModal';

type Material = {
  code: string;
  name: string;
  quantity: number;
  defect: number;
  unit: string;
};

type Ticket = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  status: 'Đã xác nhận' | 'Nháp';
  note: string;
  totalDefect: number;
  totalTypes: number;
  materials: Material[];
};

export default function QLPNVLPage() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [tongPhieu, setTongPhieu] = useState(0);
  const [tongNVL, setTongNVL] = useState(0);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Load dữ liệu
  useEffect(() => {
    const saved = localStorage.getItem('tickets');
    if (saved) {
      const parsed: Ticket[] = JSON.parse(saved);
      setTickets(parsed);
      setTongPhieu(parsed.length);
      setTongNVL(parsed.reduce((s, t) => s + t.totalDefect, 0));
    }
  }, []);

  // Tạo phiếu
  const handleCreate = () => {
    setSelectedTicket(null);
    setEditingTicket(null);
    setIsCreating(true);
  };

  // Hủy
  const handleCancel = () => {
    setIsCreating(false);
    setEditingTicket(null);
  };

  // Lưu phiếu
  const handleReset = (ticket?: Ticket) => {
    setIsCreating(false);
    setEditingTicket(null);
    if (!ticket) return;

    const now = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const ticketWithUpdate = editingTicket
      ? { ...ticket, updatedAt: now }
      : ticket;

    setTickets((prev) => {
      const updated = editingTicket
        ? prev.map((t) => (t.id === ticketWithUpdate.id ? ticketWithUpdate : t))
        : [ticketWithUpdate, ...prev];

      localStorage.setItem('tickets', JSON.stringify(updated));
      setTongPhieu(updated.length);
      setTongNVL(updated.reduce((sum, t) => sum + t.totalDefect, 0));

      return updated;
    });
  };

  // Xóa phiếu
  const confirmDelete = () => {
    if (!confirmDeleteId) return;

    const updated = tickets.filter((t) => t.id !== confirmDeleteId);
    setTickets(updated);
    localStorage.setItem('tickets', JSON.stringify(updated));

    setTongPhieu(updated.length);
    setTongNVL(updated.reduce((s, t) => s + t.totalDefect, 0));

    setConfirmDeleteId(null);
  };

  // Lọc tìm kiếm
  const filtered = tickets.filter((t) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      t.id.toLowerCase().includes(q) ||
      t.createdBy.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Modal xác nhận xóa */}
      {confirmDeleteId && (
        <ConfirmModal
          title="Xóa phiếu NVL lỗi"
          message="Bạn có chắc muốn xóa? Không thể hoàn tác."
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={confirmDelete}
        />
      )}

      {/* Form tạo / chỉnh sửa */}
      {(isCreating || editingTicket) && (
        <CreateDefectForm
          onCancel={handleCancel}
          onReset={handleReset}
          initialData={editingTicket ?? undefined}
          previousTickets={tickets}
        />
      )}

      {/* Xem chi tiết */}
      {!isCreating && !editingTicket && selectedTicket && (
        <TicketDetailView
          ticket={selectedTicket}
          onBack={() => setSelectedTicket(null)}
          onEdit={(t) => {
            setEditingTicket(t);
            setSelectedTicket(null);
            setIsCreating(true);
          }}
        />
      )}

      {/* Danh sách */}
      {!isCreating && !editingTicket && !selectedTicket && (
        <>

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard/statistics')}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
              >
                <Home className="w-6 h-6" />
                <span className="text-lg font-bold">Trang chủ</span>
              </button>

              <span className="border-l h-6 mx-2" />

              <h1 className="text-2xl font-semibold">Quản lý phiếu NVL lỗi</h1>
            </div>

            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
            >
              <PlusCircle className="w-5 h-5" />
              Tạo phiếu mới
            </button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">Tổng số phiếu</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{tongPhieu}</p>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">Tổng NVL lỗi</p>
              <p className="text-4xl font-bold text-red-600 mt-2">{tongNVL}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo mã phiếu / người lập..."
              className="w-full border rounded-xl px-4 py-2 pl-10 shadow-sm"
            />
          </div>

          {/* Danh sách phiếu */}
          {filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map((t) => (
                <div
                  key={t.id}
                  className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow transition flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-lg">{t.id}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        t.status === 'Đã xác nhận'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 flex gap-3 flex-wrap">
                      <span>🗓 {t.createdAt}</span>
                      <span>👤 {t.createdBy}</span>
                      <span>📦 {t.totalTypes} loại – {t.totalDefect} lỗi</span>
                    </p>

                    {t.updatedAt && (
                      <p className="text-xs text-orange-600">
                        🔄 Cập nhật lúc: {t.updatedAt}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-5">
                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Eye className="w-4 h-4" /> Xem
                    </button>

                    <button
                      onClick={() => setConfirmDeleteId(t.id)}
                      className="flex items-center gap-1 text-red-600 hover:underline"
                    >
                      <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border rounded-2xl p-10 text-center shadow-sm">
              <div className="text-5xl mb-4">📄</div>
              <h2 className="text-xl font-semibold mb-2">
                Chưa có phiếu NVL lỗi
              </h2>
              <p className="text-gray-500 mb-4">Hãy tạo phiếu đầu tiên</p>

              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Tạo phiếu mới
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
