"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const assignments = [
  {
    id: 1,
    worker: "Nguyễn Văn A",
    task: "Cắt gỗ",
    status: "in-progress",
    date: "2025-01-20",
  },
  {
    id: 2,
    worker: "Trần Văn B",
    task: "Lắp ráp",
    status: "completed",
    date: "2025-01-19",
  },
]

export default function WorkAssignmentPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Phân Công Công Việc</h1>
          <p className="text-muted-foreground mt-2">Quản lý phân công và chấm công</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Phân Công Mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Phân Công</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Công Nhân</th>
                  <th className="text-left py-3 px-4 font-medium">Công Việc</th>
                  <th className="text-left py-3 px-4 font-medium">Ngày</th>
                  <th className="text-left py-3 px-4 font-medium">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">{assignment.worker}</td>
                    <td className="py-3 px-4">{assignment.task}</td>
                    <td className="py-3 px-4">{assignment.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          assignment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {assignment.status === "completed" ? "Hoàn Thành" : "Đang Thực Hiện"}
                      </span>
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
