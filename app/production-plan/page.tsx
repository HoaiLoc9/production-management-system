"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"

const defaultPlans = [
  { id: 1, code: "PP-2025-001", product: "Ghế Gỗ", quantity: 100, startDate: "2025-01-01", endDate: "2025-01-15", status: "completed" },
  { id: 2, code: "PP-2025-002", product: "Bàn Gỗ", quantity: 50, startDate: "2025-01-16", endDate: "2025-01-31", status: "in-progress" },
]

const orders = [
  { id: "DH-2025-001", customer: "Công ty Minh Tâm", product: "Ghế gỗ", quantity: 150, deliveryDate: "2025-11-15", status: "Đang lên kế hoạch" },
  { id: "DH-2025-002", customer: "Công ty Đức Việt", product: "Bàn gỗ, ghế gỗ", quantity: 80, deliveryDate: "2025-11-20", status: "Chưa lên kế hoạch" },
  { id: "DH-2025-003", customer: "Doanh nghiệp Tân Phát", product: "Bàn gỗ, ghế gỗ", quantity: 40, deliveryDate: "2025-12-05", status: "Đang xử lý" },
  { id: "DH-2025-004", customer: "Công ty Đại Lộc", product: "Ghế gỗ", quantity: 100, deliveryDate: "2025-12-10", status: "Chờ duyệt" },
]

export default function ProductionPlanPage() {
  const [plans, setPlans] = useState(defaultPlans)

  // 🔹 Lấy kế hoạch từ localStorage khi load trang
  useEffect(() => {
    const savedPlans = JSON.parse(localStorage.getItem("productionPlans") || "[]")
    if (savedPlans.length > 0) {
      setPlans([...defaultPlans, ...savedPlans])
    }
  }, [])

  // 🔹 Hàm xóa kế hoạch
  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa kế hoạch này không?")) {
      const updated = plans.filter((p) => p.id !== id)

      // Xóa trong localStorage (chỉ xóa những kế hoạch thêm mới)
      const savedPlans = JSON.parse(localStorage.getItem("productionPlans") || "[]")
      const updatedSaved = savedPlans.filter((p: any) => p.id !== id)
      localStorage.setItem("productionPlans", JSON.stringify(updatedSaved))

      setPlans(updated)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kế Hoạch Sản Xuất</h1>
          <p className="text-muted-foreground mt-2">Quản lý các kế hoạch sản xuất</p>
        </div>
        <Link href="/production-plan/add">
          <Button className="gap-2">
            <Plus size={18} />
            Thêm Kế Hoạch
          </Button>
        </Link>
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
                  <th className="text-left py-3 px-4 font-medium">Sản Phẩm</th>
                  <th className="text-left py-3 px-4 font-medium">Số Lượng</th>
                  <th className="text-left py-3 px-4 font-medium">Ngày Bắt Đầu</th>
                  <th className="text-left py-3 px-4 font-medium">Ngày Kết Thúc</th>
                  <th className="text-left py-3 px-4 font-medium">Trạng Thái</th>
                  <th className="text-left py-3 px-4 font-medium">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">{plan.code}</td>
                    <td className="py-3 px-4">{plan.product}</td>
                    <td className="py-3 px-4">{plan.quantity}</td>
                    <td className="py-3 px-4">{plan.startDate}</td>
                    <td className="py-3 px-4">{plan.endDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          plan.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {plan.status === "completed" ? "Hoàn Thành" : "Đang Thực Hiện"}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <Link href={`/production-plan/edit/${plan.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(plan.id)}>
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </td>
                  </tr>
                ))}
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
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.product}</td>
                    <td className="py-3 px-4">{order.quantity}</td>
                    <td className="py-3 px-4">{order.deliveryDate}</td>
                    <td className="py-3 px-4">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
