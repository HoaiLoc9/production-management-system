'use client';

export default function SuccessScreen({
  employeeName,
  onCreateNew,
}: {
  employeeName: string;
  onCreateNew: () => void;
}) {
  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      {/* Tiêu đề */}
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        Tạo phiếu NVL lỗi
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Nhân viên: <strong>{employeeName}</strong>
      </p>

      {/* Icon thành công */}
      <div className="flex justify-center mb-4">
        <div className="bg-green-100 text-green-600 rounded-full p-4 text-3xl">
          ✅
        </div>
      </div>

      {/* Nội dung thông báo */}
      <h3 className="text-lg font-semibold text-green-700 mb-2">
        Tạo phiếu thành công
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Phiếu NVL lỗi đã được lưu vào cơ sở dữ liệu và số lượng tồn kho đã được
        cập nhật.
      </p>

      {/* Nút hành động */}
      <div className="flex justify-center">
        <button
          onClick={onCreateNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Tạo phiếu mới
        </button>
      </div>
    </div>
  );
}