"use client"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"

const productionPlans = [
  {
    id: 1,
    code: "PP-2025-001",
    product: "Ghế Gỗ",
    quantity: 100,
    startDate: "2025-01-01",
    endDate: "2025-01-15",
    status: "completed",
  },
  {
    id: 2,
    code: "PP-2025-002",
    product: "Bàn Gỗ",
    quantity: 50,
    startDate: "2025-01-16",
    endDate: "2025-01-31",
    status: "in-progress",
  },
]

export default function ProductionPlanPage() {
  return (
    <div className="p-6 space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Kế Hoạch Sản Xuất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
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
                {productionPlans.map((plan) => (
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
                      <Button variant="ghost" size="sm">
                        <Trash2 size={16} />
                      </Button>
                    </td>
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
