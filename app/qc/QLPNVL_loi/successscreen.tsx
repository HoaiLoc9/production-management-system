'use client';

import { CheckCircle2 } from 'lucide-react';

export default function SuccessScreen({
  employeeName,
  onCreateNew,
}: {
  employeeName: string;
  onCreateNew: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-gray-100">
        
        {/* Icon thành công */}
        <div className="flex justify-center mb-4">
          <div className="text-green-600 animate-bounce">
            <CheckCircle2 size={64} />
          </div>
        </div>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Tạo phiếu thành công!
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Phiếu NVL lỗi đã được lưu vào hệ thống.<br />
          Nhân viên thực hiện: <span className="font-semibold text-gray-700">{employeeName}</span>
        </p>

        {/* Khung mô tả */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-sm text-green-700">
          Dữ liệu đã được cập nhật và số lượng tồn kho đã được điều chỉnh.
        </div>

        {/* Nút tạo phiếu mới */}
        <button
          onClick={onCreateNew}
          className="
            bg-blue-600 
            hover:bg-blue-700 
            text-white 
            px-5 py-3 
            rounded-xl 
            font-medium 
            shadow-md 
            hover:shadow-lg 
            transition-all
            w-full
          "
        >
          Tạo phiếu mới
        </button>
      </div>
    </div>
  );
}
