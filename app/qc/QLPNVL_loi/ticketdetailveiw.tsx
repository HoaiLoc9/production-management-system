'use client';

type Material = {
  code: string;
  name: string;
  quantity: number;
  defect: number;
  unit: string;
};

type TicketDetailProps = {
  ticket: {
    id: string;
    createdAt: string;
    createdBy: string;
    status: 'Đã xác nhận';
    note: string;
    materials: Material[];
  };
  onBack: () => void;
};

export default function TicketDetailView({ ticket, onBack }: TicketDetailProps) {
  const totalDefect = ticket.materials.reduce((sum, item) => sum + item.defect, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Tiêu đề */}
      <h2 className="text-xl font-semibold mb-4">Chi tiết phiếu NVL lỗi</h2>

      {/* Thông tin phiếu */}
      <div className="mb-4 text-sm text-gray-700 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{ticket.id}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
            {ticket.status}
          </span>
        </div>
        <p>
          🗓 <strong>Ngày lập:</strong> {ticket.createdAt}
        </p>
        <p>
          👤 <strong>Người lập:</strong> {ticket.createdBy}
        </p>
      </div>

      {/* Bảng NVL lỗi */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-300 bg-white rounded-lg">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="px-4 py-2 border">STT</th>
              <th className="px-4 py-2 border">Mã NVL</th>
              <th className="px-4 py-2 border">Tên NVL</th>
              <th className="px-4 py-2 border text-right">Số lượng nhập</th>
              <th className="px-4 py-2 border text-right">Số lượng lỗi</th>
              <th className="px-4 py-2 border">Đơn vị</th>
              <th className="px-4 py-2 border text-right">Tỷ lệ lỗi</th>
            </tr>
          </thead>
          <tbody>
            {ticket.materials.map((item, idx) => {
              const rate =
                item.quantity > 0
                  ? ((item.defect / item.quantity) * 100).toFixed(2) + '%'
                  : '0%';
              return (
                <tr key={item.code} className="text-sm text-gray-800">
                  <td className="px-4 py-2 border text-center">{idx + 1}</td>
                  <td className="px-4 py-2 border">{item.code}</td>
                  <td className="px-4 py-2 border">{item.name}</td>
                  <td className="px-4 py-2 border text-right">{item.quantity}</td>
                  <td className="px-4 py-2 border text-right text-red-600 font-semibold">
                    {item.defect}
                  </td>
                  <td className="px-4 py-2 border">{item.unit}</td>
                  <td className="px-4 py-2 border text-right text-blue-600 font-semibold">
                    {rate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tổng lỗi */}
      <p className="text-sm text-gray-700 mb-4">
        <strong>Tổng số lượng lỗi:</strong>{' '}
        <span className="text-red-600 font-semibold">{totalDefect}</span>
      </p>

      {/* Ghi chú */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú:</label>
        <div className="border rounded-lg px-4 py-2 text-sm text-gray-600 bg-gray-50">
          {ticket.note || '…'}
        </div>
      </div>

      {/* Nút quay lại */}
      <div className="text-center">
        <button
          onClick={onBack}
          className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}