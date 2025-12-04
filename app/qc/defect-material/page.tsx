"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const materialDefects = [
  {
    id: 1,
    material: "Gỗ Tần Bì",
    defect: "Mục nước",
    severity: "high",
    quantity: 10,
    date: "2025-01-20",
  },
  {
    id: 2,
    material: "Vải Linen",
    defect: "Sợi lỏng",
    severity: "medium",
    quantity: 5,
    date: "2025-01-19",
  },
]

export default function DefectMaterialPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">QC - Lỗi Nguyên Vật Liệu</h1>
          <p className="text-muted-foreground mt-2">Quản lý lỗi nguyên vật liệu</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Ghi Nhận Lỗi
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Lỗi Nguyên Vật Liệu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Nguyên Vật Liệu</th>
                  <th className="text-left py-3 px-4 font-medium">Loại Lỗi</th>
                  <th className="text-left py-3 px-4 font-medium">Mức Độ</th>
                  <th className="text-left py-3 px-4 font-medium">Số Lượng</th>
                  <th className="text-left py-3 px-4 font-medium">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {materialDefects.map((defect) => (
                  <tr key={defect.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">{defect.material}</td>
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
                    <td className="py-3 px-4">{defect.quantity}</td>
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