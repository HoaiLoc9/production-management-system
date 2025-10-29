"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const myAssignments = [
  {
    id: 1,
    task: "Cắt gỗ",
    description: "Cắt gỗ cho 50 chiếc ghế",
    startDate: "2025-01-20",
    endDate: "2025-01-22",
    status: "in-progress",
    progress: 60,
  },
  {
    id: 2,
    task: "Lắp ráp",
    description: "Lắp ráp 30 chiếc ghế",
    startDate: "2025-01-23",
    endDate: "2025-01-25",
    status: "pending",
    progress: 0,
  },
]

export default function ViewAssignmentPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Công Việc Của Tôi</h1>
        <p className="text-muted-foreground mt-2">Xem các công việc được phân công cho bạn</p>
      </div>

      <div className="space-y-4">
        {myAssignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{assignment.task}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                </div>
                <Badge
                  variant={assignment.status === "in-progress" ? "default" : "secondary"}
                  className={assignment.status === "in-progress" ? "bg-blue-600" : ""}
                >
                  {assignment.status === "in-progress" ? "Đang Thực Hiện" : "Chờ Xử Lý"}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tiến Độ</span>
                  <span className="font-medium">{assignment.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${assignment.progress}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Ngày Bắt Đầu</p>
                    <p className="font-medium">{assignment.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ngày Kết Thúc</p>
                    <p className="font-medium">{assignment.endDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
