'use client';

import { useEffect, useState } from 'react';
import ConfirmDefectForm from './cofirmdefectform';

type Material = {
  code: string;
  name: string;
  quantity: number;
  unit: string;
  defect: number;
};

type Ticket = {
  id: string;
  createdAt: string;
  createdBy: string;
  status: 'Đã xác nhận';
  note: string;
  totalDefect: number;
  totalTypes: number;
  materials: Material[];
};

const initialMaterials: Material[] = [
  { code: 'NVL001', name: 'Thép tấm A36', quantity: 500, unit: 'kg', defect: 0 },
  { code: 'NVL002', name: 'Sơn epoxy xanh', quantity: 150, unit: 'lít', defect: 0 },
  { code: 'NVL003', name: 'Ốc vít M10', quantity: 2000, unit: 'cái', defect: 0 },
  { code: 'NVL004', name: 'Nhựa PVC', quantity: 300, unit: 'kg', defect: 0 },
  { code: 'NVL005', name: 'Dây đồng', quantity: 800, unit: 'm', defect: 0 },
];

export default function CreateDefectForm({
  onCancel,
  onReset,
}: {
  onCancel: () => void;
  onReset: (ticket?: Ticket) => void;
}) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [note, setNote] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  // ✅ Reset defect về 0 ngay khi form được mở (mounted)
  useEffect(() => {
    setMaterials(initialMaterials.map((m) => ({ ...m, defect: 0 })));
  }, []);

  const handleDefectChange = (index: number, value: number) => {
    const updated = [...materials];
    updated[index].defect = Math.max(0, value);
    setMaterials(updated);
  };

  const handleSave = () => setIsConfirmed(true);

  // ✅ Hủy: reset tất cả rồi quay về trang chủ
  const handleCancelClick = () => {
    setMaterials(initialMaterials.map((m) => ({ ...m, defect: 0 })));
    setNote('');
    setEmployeeName('');
    setIsConfirmed(false);
    onCancel();
  };

  if (isConfirmed) {
    return (
      <ConfirmDefectForm
        materials={materials.filter((m) => m.defect > 0)}
        note={note}
        createdAt="16:34 03/12/2025"
        createdBy={employeeName || 'Chưa nhập tên'}
        onBack={handleCancelClick}
        onReset={() => {
          // Tạo dữ liệu phiếu mới để trả về QLPNVLPage
          const totalDefect = materials.reduce((sum, m) => sum + m.defect, 0);
          const used = materials.filter((m) => m.defect > 0);
          const totalTypes = used.length;

          const ticket: Ticket = {
            id: 'PNVL' + Date.now(),
            createdAt: '16:34 03/12/2025',
            createdBy: employeeName || 'Chưa nhập tên',
            status: 'Đã xác nhận',
            note,
            totalDefect,
            totalTypes,
            materials: used,
          };

          // ✅ Reset form về trạng thái ban đầu (defect = 0)
          setMaterials(initialMaterials.map((m) => ({ ...m, defect: 0 })));
          setNote('');
          setEmployeeName('');
          setIsConfirmed(false);

          // Đẩy phiếu lên trang chủ
          onReset(ticket);
        }}
      />
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Tạo phiếu NVL lỗi</h2>

      {/* Nhân viên */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nhân viên:</label>
        <input
          type="text"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          placeholder="Nhập họ tên nhân viên..."
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />
      </div>

      {/* Bảng NVL */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-300 bg-white rounded-lg">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Mã NVL</th>
              <th className="px-4 py-2 border">Tên NVL</th>
              <th className="px-4 py-2 border">Số lượng nhập</th>
              <th className="px-4 py-2 border">Đơn vị</th>
              <th className="px-4 py-2 border">Số lượng lỗi</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((item, idx) => (
              <tr key={item.code} className="text-sm text-gray-800">
                <td className="px-4 py-2 border">{item.code}</td>
                <td className="px-4 py-2 border">{item.name}</td>
                <td className="px-4 py-2 border text-right">{item.quantity}</td>
                <td className="px-4 py-2 border">{item.unit}</td>
                <td className="px-4 py-2 border">
                  <input
                    type="number"
                    min={0}
                    value={item.defect}
                    onChange={(e) => handleDefectChange(idx, Number(e.target.value))}
                    className="w-24 border rounded px-2 py-1 text-right"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ghi chú */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú:</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nhập ghi chú về phiếu NVL lỗi..."
          className="w-full border rounded-lg px-4 py-2 text-sm"
          rows={3}
        />
      </div>

      {/* Nút hành động */}
      <div className="flex gap-4">
        <button
          onClick={handleCancelClick}
          className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Lưu phiếu
        </button>
      </div>
    </div>
  );
}