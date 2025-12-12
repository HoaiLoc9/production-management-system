'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateDefectForm from './createdefectform';
import TicketDetailView from './ticketdetailveiw';

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
  const [isCreating, setIsCreating] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('tickets');
    if (saved) {
      const parsed: Ticket[] = JSON.parse(saved);
      setTickets(parsed);
      setTongPhieu(parsed.length);
      setTongNVL(parsed.reduce((sum, t) => sum + t.totalDefect, 0));
    }
  }, []);

  const handleCreate = () => {
    setSelectedTicket(null);
    setIsCreating(true);
  };

  const handleCancel = () => setIsCreating(false);

  const handleReset = (ticket?: Ticket) => {
    setIsCreating(false);
    if (!ticket) return;

    setTickets((prev) => {
      const updated = [ticket, ...prev];
      localStorage.setItem('tickets', JSON.stringify(updated));
      setTongPhieu(updated.length);
      setTongNVL(updated.reduce((sum, t) => sum + t.totalDefect, 0));
      return updated;
    });
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa phiếu này?');
    if (!confirmed) return;

    const updated = tickets.filter((t) => t.id !== id);
    setTickets(updated);
    localStorage.setItem('tickets', JSON.stringify(updated));
    setTongPhieu(updated.length);
    setTongNVL(updated.reduce((sum, t) => sum + t.totalDefect, 0));
  };

  const filtered = tickets.filter((t) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return t.id.toLowerCase().includes(q) || t.createdBy.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {isCreating ? (
        <CreateDefectForm onCancel={handleCancel} onReset={handleReset} />
      ) : selectedTicket ? (
        <TicketDetailView ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard/statistics')}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H4a.75.75 0 01-.75-.75V9.75z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
                </svg>
                <span className="text-xl font-bold">Trang chủ</span>
              </button>
              <span className="border-l h-5" />
              <h1 className="text-xl font-semibold">Quản lý phiếu NVL lỗi</h1>
              <span className="border-l h-5" />
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleCreate}
            >
              Tạo phiếu mới
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-6 shadow-sm">
              <p className="text-blue-700 text-sm font-medium mb-2">Tổng phiếu</p>
              <p className="text-4xl font-bold text-blue-900">{tongPhieu}</p>
            </div>
            <div className="bg-red-100 border border-red-300 rounded-lg p-6 shadow-sm">
              <p className="text-red-700 text-sm font-medium mb-2">Tổng NVL lỗi</p>
              <p className="text-4xl font-bold text-red-900">{tongNVL}</p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm theo mã phiếu, người lập, hoặc mã NVL..."
                className="w-full border rounded-lg px-4 py-2 pl-10 text-sm"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>

          {/* Danh sách phiếu */}
          {filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map((t) => (
                <div
                  key={t.id}
                  className="border rounded-lg p-4 bg-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{t.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                        {t.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 flex flex-wrap gap-3">
                      <span>🗓 {t.createdAt}</span>
                      <span>👤 {t.createdBy}</span>
                      <span>📦 {t.totalTypes} loại NVL - {t.totalDefect} lỗi</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Ghi chú:</strong> {t.note || '...'}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      👁️ Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-600 text-sm font-medium hover:underline"
                    >
                      🗑️ Xóa phiếu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border rounded-lg p-8 text-center shadow-sm">
              <div className="text-4xl mb-2">📄</div>
              <h2 className="text-lg font-semibold mb-1">Chưa có phiếu NVL lỗi nào</h2>
              <p className="text-sm text-gray-500 mb-4">
                Hãy tạo phiếu NVL lỗi đầu tiên của bạn
              </p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleCreate}
              >
                Tạo phiếu đầu tiên
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}