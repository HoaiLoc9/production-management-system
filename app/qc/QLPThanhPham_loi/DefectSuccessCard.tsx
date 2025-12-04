'use client';

type Props = {
  ticketCode: string;
  productCode: string;
  productName: string;
  unit: string;
  defectQty: number;
  defectType: string;
  qcStaff: string;
  timestamp: string;
  onCreateNew: () => void;
};

export default function DefectSuccessCard({
  ticketCode,
  productCode,
  productName,
  unit,
  defectQty,
  defectType,
  qcStaff,
  timestamp,
  onCreateNew,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 max-w-3xl mx-auto">
      {/* Tiêu đề */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-600">Tạo phiếu thành công!</h2>
        <p className="text-sm text-gray-600">
          Phiếu thành phẩm lỗi đã được lưu vào hệ thống
        </p>
      </div>

      {/* Chi tiết phiếu */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết phiếu</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
          <p><strong>Mã phiếu:</strong> {ticketCode}</p>
          <p><strong>Mã thành phẩm:</strong> {productCode}</p>
          <p><strong>Tên thành phẩm:</strong> {productName}</p>
          <p><strong>Đơn vị tính:</strong> {unit}</p>
          <p><strong>Số lượng lỗi:</strong> {defectQty} {unit}</p>
          <p><strong>Loại lỗi:</strong> {defectType}</p>
          <p><strong>Nhân viên QC:</strong> {qcStaff}</p>
          <p><strong>Thời gian:</strong> {timestamp}</p>
        </div>
      </div>

      {/* Ghi chú cập nhật */}
      <div className="text-sm text-gray-700 mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="mb-2 font-medium text-green-700">Cập nhật thành công:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Phiếu thành phẩm lỗi đã được lưu vào cơ sở dữ liệu</li>
          <li>
            Số lượng tồn kho đã được cập nhật ({defectQty} {unit} đã chuyển vào kho lỗi)
          </li>
        </ul>
      </div>

      {/* Nút tạo phiếu mới */}
      <div className="flex justify-end">
        <button
          onClick={onCreateNew}
          className="px-6 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          + Tạo phiếu mới
        </button>
      </div>
    </div>
  );
}