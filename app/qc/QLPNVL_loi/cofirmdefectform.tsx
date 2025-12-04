'use client';

import { useState } from 'react';
import SuccessScreen from './successscreen';

type Material = { 
  code: string; 
  name: string; 
  quantity: number; 
  defect: number; 
  unit: string 
};

export default function ConfirmDefectForm({
  materials,
  note,
  createdAt,
  createdBy,
  onBack,
  onReset,
}: {
  materials: Material[];
  note: string;
  createdAt: string;
  createdBy: string;
  onBack: () => void;
  onReset: () => void;
}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const totalDefect = materials.reduce((sum, item) => sum + item.defect, 0);

  if (isSuccess) {
    return (
      <SuccessScreen
        employeeName={createdBy}
        onCreateNew={onReset} // khi tạo phiếu mới: quay về trang chủ và hiển thị danh sách phiếu
      />
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Xác nhận phiếu NVL lỗi</h2>
      <p className="text-sm text-gray-500 mb-4">
        Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
      </p>

      {/* Thông tin phiếu */}
      <div className="mb-4 text-sm text-gray-700">
        <p><strong>Ngày lập phiếu:</strong> {createdAt}</p>
        <p><strong>Người lập:</strong> {createdBy}</p>
      </div>

      {/* Bảng NVL lỗi */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border border-gray-300 rounded-lg bg-white">
          <thead className="bg-gray-100 text-sm text-gray-700 font-medium">
            <tr>
              <th className="px-4 py-2 border text-left">Mã NVL</th>
              <th className="px-4 py-2 border text-left">Tên NVL</th>
              <th className="px-4 py-2 border text-right">Số lượng nhập</th>
              <th className="px-4 py-2 border text-right">Số lượng lỗi</th>
              <th className="px-4 py-2 border text-left">Đơn vị</th>
              <th className="px-4 py-2 border text-right">Tỷ lệ lỗi</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((item) => {
              const rate = ((item.defect / item.quantity) * 100).toFixed(2) + '%';
              return (
                <tr
                  key={item.code}
                  className="text-sm text-gray-800 bg-white hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border">{item.code}</td>
                  <td className="px-4 py-2 border">{item.name}</td>
                  <td className="px-4 py-2 border text-right">{item.quantity}</td>
                  <td className="px-4 py-2 border text-right font-semibold text-red-600">
                    {item.defect}
                  </td>
                  <td className="px-4 py-2 border">{item.unit}</td>
                  <td className="px-4 py-2 border text-right font-semibold text-blue-600">
                    {rate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tổng số lượng lỗi */}
      <p className="text-sm text-gray-700 mb-4">
        <strong>Tổng số lượng lỗi:</strong>{' '}
        <span className="text-red-600 font-semibold">{totalDefect}</span>
      </p>

      {/* Ghi chú */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú:</label>
        <div className="border rounded-lg px-4 py-2 text-sm text-gray-600 bg-gray-50">
          {note || '...'}
        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
        >
          Quay lại
        </button>
        <button
          onClick={() => setIsSuccess(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
}