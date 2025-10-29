"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "warning",
    title: "Kế hoạch sắp hết hạn",
    message: "Kế hoạch PP-2025-002 sắp hết hạn vào ngày 31/01/2025",
    date: "2025-01-20 10:30",
    read: false,
  },
  {
    id: 2,
    type: "success",
    title: "Kế hoạch hoàn thành",
    message: "Kế hoạch PP-2025-001 đã hoàn thành thành công",
    date: "2025-01-19 15:45",
    read: true,
  },
  {
    id: 3,
    type: "info",
    title: "Phê duyệt mới",
    message: "Có 2 phiếu yêu cầu chờ phê duyệt",
    date: "2025-01-19 09:00",
    read: true,
  },
]

export default function NotificationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Thông Báo</h1>
        <p className="text-muted-foreground mt-2">Quản lý các thông báo của bạn</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Thông Báo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon =
                notification.type === "warning" ? AlertCircle : notification.type === "success" ? CheckCircle : Info

              return (
                <div
                  key={notification.id}
                  className={`border border-border rounded-lg p-4 flex gap-4 ${
                    !notification.read ? "bg-muted/50" : ""
                  }`}
                >
                  <div
                    className={`flex-shrink-0 p-2 rounded-lg ${
                      notification.type === "warning"
                        ? "bg-yellow-100"
                        : notification.type === "success"
                          ? "bg-green-100"
                          : "bg-blue-100"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={
                        notification.type === "warning"
                          ? "text-yellow-600"
                          : notification.type === "success"
                            ? "text-green-600"
                            : "text-blue-600"
                      }
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{notification.title}</h3>
                      {!notification.read && <Badge className="bg-primary">Mới</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.date}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
