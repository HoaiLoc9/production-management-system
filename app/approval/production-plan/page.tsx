"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const pendingApprovals = [
  {
    id: 1,
    code: "PP-2025-003",
    product: "Ghế Gỗ",
    quantity: 200,
    submittedBy: "Nguyễn Văn A",
    date: "2025-01-20",
  },
  {
    id: 2,
    code: "PP-2025-004",
    product: "Bàn Gỗ",
    quantity: 100,
    submittedBy: "Trần Văn B",
    date: "2025-01-19",
  },
]

export default function ApprovalProductionPlanPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Phê Duyệt Kế Hoạch Sản Xuất</h1>
        <p className="text-muted-foreground mt-2">Phê duyệt các kế hoạch sản xuất chờ xử lý</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Chờ Phê Duyệt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="border border-border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{approval.code}</p>
                  <p className="text-sm text-muted-foreground">
                    {approval.product} - {approval.quantity} cái
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gửi bởi: {approval.submittedBy} - {approval.date}
                  </p>
                </div>
                <div className="flex gap-2">
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
