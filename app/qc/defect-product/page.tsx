"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const defects = [
  {
    id: 1,
    product: "Ghế Gỗ",
    defect: "Vết nứt",
    severity: "high",
    date: "2025-01-20",
  },
  {
    id: 2,
    product: "Bàn Gỗ",
    defect: "Bề mặt không trơn",
    severity: "medium",
    date: "2025-01-19",
  },
]

export default function DefectProductPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">QC - Lỗi Sản Phẩm</h1>
          <p className="text-muted-foreground mt-2">Quản lý lỗi sản phẩm</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Ghi Nhận Lỗi
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Lỗi Sản Phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Sản Phẩm</th>
                  <th className="text-left py-3 px-4 font-medium">Loại Lỗi</th>
                  <th className="text-left py-3 px-4 font-medium">Mức Độ</th>
                  <th className="text-left py-3 px-4 font-medium">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {defects.map((defect) => (
                  <tr key={defect.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">{defect.product}</td>
                    <td className="py-3 px-4">{defect.defect}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          defect.severity === "high" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {defect.severity === "high" ? "Cao" : "Trung Bình"}
                      </span>
                    </td>
                    <td className="py-3 px-4">{defect.date}</td>
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
