"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const requests = [
  {
    id: 1,
    code: "WR-2025-001",
    type: "Xuất Kho",
    material: "Gỗ",
    quantity: 50,
    status: "pending",
    date: "2025-01-20",
  },
  {
    id: 2,
    code: "WR-2025-002",
    type: "Nhập Kho",
    material: "Vải",
    quantity: 100,
    status: "approved",
    date: "2025-01-19",
  },
]

export default function WarehouseRequestPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Phiếu Yêu Cầu Kho</h1>
          <p className="text-muted-foreground mt-2">Quản lý phiếu yêu cầu kho</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Tạo Phiếu Mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Phiếu Yêu Cầu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Mã Phiếu</th>
                  <th className="text-left py-3 px-4 font-medium">Loại</th>
                  <th className="text-left py-3 px-4 font-medium">Nguyên Vật Liệu</th>
                  <th className="text-left py-3 px-4 font-medium">Số Lượng</th>
                  <th className="text-left py-3 px-4 font-medium">Trạng Thái</th>
                  <th className="text-left py-3 px-4 font-medium">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">{request.code}</td>
                    <td className="py-3 px-4">{request.type}</td>
                    <td className="py-3 px-4">{request.material}</td>
                    <td className="py-3 px-4">{request.quantity}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status === "approved" ? "Phê Duyệt" : "Chờ Duyệt"}
                      </span>
                    </td>
                    <td className="py-3 px-4">{request.date}</td>
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
