"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const pendingPurchases = [
  {
    id: 1,
    code: "PUR-2025-001",
    material: "Gỗ Tần Bì",
    quantity: 500,
    supplier: "Công ty ABC",
    submittedBy: "Nguyễn Văn A",
    date: "2025-01-20",
    estimatedCost: "50,000,000 VND",
  },
  {
    id: 2,
    code: "PUR-2025-002",
    material: "Vải Linen",
    quantity: 200,
    supplier: "Công ty XYZ",
    submittedBy: "Trần Văn B",
    date: "2025-01-19",
    estimatedCost: "20,000,000 VND",
  },
]

export default function ApprovalPurchasePlanPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Phê Duyệt Kế Hoạch Mua Hàng</h1>
        <p className="text-muted-foreground mt-2">Phê duyệt các kế hoạch mua hàng chờ xử lý</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Chờ Phê Duyệt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingPurchases.map((purchase) => (
              <div key={purchase.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{purchase.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {purchase.material} - {purchase.quantity} {purchase.material === "Gỗ Tần Bì" ? "kg" : "m"}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-primary">{purchase.estimatedCost}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nhà Cung Cấp</p>
                    <p className="font-medium">{purchase.supplier}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gửi Bởi</p>
                    <p className="font-medium">{purchase.submittedBy}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ngày Gửi</p>
                    <p className="font-medium">{purchase.date}</p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline">Từ Chối</Button>
                  <Button className="bg-primary text-primary-foreground">Phê Duyệt</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
