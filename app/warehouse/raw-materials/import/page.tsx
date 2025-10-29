<<<<<<< HEAD
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Warehouse, AlertCircle } from "lucide-react";

import { purchaseRequests as mockRequests, purchaseDetails, PurchaseDetail, PurchaseRequest } from "./mockData";

export default function RawMaterialsImportPage() {
  const [maphieumuanvl, setMaPhieuMuaNVL] = useState("");
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [details, setDetails] = useState<PurchaseDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Khởi tạo danh sách phiếu
  useEffect(() => {
    setPurchaseRequests(mockRequests);
  }, []);

  // Lấy chi tiết khi chọn phiếu
  useEffect(() => {
    if (!maphieumuanvl) {
      setDetails([]);
      return;
    }

    setLoading(true);
    setError(null);

    const data = purchaseDetails[maphieumuanvl] || [];
    setDetails(data);
    setLoading(false);
  }, [maphieumuanvl]);

  const handleSave = () => {
    console.log("Lưu nhập kho:", { maphieumuanvl, details });
    alert(`Đã lưu nhập kho phiếu ${maphieumuanvl} thành công!`);

    // Xóa phiếu đã chọn khỏi danh sách
    setPurchaseRequests((prev) =>
      prev.filter((pr) => pr.maphieumuanvl !== maphieumuanvl)
    );

    setMaPhieuMuaNVL("");
    setDetails([]);
  };

  const handleCancel = () => {
    setMaPhieuMuaNVL("");
    setDetails([]);
  };

  const tongGiaTri = details.reduce(
    (sum, item) => sum + item.soLuongYeuCau * parseFloat(item.donGia),
    0
  );

  // Gộp NVL theo NCC
  const groupedByNCC = details.reduce<Record<string, PurchaseDetail[]>>((acc, item) => {
    if (!acc[item.tenNCC]) acc[item.tenNCC] = [];
    acc[item.tenNCC].push(item);
    return acc;
  }, {});

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-blue-400">Công ty An Phát</h2>
          <p className="text-xs text-gray-400 mt-1">Nhân viên kho nguyên vật liệu</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-blue-900 text-white font-medium">
            <Warehouse className="w-5 h-5" /> Nhập kho NVL
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-800 text-white font-medium">
            <Warehouse className="w-5 h-5" /> Xuất kho NVL
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-800 text-white font-medium">
            <Warehouse className="w-5 h-5" /> Phiếu yêu cầu mua NVL
          </button>
        </nav>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Nhập Nguyên Vật Liệu</h1>
            <p className="text-gray-600 mt-2">Ghi nhận giao dịch nhập kho nguyên vật liệu</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-red-800">Lỗi</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Phiếu Nhập Nguyên Vật Liệu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* CHỌN PHIẾU */}
              <div className="max-w-md">
                <label className="text-sm font-medium block mb-2">
                  Phiếu mua nguyên vật liệu <span className="text-red-500">*</span>
                </label>
                <Select value={maphieumuanvl} onValueChange={setMaPhieuMuaNVL}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phiếu mua" />
                  </SelectTrigger>
                  <SelectContent>
                    {purchaseRequests.length === 0 && (
                      <SelectItem value="none" disabled>Không còn phiếu nào</SelectItem>
                    )}
                    {purchaseRequests.map((pr) => (
                      <SelectItem key={pr.maphieumuanvl} value={pr.maphieumuanvl}>
                        {pr.maphieumuanvl}
                      </SelectItem>
                    ))}
=======
"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RawMaterialsImportPage() {
  const [formData, setFormData] = useState({
    material_type: "",
    quantity: "",
    unit: "",
    supplier: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // TODO: Send to API
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Nhập Nguyên Vật Liệu</h1>
        <p className="text-muted-foreground mt-2">Ghi nhận giao dịch nhập kho nguyên vật liệu</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phiếu Nhập Nguyên Vật Liệu</CardTitle>
          <CardDescription>Điền thông tin chi tiết về nguyên vật liệu nhập kho</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Phiếu mua nguyên vật liệu *</label>
                <Select
                  value={formData.material_type}
                  onValueChange={(value) => setFormData({ ...formData, material_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phiếu mua nguyên vật liệu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wood">Gỗ</SelectItem>
                    <SelectItem value="fabric">Vải</SelectItem>
                    <SelectItem value="metal">Kim loại</SelectItem>
                    <SelectItem value="foam">Xốp</SelectItem>
>>>>>>> origin/thaibao-feature
                  </SelectContent>
                </Select>
              </div>

<<<<<<< HEAD
              {/* HIỂN THỊ CHI TIẾT */}
              {maphieumuanvl && (
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                      <p className="text-sm text-gray-500 mt-2">Đang tải thông tin...</p>
                    </div>
                  ) : details.length > 0 ? (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
                        <div className="font-semibold text-lg text-gray-800">
                          Thông tin nguyên vật liệu ({details.length} items)
                        </div>

                        {Object.entries(groupedByNCC).map(([tenNCC, items], idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4 border border-blue-100">
                            <div className="font-medium text-gray-800 mb-2">Nhà cung cấp: {tenNCC}</div>
                            <div className="text-sm space-y-1">
                              {items.map((item, i) => (
                                <div key={i}>
                                  {item.maNVL} - {item.tenNVL} - {item.soLuongYeuCau} m³ - {parseFloat(item.donGia).toLocaleString('vi-VN')} đ
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 font-bold text-blue-600">
                              Thành tiền: {items.reduce((sum, it) => sum + it.soLuongYeuCau * parseFloat(it.donGia), 0).toLocaleString('vi-VN')} đ
                            </div>
                          </div>
                        ))}

                        <div className="border-t-2 border-blue-300 pt-4 flex justify-between items-center">
                          <span className="font-bold text-gray-800 text-lg">Tổng giá trị:</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {tongGiaTri.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={handleCancel}>Hủy</Button>
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Lưu</Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-medium">Không có nguyên vật liệu trong phiếu này</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
=======
              <div>
                <label className="text-sm font-medium">Số Lượng *</label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="Nhập số lượng"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Đơn Vị *</label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kg</SelectItem>
                    <SelectItem value="m">Mét</SelectItem>
                    <SelectItem value="piece">Cái</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Nhà Cung Cấp *</label>
                <Input
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Nhập tên nhà cung cấp"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Ghi Chú</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ghi chú về giao dịch..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={4}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline">
                Hủy
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Lưu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
>>>>>>> origin/thaibao-feature
}
