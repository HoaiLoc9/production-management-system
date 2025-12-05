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
        onCreateNew={onReset}
      />
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Xác nhận phiếu NVL lỗi</h2>
        <p className="text-sm text-gray-500 mt-1">
          Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
        </p>
      </div>

      {/* INFO CARD */}
      <div className="bg-white border rounded-2xl shadow-sm p-5 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Thông tin phiếu</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <p>
            <span className="font-medium text-gray-600">Ngày lập phiếu:</span>{' '}
            {createdAt}
          </p>
          <p>
            <span className="font-medium text-gray-600">Người lập:</span>{' '}
            {createdBy}
          </p>
        </div>
      </div>

      {/* MATERIAL TABLE */}
      <div className="bg-white border rounded-2xl shadow-sm p-5 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Chi tiết NVL lỗi</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 border border-gray-200">
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
                const rate =
                  ((item.defect / item.quantity) * 100).toFixed(2) + '%';

                return (
                  <tr
                    key={item.code}
                    className="hover:bg-gray-50 border-b border-gray-200"
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

        {/* TOTAL */}
        <div className="mt-4 text-sm">
          <span className="font-medium text-gray-700">Tổng số lượng lỗi: </span>
          <span className="text-red-600 font-bold">{totalDefect}</span>
        </div>
      </div>

      {/* NOTE CARD */}
      <div className="bg-white border rounded-2xl shadow-sm p-5 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Ghi chú</h3>
        <div className="border rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-700">
          {note || 'Không có ghi chú'}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 transition"
        >
          ← Quay lại
        </button>

        <button
          onClick={() => setIsSuccess(true)}
          className="px-5 py-2.5 rounded-xl bg-green-600 text-white shadow hover:bg-green-700 transition"
        >
          ✔ Xác nhận
        </button>
      </div>
    </div>
  );
}
