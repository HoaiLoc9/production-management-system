'use client';

import { useState } from 'react';
import DefectConfirmationCard from './DefectConfirmationCard';
import DefectSuccessCard from './DefectSuccessCard';

type Product = {
  code: string;
  name: string;
  unit: string;
  quantity: number;
};

const products: Product[] = [
  { code: 'TP001', name: 'Bàn gỗ cao cấp', unit: 'Cái', quantity: 50 },
  { code: 'TP002', name: 'Ghế xoay văn phòng', unit: 'Cái', quantity: 100 },
  { code: 'TP003', name: 'Tủ tài liệu 5 ngăn', unit: 'Cái', quantity: 30 },
  { code: 'TP004', name: 'Kệ sách gỗ sồi', unit: 'Cái', quantity: 45 },
  { code: 'TP005', name: 'Bàn họp 8 chỗ', unit: 'Cái', quantity: 20 },
];

export default function ProductDefectWizard() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selected, setSelected] = useState<Product | null>(null);
  const [defectQty, setDefectQty] = useState<number | ''>('');
  const [defectType, setDefectType] = useState('');
  const [error, setError] = useState('');

  const handleSelectProduct = (product: Product) => {
    setSelected(product);
    setStep(2);
  };

  const handleContinue = () => {
    if (!selected) return;
    if (defectQty === '' || defectQty <= 0 || defectQty > selected.quantity) {
      setError(`Số lượng phải lớn hơn 0 và không vượt quá ${selected.quantity} ${selected.unit}`);
      return;
    }
    if (!defectType) {
      setError('Vui lòng chọn loại lỗi');
      return;
    }
    setStep(3);
  };

  const handleBack = () => {
    setStep(step === 3 ? 2 : 1);
  };

const handleConfirm = () => {
  console.log('Phiếu đã xác nhận:', { selected, defectQty, defectType });
  setStep(4); // sang bước 4 hiển thị giao diện thành công
};

  const handleCancel = () => {
    setStep(1);
    setSelected(null);
    setDefectQty('');
    setDefectType('');
    setError('');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen rounded-xl shadow-lg">
      {/* Thanh bước */}
      <div className="flex items-center gap-8 mb-8 text-sm font-semibold">
        {['Chọn thành phẩm', 'Nhập thông tin lỗi', 'Xác nhận'].map((label, index) => {
          const current = index + 1 === step;
          return (
            <div
              key={label}
              className={`flex items-center gap-3 ${current ? 'text-blue-700' : 'text-gray-400'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  current ? 'bg-blue-700 text-white shadow-md' : 'border border-gray-300'
                }`}
              >
                {index + 1}
              </div>
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Bước 1: Chọn thành phẩm */}
      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Danh sách thành phẩm cần kiểm tra</h2>
          <p className="text-sm text-gray-500 mb-8">Chọn thành phẩm để tạo phiếu lỗi</p>
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((item) => (
              <div
                key={item.code}
                className="border rounded-2xl p-6 bg-white shadow-md hover:shadow-xl cursor-pointer transition"
                onClick={() => handleSelectProduct(item)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Mã: <strong>{item.code}</strong> | Đơn vị: {item.unit} | SL: {item.quantity}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Bước 2: Nhập thông tin lỗi */}
      {step === 2 && selected && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nhập thông tin lỗi</h2>
          <div className="text-sm text-gray-700 mb-8 space-y-2">
            <p>
              <strong>Thành phẩm:</strong> {selected.name}
            </p>
            <p>
              <strong>Mã:</strong> {selected.code} &nbsp;&nbsp;
              <strong>Số lượng hiện có:</strong> {selected.quantity} {selected.unit}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng thành phẩm lỗi <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={selected.quantity}
              value={defectQty}
              onChange={(e) => {
                const v = e.target.value;
                setDefectQty(v === '' ? '' : Number(v));
                setError('');
              }}
              placeholder={`Nhập số lượng (tối đa ${selected.quantity})`}
              className="w-full border border-gray-300 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
            <p className="text-xs text-gray-500 mt-2">
              Số lượng phải lớn hơn 0 và không vượt quá {selected.quantity} {selected.unit}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại lỗi <span className="text-red-600">*</span>
            </label>
            <select
              value={defectType}
              onChange={(e) => {
                setDefectType(e.target.value);
                setError('');
              }}
              className="w-full border border-gray-300 rounded-xl px-5 py-3 text-sm bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            >
              <option value="">-- Chọn loại lỗi --</option>
              <option value="Trầy xước">Trầy xước</option>
              <option value="Màu không đều">Màu không đều</option>
              <option value="Lỗi kỹ thuật">Lỗi kỹ thuật</option>
              <option value="Thiếu phụ kiện">Thiếu phụ kiện</option>
              <option value="Lỗi màu sắc (phai màu, ố vàng)">Lỗi màu sắc (phai màu, ố vàng)</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600 mb-6">{error}</p>}

          <div className="flex gap-6 mt-8">
            <button
              onClick={handleBack}
              className="border border-gray-300 text-gray-700 rounded-xl px-8 py-3 hover:bg-gray-100"
            >
              Quay lại
            </button>
            <button
              onClick={handleContinue}
              className="bg-blue-600 text-white rounded-xl px-8 py-3 hover:bg-blue-700 transition"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}

           {/* Bước 3: Xác nhận thông tin phiếu */}
      {step === 3 && selected && (
        <DefectConfirmationCard
          code={selected.code}
          name={selected.name}
          unit={selected.unit}
          defectQty={Number(defectQty)}
          defectType={defectType}
          onCancel={handleCancel}   // ← quay lại bước 1
          onEdit={handleBack}       // ← quay lại bước 2
          onConfirm={handleConfirm} // ← chuyển sang bước 4
        />
      )}

      {/* Bước 4: Hiển thị giao diện thành công */}
        {step === 4 && selected && (
          <DefectSuccessCard
            ticketCode="DF1764777400302"
            productCode={selected.code}
            productName={selected.name}
            unit={selected.unit}
            defectQty={Number(defectQty)}
            defectType={defectType}
            qcStaff="Nguyễn Văn Bảo"
            timestamp="23:10 03/12/2025"
            onCreateNew={() => {
              setStep(1);
              setSelected(null);
              setDefectQty('');
              setDefectType('');
              setError('');
            }}
          />
        )}
    </div>
  );
}