'use client';

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
  status: 'Đã xác nhận';
  note: string;
  materials: Material[];
};

type TicketDetailProps = {
  ticket: Ticket;
  onBack: () => void;
  onEdit: (ticket: Ticket) => void;
};

export default function TicketDetailView({ ticket, onBack, onEdit }: TicketDetailProps) {
  const totalDefect = ticket.materials.reduce((sum, item) => sum + item.defect, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📄 Chi tiết phiếu NVL lỗi</h2>
        <p className="text-gray-500 text-sm mt-1">Theo dõi và quản lý vật liệu lỗi</p>
      </div>

      {/* CARD THÔNG TIN */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{ticket.id}</h3>

          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
            {ticket.status}
          </span>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <p>
            <strong>🗓 Ngày lập:</strong> {ticket.createdAt}
          </p>
          <p>
            <strong>👤 Người lập:</strong> {ticket.createdBy}
          </p>
        </div>
      </div>

      {/* BẢNG NVL */}
      <div className="bg-white shadow-md rounded-2xl border border-gray-100 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 border-b text-left">STT</th>
              <th className="px-4 py-3 border-b text-left">Mã NVL</th>
              <th className="px-4 py-3 border-b text-left">Tên NVL</th>
              <th className="px-4 py-3 border-b text-right">Số lượng nhập</th>
              <th className="px-4 py-3 border-b text-right">Số lượng lỗi</th>
              <th className="px-4 py-3 border-b text-left">Đơn vị</th>
              <th className="px-4 py-3 border-b text-right">Tỷ lệ lỗi</th>
            </tr>
          </thead>

          <tbody>
            {ticket.materials.map((item, idx) => {
              const rate =
                item.quantity > 0
                  ? ((item.defect / item.quantity) * 100).toFixed(2) + '%'
                  : '0%';

              return (
                <tr
                  key={item.code}
                  className="hover:bg-gray-50 transition border-b last:border-none text-gray-800"
                >
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium">{item.code}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-red-600 font-semibold">
                    {item.defect}
                  </td>
                  <td className="px-4 py-3">{item.unit}</td>
                  <td className="px-4 py-3 text-right text-blue-600 font-semibold">
                    {rate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* TỔNG LỖI */}
      <div className="bg-white shadow-md rounded-2xl p-5 border border-gray-100 mb-6">
        <p className="text-sm text-gray-700">
          <strong className="text-gray-800">Tổng số lượng lỗi:</strong>{' '}
          <span className="text-red-600 font-bold">{totalDefect}</span>
        </p>
      </div>

      {/* GHI CHÚ */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
        <div className="border rounded-xl px-4 py-3 text-sm text-gray-600 bg-gray-50 min-h-[70px]">
          {ticket.note || 'Không có ghi chú.'}
        </div>
      </div>

      {/* NÚT HÀNH ĐỘNG */}
      <div className="flex justify-end gap-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
        >
          ← Quay lại
        </button>

        <button
          onClick={() => onEdit(ticket)}
          className="px-5 py-2.5 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 transition font-medium"
        >
          ✏️ Chỉnh sửa phiếu
        </button>
      </div>
    </div>
  );
}
