"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"

const defaultOrders = [
  { id: 1, code: "DH-2025-001", customer: "Công ty Minh Tâm", product: "Ghế Gỗ", quantity: 150, deliveryDate: "2025-11-15", status: "Chưa lên kế hoạch" },
  { id: 2, code: "DH-2025-002", customer: "Cửa hàng Nội thất Việt", product: "Bàn Gỗ", quantity: 80, deliveryDate: "2025-11-20", status: "Chưa lên kế hoạch" },
  { id: 3, code: "DH-2025-003", customer: "Doanh nghiệp Tân Phát", product: "Ghế Gỗ, Bàn Gỗ", quantity: 40, deliveryDate: "2025-12-05", status: "Chưa lên kế hoạch" },
  { id: 4, code: "DH-2025-004", customer: "Công ty Đại Lộc", product: "Bàn Gỗ", quantity: 100, deliveryDate: "2025-12-10", status: "Chưa lên kế hoạch" },
  { id: 5, code: "DH-2025-005", customer: "Showroom Phúc Gia", product: "Ghế Gỗ", quantity: 75, deliveryDate: "2025-12-15", status: "Chưa lên kế hoạch" },
  { id: 6, code: "DH-2025-006", customer: "Công ty TNHH Hòa Bình", product: "Ghế Gỗ, Bàn Gỗ", quantity: 200, deliveryDate: "2025-12-20", status: "Chưa lên kế hoạch" },
  { id: 7, code: "DH-2025-007", customer: "Khách sạn Ánh Dương", product: "Bàn Gỗ", quantity: 60, deliveryDate: "2025-12-25", status: "Chưa lên kế hoạch" },
  { id: 8, code: "DH-2025-008", customer: "Trường Đại học Kinh tế", product: "Ghế Gỗ", quantity: 300, deliveryDate: "2026-01-05", status: "Chưa lên kế hoạch" },
  { id: 9, code: "DH-2025-009", customer: "Nhà hàng Sài Gòn Xưa", product: "Ghế Gỗ, Bàn Gỗ", quantity: 120, deliveryDate: "2026-01-10", status: "Chưa lên kế hoạch" },
]

export default function ProductionPlanPage() {
  const [plans, setPlans] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const savedPlans = JSON.parse(localStorage.getItem("productionPlans") || "[]")
    setPlans(savedPlans)

    // Khởi tạo orders nếu chưa có
    const savedOrders = localStorage.getItem("orders")
    if (!savedOrders) {
      localStorage.setItem("orders", JSON.stringify(defaultOrders))
      setOrders(defaultOrders)
    } else {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  const handleDeletePlan = (id) => {
    if (confirm("Bạn có chắc muốn xóa kế hoạch này không?")) {
      const planToDelete = plans.find(p => p.id === id)
      const updated = plans.filter((p) => p.id !== id)
      localStorage.setItem("productionPlans", JSON.stringify(updated))
      setPlans(updated)

      // Khôi phục đơn hàng về trạng thái "Chưa lên kế hoạch"
      if (planToDelete) {
        const updatedOrders = orders.map(order => {
          if (order.code === planToDelete.orderCode) {
            return { ...order, status: "Chưa lên kế hoạch" }
          }
          return order
        })
        localStorage.setItem("orders", JSON.stringify(updatedOrders))
        setOrders(updatedOrders)
      }
    }
  }

  const handleDeleteOrder = (id) => {
    if (confirm("Bạn có chắc muốn xóa đơn hàng này không?")) {
      const updated = orders.filter((o) => o.id !== id)
      localStorage.setItem("orders", JSON.stringify(updated))
      setOrders(updated)
    }
  }

  const handleAddPlan = () => {
    window.location.href = "/production-plan/add"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kế Hoạch Sản Xuất</h1>
          <p className="text-muted-foreground mt-2">Quản lý các kế hoạch sản xuất</p>
        </div>
        <Button onClick={handleAddPlan} className="gap-2">
          <Plus size={18} />
          Thêm Kế Hoạch
        </Button>
      </div>

      {/* --- BẢNG KẾ HOẠCH --- */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Kế Hoạch Sản Xuất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-100">
                  <th className="text-left py-3 px-4 font-medium">Mã Kế Hoạch</th>
                  <th className="text-left py-3 px-4 font-medium">Mã Đơn Hàng</th>
                  <th className="text-left py-3 px-4 font-medium">Khách Hàng</th>
                  <th className="text-left py-3 px-4 font-medium">Sản Phẩm</th>
                  <th className="text-left py-3 px-4 font-medium">Số Lượng</th>
                  <th className="text-left py-3 px-4 font-medium">Xưởng</th>
                  <th className="text-left py-3 px-4 font-medium">Ngày Bắt Đầu</th>
                  <th className="text-left py-3 px-4 font-medium">Ngày Giao</th>
                  <th className="text-left py-3 px-4 font-medium">Trạng Thái</th>
                  <th className="text-left py-3 px-4 font-medium">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {plans.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-muted-foreground">
                      Chưa có kế hoạch sản xuất nào
                    </td>
                  </tr>
                ) : (
                  plans.map((plan) => (
                    <tr key={plan.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{plan.code}</td>
                      <td className="py-3 px-4">{plan.orderCode}</td>
                      <td className="py-3 px-4">{plan.customer}</td>
                      <td className="py-3 px-4">{plan.product}</td>
                      <td className="py-3 px-4">{plan.quantity}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {plan.workshop || "Chưa chọn"}
                        </span>
                      </td>
                      <td className="py-3 px-4">{plan.startDate}</td>
                      <td className="py-3 px-4">{plan.endDate}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            plan.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}>
                          {plan.status === "completed" ? "Hoàn Thành" : "Đang Thực Hiện"}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => window.location.href = `/production-plan/edit/${plan.id}`}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* --- BẢNG ĐƠN HÀNG --- */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Đơn Hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-100">
                  <th className="text-left py-3 px-4 font-medium">Mã Đơn Hàng</th>
                  <th className="text-left py-3 px-4 font-medium">Khách Hàng</th>
                  <th className="text-left py-3 px-4 font-medium">Sản Phẩm</th>
                  <th className="text-left py-3 px-4 font-medium">Số Lượng</th>
                  <th className="text-left py-3 px-4 font-medium">Ngày Giao</th>
                  <th className="text-left py-3 px-4 font-medium">Trạng Thái</th>
                  <th className="text-left py-3 px-4 font-medium">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      Không có đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{order.code}</td>
                      <td className="py-3 px-4">{order.customer}</td>
                      <td className="py-3 px-4">{order.product}</td>
                      <td className="py-3 px-4">{order.quantity}</td>
                      <td className="py-3 px-4">{order.deliveryDate}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "Đã lên kế hoạch" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteOrder(order.id)}>
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}