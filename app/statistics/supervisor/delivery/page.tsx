"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle, Package, Factory } from "lucide-react";
import { toast } from "@/hooks/use-toast";


interface DeliveryOrderDetail {
  id: string;
  code: string;
  customer: string;
  createdAt: string;
  totalAmount: number;
  totalDeposit: number;
  status: string;
  workshop: string;
}

interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
  price: number;
  deposit: number;
}

export default function DeliveryOrderPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState<DeliveryOrderDetail[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrderDetail | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<OrderProduct[]>([]);

   // ---- KIỂM TRA LOGIN & QUYỀN ----
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (user?.role !== "supervisor") {
      setError("Chỉ xưởng trưởng mới có quyền lập phiếu giao thành phẩm");
      setTimeout(() => router.push("/dashboard/statistics"), 1500);
    }
  }, [user, isAuthenticated, router]);

  // Lấy danh sách phiếu giao
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await fetch(`/api/workshop/delivery?supervisorEmail=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Lỗi khi lấy danh sách phiếu giao");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Khi chọn phiếu
  useEffect(() => {
    if (!selectedOrderId) {
      setSelectedOrder(null);
      setProducts([]);
      return;
    }
    setLoadingDetails(true);
    const order = orders.find(o => o.id === selectedOrderId) || null;
    setSelectedOrder(order);
    
    // Lấy chi tiết sản phẩm từ API
    const fetchProducts = async () => {
      try {
        console.log("Fetching products for planCode:", selectedOrderId);
        const res = await fetch(`/api/workshop/delivery?planCode=${selectedOrderId}`);
        const data = await res.json();
        console.log("Response status:", res.status);
        console.log("Response data:", data);
        
        if (!res.ok) {
          throw new Error(data.error || "Lỗi khi lấy sản phẩm");
        }
        
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err: any) {
        console.error("Lỗi khi lấy sản phẩm:", err.message);
        setProducts([]);
      } finally {
        setLoadingDetails(false);
      }
    };
    
    fetchProducts();
  }, [selectedOrderId, orders]);

  const handleSave = async () => {
    if (!selectedOrderId) {
      setError("Vui lòng chọn một phiếu giao");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/workshop/delivery/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: selectedOrderId })
      });

      if (!res.ok) {
        throw new Error((await res.json()).error || "Lỗi server");
      }

      const result = await res.json();
      toast({
        title: "Phiếu giao thành phẩm đã được lập",
        description: result.message,
      });

      setOrders(prev => prev.filter(o => o.id !== selectedOrderId));
      setSelectedOrderId("");
      setSelectedOrder(null);
      setProducts([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
  

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Lập Phiếu Giao Thành Phẩm</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Chọn phiếu giao để lập phiếu thành phẩm
              </p>
            </div>

            <Card>
              <CardContent className="space-y-6 pt-6">
                {loadingOrders ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Đang tải danh sách phiếu giao...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={64} className="mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-semibold mb-2">Không có phiếu giao nào</h3>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Chọn phiếu giao</label>
                      <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                        <SelectTrigger>
                          <SelectValue placeholder="-- Chọn phiếu giao --" />
                        </SelectTrigger>
                        <SelectContent>
                          {orders.map(o => (
                            <SelectItem key={o.id} value={o.id}>
                              {o.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedOrderId && (
                      <>
                        {loadingDetails ? (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="ml-3 text-muted-foreground">Đang tải chi tiết...</span>
                          </div>
                        ) : selectedOrder ? (
                          <div className="space-y-6">
                            {/* Thông tin chung */}
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                              <h3 className="font-semibold mb-4">Thông tin đơn hàng</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Mã phiếu</p>
                                  <p className="font-semibold">{selectedOrder.code}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Khách hàng</p>
                                  <p className="font-semibold">{selectedOrder.customer}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Ngày lập kế hoạch</p>
                                  <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                                  <p className="font-semibold">{selectedOrder.status === 'running' ? '🔄 Đang sản xuất' : selectedOrder.status}</p>
                                </div>
                              </div>
                            </div>

                            {/* Thông tin xưởng */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2 mb-3">
                                <Factory className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-blue-900">Xưởng phụ trách</h3>
                              </div>
                              <p className="font-bold text-lg text-blue-900">{selectedOrder.workshop}</p>
                            </div>

                            {/* Danh sách sản phẩm */}
                            {products.length > 0 && (
                              <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <h3 className="font-semibold mb-4">Chi tiết sản phẩm</h3>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="border-b border-slate-200">
                                        <th className="text-left py-2 px-3 font-semibold">Sản phẩm</th>
                                        <th className="text-center py-2 px-3 font-semibold">Số lượng</th>
                                        <th className="text-right py-2 px-3 font-semibold">Đơn giá</th>
                                  
                                        <th className="text-right py-2 px-3 font-semibold">Thành tiền</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {products.map((product) => (
                                        <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                                          <td className="py-3 px-3">{product.name}</td>
                                          <td className="text-center py-3 px-3">{product.quantity}</td>
                                          <td className="text-right py-3 px-3">{Number(product.price).toLocaleString('vi-VN')} đ</td>

                                          <td className="text-right py-3 px-3 font-semibold">{Number(product.price * product.quantity).toLocaleString('vi-VN')} đ</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Tóm tắt tài chính */}
                            <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-300">
                              <h3 className="font-semibold mb-3">Thanh toán</h3>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white p-3 rounded border border-blue-200">
                                  <p className="text-sm text-muted-foreground">Tổng giá trị đơn hàng</p>
                                  <p className="text-2xl font-bold text-blue-600">
                                    {Number(selectedOrder.totalAmount).toLocaleString('vi-VN')} đ
                                  </p>
                                </div>
                                <div className="bg-white p-3 rounded border border-green-200">
                                  <p className="text-sm text-muted-foreground">Tổng tiền cọc</p>
                                  <p className="text-2xl font-bold text-green-600">
                                    {Number(selectedOrder.totalDeposit).toLocaleString('vi-VN')} đ
                                  </p>
                                </div>
                                <div className="bg-white p-3 rounded border border-orange-200">
                                  <p className="text-sm text-muted-foreground">Số tiền cần trả</p>
                                  <p className="text-2xl font-bold text-orange-600">
                                    {Number(selectedOrder.totalAmount - selectedOrder.totalDeposit).toLocaleString('vi-VN')} đ
                                  </p>
                                </div>
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
                                  setSelectedOrderId("");
                                  setSelectedOrder(null);
                                  setProducts([]);
                                }}
                                disabled={isSaving}
                              >
                                Hủy
                              </Button>
                              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                                {isSaving ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang lưu...
                                  </>
                                ) : (
                                  <>💾 Lập phiếu giao</>
                                )}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12 text-muted-foreground">
                            Không tìm thấy chi tiết phiếu
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
 
  );
}