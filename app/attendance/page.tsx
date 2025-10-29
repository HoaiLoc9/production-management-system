"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const attendanceRecords = [
  {
    id: 1,
    worker: "Nguyễn Văn A",
    date: "2025-01-20",
    checkIn: "08:00",
    checkOut: "17:00",
    status: "present",
  },
  {
    id: 2,
    worker: "Trần Văn B",
    date: "2025-01-20",
    checkIn: "08:15",
    checkOut: "17:00",
    status: "late",
  },
]

export default function AttendancePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chấm Công</h1>
          <p className="text-muted-foreground mt-2">Quản lý chấm công công nhân</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Ghi Chấm Công
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Chấm Công</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Công Nhân</th>
                  <th className="text-left py-3 px-4 font-medium">Ngày</th>
                  <th className="text-left py-3 px-4 font-medium">Vào</th>
                  <th className="text-left py-3 px-4 font-medium">Ra</th>
                  <th className="text-left py-3 px-4 font-medium">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">{record.worker}</td>
                    <td className="py-3 px-4">{record.date}</td>
                    <td className="py-3 px-4">{record.checkIn}</td>
                    <td className="py-3 px-4">{record.checkOut}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === "present" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {record.status === "present" ? "Có Mặt" : "Muộn"}
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
