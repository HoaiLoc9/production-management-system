'use client';

import { useEffect, useState } from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
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

const materialOptions: Material[] = [
  { code: 'NVL001', name: 'Thép tấm A36', quantity: 500, unit: 'kg', defect: 0 },
  { code: 'NVL002', name: 'Sơn epoxy xanh', quantity: 150, unit: 'lít', defect: 0 },
  { code: 'NVL003', name: 'Ốc vít M10', quantity: 2000, unit: 'cái', defect: 0 },
  { code: 'NVL004', name: 'Nhựa PVC', quantity: 300, unit: 'kg', defect: 0 },
  { code: 'NVL005', name: 'Dây đồng', quantity: 800, unit: 'm', defect: 0 },
];

export default function CreateDefectForm({
  onCancel,
  onReset,
  initialData,
  previousTickets = [],
}: {
  onCancel: () => void;
  onReset: (ticket?: Ticket) => void;
  initialData?: Ticket;
  previousTickets?: Ticket[];
}) {
  const [materials, setMaterials] = useState<Material[]>([
    { code: '', name: '', quantity: 0, unit: '', defect: 0 },
  ]);

  const [note, setNote] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (initialData) {
      const defectMap: Record<string, number> = {};

      previousTickets.forEach((ticket) => {
        ticket.materials.forEach((m) => {
          defectMap[m.code] = (defectMap[m.code] || 0) + m.defect;
        });
      });

      const updated = initialData.materials.map((existing) => {
        const totalDefectBefore = defectMap[existing.code] || 0;
        const original = materialOptions.find((m) => m.code === existing.code);
        const adjustedQuantity = Math.max(
          0,
          (original?.quantity ?? 0) - totalDefectBefore
        );
        return { ...existing, quantity: adjustedQuantity };
      });

      setMaterials(updated);
      setNote(initialData.note ?? '');
      setEmployeeName(initialData.createdBy ?? '');
    }
  }, [initialData, previousTickets]);

  const handleSelectMaterial = (index: number, name: string) => {
    const selected = materialOptions.find((m) => m.name === name);
    if (!selected) return;

    const totalDefectBefore = previousTickets.reduce((sum, ticket) => {
      const found = ticket.materials.find((m) => m.code === selected.code);
      return sum + (found?.defect ?? 0);
    }, 0);

    const adjustedQuantity = Math.max(0, selected.quantity - totalDefectBefore);

    const updated = [...materials];
    updated[index] = { ...selected, quantity: adjustedQuantity, defect: 0 };
    setMaterials(updated);
  };

  const handleDefectChange = (index: number, value: number) => {
    const updated = [...materials];
    updated[index].defect = Math.max(0, value);
    setMaterials(updated);
  };

  const handleAddRow = () => {
    setMaterials((prev) => [
      ...prev,
      { code: '', name: '', quantity: 0, unit: '', defect: 0 },
    ]);
  };

  const handleDeleteRow = (index: number) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setIsConfirmed(true);
  };

  const handleCancelClick = () => {
    setMaterials([{ code: '', name: '', quantity: 0, unit: '', defect: 0 }]);
    setNote('');
    setEmployeeName('');
    setIsConfirmed(false);
    onCancel();
  };

  if (isConfirmed) {
    const used = materials.filter((m) => m.code && m.defect > 0);
    const totalDefect = used.reduce((sum, m) => sum + m.defect, 0);
    const totalTypes = used.length;

    return (
      <ConfirmDefectForm
        materials={used}
        note={note}
        createdAt="16:34 03/12/2025"
        createdBy={employeeName || 'Chưa nhập tên'}
        onBack={() => setIsConfirmed(false)}
        onReset={() => {
          const ticket: Ticket = {
            id: initialData?.id ?? 'PNVL' + Date.now(),
            createdAt: initialData?.createdAt ?? '16:34 03/12/2025',
            createdBy: employeeName || 'Chưa nhập tên',
            status: 'Đã xác nhận',
            note,
            totalDefect,
            totalTypes,
            materials: used,
          };

          setMaterials([{ code: '', name: '', quantity: 0, unit: '', defect: 0 }]);
          setNote('');
          setEmployeeName('');
          setIsConfirmed(false);
          onReset(ticket);
        }}
      />
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Chỉnh sửa phiếu NVL lỗi' : 'Tạo phiếu NVL lỗi'}
      </h2>

      {/* Nhân viên */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nhân viên:
        </label>
        <input
          type="text"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          placeholder="Nhập họ tên nhân viên..."
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />
      </div>

      {/* Form NVL dạng card */}
      <div className="space-y-3 mb-6">
        {materials.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
          >
            {/* Mã NVL */}
            <div className="w-28">
              <label className="text-xs text-gray-500">Mã NVL</label>
              <div className="font-medium">{item.code || '—'}</div>
            </div>

            {/* Tên NVL */}
            <div className="flex-1">
              <label className="text-xs text-gray-500">Tên NVL</label>
              <select
                value={item.name}
                onChange={(e) => handleSelectMaterial(idx, e.target.value)}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">-- Chọn NVL --</option>
                {materialOptions.map((opt) => (
                  <option key={opt.code} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SL nhập */}
            <div className="w-24 text-right">
              <label className="text-xs text-gray-500">SL nhập</label>
              <div className="font-medium">{item.quantity}</div>
            </div>

            {/* Đơn vị */}
            <div className="w-16">
              <label className="text-xs text-gray-500">Đơn vị</label>
              <div className="font-medium">{item.unit || '—'}</div>
            </div>

            {/* SL lỗi */}
            <div className="w-24">
              <label className="text-xs text-gray-500">SL lỗi</label>
              <input
                type="number"
                min={0}
                value={item.defect}
                onChange={(e) => handleDefectChange(idx, Number(e.target.value))}
                className="w-full border rounded px-2 py-1 text-right"
              />
            </div>

            {/* Còn lại */}
            <div className="w-24 text-right">
              <label className="text-xs text-gray-500">Còn lại</label>
              <div className="font-medium">
                {item.quantity - item.defect >= 0 ? item.quantity - item.defect : 0}
              </div>
            </div>

            {/* Nút xóa */}
            <button
              onClick={() => handleDeleteRow(idx)}
              className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition"
              title="Xóa dòng"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {/* Thêm dòng */}
        <button
          onClick={handleAddRow}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-medium mt-2"
        >
          <PlusCircle size={18} /> Thêm dòng NVL
        </button>
      </div>

      {/* Ghi chú */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ghi chú:
        </label>
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
