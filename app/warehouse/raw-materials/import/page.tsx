"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle, CheckCircle2, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar"; // Thay bằng sidebar chung
import Header from "@/components/layout/header";


interface PurchaseDetail {
  maNVL: string;
  tenNVL: string;
  soLuongYC: number;
  donVi: string;
  donGia: number;
  tenNCC: string;
}

export default function RawMaterialsImportPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [maPhieuMuaNVL, setMaPhieuMuaNVL] = useState("");
  const [purchaseRequests, setPurchaseRequests] = useState<string[]>([]);
  const [purchaseRequestsData, setPurchaseRequestsData] = useState<Record<string, PurchaseDetail[]>>({});
  const [details, setDetails] = useState<PurchaseDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Kiểm tra quyền và lấy danh sách phiếu mua
  useEffect(() => {
    if (user && user.role !== "warehouse_raw") {
      setError("Chỉ nhân viên Kho NVL mới có quyền nhập kho nguyên vật liệu");
      setTimeout(() => router.push("/dashboard/statistics"), 1500);
      return;
    }

    fetchPurchaseRequests();
  }, [user, router]);

  const fetchPurchaseRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await fetch("/api/warehouse/materials");
      const data = await res.json();

      const safeData: Record<string, PurchaseDetail[]> = {};
      const keys: string[] = [];

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const arr = Array.isArray(data[key]) ? data[key] : [];
          safeData[key] = arr.map((d: any) => ({
            maNVL: d.maNVL,
            tenNVL: d.tenNVL,
            soLuongYC: Number(d.soLuongYC) || 0,
            donVi: d.donVi,
            donGia: Number(d.donGia) || 0,
            tenNCC: d.tenNCC || "N/A"
          }));
          keys.push(key);
        }
      }

      setPurchaseRequestsData(safeData);
      setPurchaseRequests(keys);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Lấy chi tiết khi chọn phiếu
  useEffect(() => {
    if (!maPhieuMuaNVL) {
      setDetails([]);
      return;
    }
    setLoading(true);
    setError(null);

    const data = purchaseRequestsData[maPhieuMuaNVL] || [];
    setDetails(data);
    setLoading(false);
  }, [maPhieuMuaNVL, purchaseRequestsData]);

  const handleSave = async () => {
    if (!maPhieuMuaNVL) {
      setError("Vui lòng chọn một phiếu mua hàng");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/warehouse/materials/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maPhieuMuaNVL })
      });

      if (!res.ok) {
        throw new Error((await res.json()).error || "Lỗi server");
      }

      const result = await res.json();

      toast({
        title: "Nhập kho thành công",
        description: result.message,
      });

      const newRequests = purchaseRequests.filter(p => p !== maPhieuMuaNVL);
      setPurchaseRequests(newRequests);
      setMaPhieuMuaNVL("");
      setDetails([]);

      await new Promise((r) => setTimeout(r, 800));
      // Nếu có trang list, redirect đến đó; nếu không, giữ nguyên hoặc refresh
      // router.push("/warehouse/raw-materials/import/list"); // Uncomment nếu có

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const groupedByNCC = details.reduce<Record<string, PurchaseDetail[]>>((acc, item) => {
    if (!acc[item.tenNCC]) acc[item.tenNCC] = [];
    acc[item.tenNCC].push(item);
    return acc;
  }, {});

  const tongGiaTri = details.reduce((sum, item) => sum + item.soLuongYC * item.donGia, 0);

  // Kiểm tra quyền
  if (error && user?.role !== "warehouse_raw") {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar /> {/* Sử dụng sidebar chung */}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Nhập Kho Nguyên Vật Liệu</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Chọn phiếu mua hàng để nhập kho
              </p>
            </div>

            <Card>
              
              <CardContent className="space-y-6">
                {loadingRequests ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Đang tải danh sách phiếu mua...
                  </div>
                ) : purchaseRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={64} className="mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-semibold mb-2">
                      Không có phiếu mua hàng nào
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Hiện tại chưa có phiếu mua hàng nào để nhập kho.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/warehouse/raw-materials/request-purchase")}
                    >
                      Tạo Phiếu Đề Xuất Mua
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Chọn phiếu mua hàng
                      </label>
                      <Select value={maPhieuMuaNVL} onValueChange={setMaPhieuMuaNVL}>
                        <SelectTrigger>
                          <SelectValue placeholder="-- Chọn phiếu mua --" />
                        </SelectTrigger>
                        <SelectContent>
                          {purchaseRequests.map(pr => (
                            <SelectItem key={pr} value={pr}>
                              Phiếu mua {pr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {maPhieuMuaNVL && (
                      <>
                        {loading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="ml-3 text-muted-foreground">Đang tải...</span>
                          </div>
                        ) : details.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                            Không có nguyên vật liệu nào
                          </div>
                        ) : (
                          <>
                            {Object.entries(groupedByNCC).map(([ncc, items]) => (
                              <div key={ncc}>
                                <h3 className="font-semibold text-lg mb-3 pb-2 border-b">
                                  Nhà Cung Cấp: {ncc}
                                </h3>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/50">
                                      <tr>
                                        <th className="py-3 px-4 text-left font-medium">Mã NVL</th>
                                        <th className="py-3 px-4 text-left font-medium">Tên NVL</th>
                                        <th className="py-3 px-4 text-right font-medium">Số lượng</th>
                                        <th className="py-3 px-4 text-right font-medium">Đơn giá</th>
                                        <th className="py-3 px-4 text-right font-medium">Thành tiền</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {items.map((item, idx) => (
                                        <tr key={idx} className="border-b hover:bg-muted/30">
                                          <td className="py-3 px-4">{item.maNVL}</td>
                                          <td className="py-3 px-4">{item.tenNVL}</td>
                                          <td className="py-3 px-4 text-right">
                                            {item.soLuongYC} {item.donVi}
                                          </td>
                                          <td className="py-3 px-4 text-right">
                                            {item.donGia.toLocaleString("vi-VN")} đ
                                          </td>
                                          <td className="py-3 px-4 text-right font-medium">
                                            {(item.soLuongYC * item.donGia).toLocaleString("vi-VN")} đ
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ))}

                            <div className="pt-4 border-t">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Tổng giá trị:</span>
                                <span className="text-2xl font-bold text-primary">
                                  {tongGiaTri.toLocaleString("vi-VN")} đ
                                </span>
                              </div>
                            </div>

                            {error && (
                              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="text-red-600" size={20} />
                                <p className="text-red-800">{error}</p>
                              </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setMaPhieuMuaNVL("");
                                  setDetails([]);
                                }}
                                disabled={isSaving}
                              >
                                Hủy
                              </Button>
                              <Button
                                onClick={handleSave}
                                disabled={isSaving}
                              >
                                {isSaving ? "Đang lưu..." : "💾 Lưu phiếu nhập kho"}
                              </Button>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}