'use client';

type Props = {
  code: string;
  name: string;
  unit: string;
  defectQty: number;
  defectType: string;
  onCancel: () => void;
  onEdit: () => void;
  onConfirm: () => void;
};

export default function DefectConfirmationCard({
  code,
  name,
  unit,
  defectQty,
  defectType,
  onCancel,
  onEdit,
  onConfirm,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 max-w-3xl mx-auto">
      {/* Tiêu đề */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác nhận thông tin phiếu</h2>
      <p className="text-sm text-gray-500 mb-6">
        Vui lòng kiểm tra lại thông tin trước khi xác nhận
      </p>

      {/* Phiếu lỗi */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Phiếu thành phẩm lỗi</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Mã thành phẩm:</strong> {code}</p>
          <p><strong>Tên thành phẩm:</strong> {name}</p>
          <p><strong>Đơn vị tính:</strong> {unit}</p>
          <p><strong>Số lượng lỗi:</strong> {defectQty} {unit}</p>
          <p><strong>Loại lỗi:</strong> {defectType}</p>
        </div>
      </div>

      {/* Ghi chú */}
      <div className="text-sm text-gray-600 mb-6">
        <p className="mb-1 font-medium text-gray-700">Sau khi xác nhận:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Phiếu sẽ được lưu vào cơ sở dữ liệu</li>
          <li>Số lượng tồn kho thành phẩm sẽ được cập nhật</li>
        </ul>
      </div>

      {/* Nút hành động */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onCancel}
          className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
        >
          Hủy
        </button>
        <button
          onClick={onEdit}
          className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition"
        >
          Quay lại chỉnh sửa
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
}