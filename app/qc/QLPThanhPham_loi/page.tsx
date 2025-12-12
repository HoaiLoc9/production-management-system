'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DefectSuccessCard from './DefectSuccessCard';

type Product = {
  code: string;
  name: string;
  unit: string;
  quantity: number;
};

export default function SelectProductView() {
  const router = useRouter();

  // Danh sách mặc định (lần đầu chạy)
  const defaultProducts: Product[] = [
    { code: 'TP001', name: 'Bàn gỗ cao cấp', unit: 'Cái', quantity: 50 },
    { code: 'TP002', name: 'Ghế xoay văn phòng', unit: 'Cái', quantity: 100 },
    { code: 'TP003', name: 'Tủ tài liệu 5 ngăn', unit: 'Cái', quantity: 30 },
    { code: 'TP004', name: 'Kệ sách gỗ sồi', unit: 'Cái', quantity: 45 },
    { code: 'TP005', name: 'Bàn họp 8 chỗ', unit: 'Cái', quantity: 20 },
  ];

  const [productList, setProductList] = useState<Product[]>([]);

  // ⬇️ Lần đầu load: nếu có dữ liệu → dùng; không có → tạo mặc định và lưu lại
  useEffect(() => {
    const local = localStorage.getItem('productList');

    if (local) {
      setProductList(JSON.parse(local));
    } else {
      setProductList(defaultProducts);
      localStorage.setItem('productList', JSON.stringify(defaultProducts));
    }
  }, []);

  // ⬇️ Mỗi lần productList thay đổi → lưu lại
  useEffect(() => {
    if (productList.length > 0) {
      localStorage.setItem('productList', JSON.stringify(productList));
    }
  }, [productList]);

  // -----------------------------------------------------
  // LOGIC GIAO DIỆN
  // -----------------------------------------------------

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
    if (step === 2) {
      setSelected(null);
      setDefectQty('');
      setDefectType('');
      setError('');
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleConfirm = () => {
    if (!selected) return;

    const updated = productList.map(item =>
      item.code === selected.code
        ? { ...item, quantity: item.quantity - Number(defectQty) }
        : item
    );

    // Cập nhật và lưu
    setProductList(updated);

    setStep(4);
  };

  const handleCancel = () => {
    setStep(1);
    setSelected(null);
    setDefectQty('');
    setDefectType('');
    setError('');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen rounded-lg shadow">

      {/* Back to Home */}
      <button
        onClick={() => router.push('/dashboard/statistics')}
        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-6 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H4a.75.75 0 01-.75-.75V9.75z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
        </svg>
        <span className="text-lg font-semibold">Trang chủ</span>
      </button>

      {/* Steps */}
      {step < 4 && (
        <div className="flex items-center gap-6 mb-8 text-sm font-medium">
          {['Chọn thành phẩm', 'Nhập thông tin lỗi', 'Xác nhận'].map((label, index) => {
            const current = index + 1 === step;
            return (
              <div key={label} className={`flex items-center gap-2 ${current ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${current ? 'bg-blue-600 text-white' : 'border border-gray-400'
                  }`}>
                  {index + 1}
                </div>
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Danh sách thành phẩm cần kiểm tra</h2>
          <p className="text-sm text-gray-500 mb-6">Chọn thành phẩm để tạo phiếu lỗi</p>

          <div className="grid md:grid-cols-2 gap-6">
            {productList.map(item => (
              <div
                key={item.code}
                className="border rounded-xl p-6 bg-white shadow hover:shadow-lg cursor-pointer transition-all"
                onClick={() => handleSelectProduct(item)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Mã: <strong>{item.code}</strong> | Đơn vị: {item.unit} | SL: {item.quantity}
                    </p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Step 2 */}
      {step === 2 && selected && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Nhập thông tin lỗi</h2>

          <div className="text-sm text-gray-700 mb-6 space-y-1">
            <p><strong>Thành phẩm:</strong> {selected.name}</p>
            <p>
              <strong>Mã:</strong> {selected.code} &nbsp;&nbsp;
              <strong>Số lượng hiện có:</strong> {selected.quantity} {selected.unit}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng thành phẩm lỗi <span className="text-red-500">*</span>
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
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại lỗi <span className="text-red-500">*</span>
            </label>
            <select
              value={defectType}
              onChange={(e) => {
                setDefectType(e.target.value);
                setError('');
              }}
              className="w-full border rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn loại lỗi --</option>
              <option value="Trầy xước">Trầy xước</option>
              <option value="Màu không đều">Màu không đều</option>
              <option value="Lỗi kỹ thuật">Lỗi kỹ thuật</option>
              <option value="Thiếu phụ kiện">Thiếu phụ kiện</option>
              <option value="Lỗi màu sắc (phai màu, ố vàng)">Lỗi màu sắc (phai màu, ố vàng)</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <div className="flex gap-4 mt-6">
            <button onClick={handleBack} className="border border-gray-300 text-gray-700 rounded-lg px-6 py-2 hover:bg-gray-100 transition">
              Quay lại
            </button>
            <button onClick={handleContinue} className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 transition">
              Tiếp tục
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && selected && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Xác nhận thông tin phiếu</h2>
          <p className="text-sm text-gray-500 mb-6">
            Vui lòng kiểm tra lại thông tin trước khi xác nhận
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Phiếu thành phẩm lỗi</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Mã thành phẩm:</strong> {selected.code}</p>
              <p><strong>Tên thành phẩm:</strong> {selected.name}</p>
              <p><strong>Đơn vị tính:</strong> {selected.unit}</p>
              <p><strong>Số lượng lỗi:</strong> {defectQty} {selected.unit}</p>
              <p><strong>Loại lỗi:</strong> {defectType}</p>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-6">
            <ul className="list-disc list-inside space-y-1">
              <li>Phiếu sẽ được lưu vào cơ sở dữ liệu</li>
              <li>Số lượng tồn kho thành phẩm sẽ được cập nhật</li>
            </ul>
          </div>

          <div className="flex gap-4 mt-6">
            <button onClick={handleCancel} className="border border-gray-300 text-gray-700 rounded-lg px-6 py-2 hover:bg-red-50 hover:text-red-600 transition">
              Hủy
            </button>
            <button onClick={handleBack} className="border border-gray-300 text-gray-700 rounded-lg px-6 py-2 hover:bg-gray-100 transition">
              Quay lại chỉnh sửa
            </button>
            <button onClick={handleConfirm} className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 transition">
              Xác nhận
            </button>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && selected && (
        <DefectSuccessCard
          ticketCode="DF1764777400302"
          productCode={selected.code}
          productName={selected.name}
          unit={selected.unit}
          defectQty={Number(defectQty)}
          defectType={defectType}
          qcStaff="Nguyễn Văn Bảo"
          timestamp="23:19 03/12/2025"
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
