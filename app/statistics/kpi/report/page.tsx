"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function KPIReportPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Báo Cáo KPI</h1>
          <p className="text-muted-foreground mt-2">Báo cáo chi tiết về các chỉ số hiệu suất</p>
        </div>
        <Button className="gap-2">
          <Download size={18} />
          Tải Báo Cáo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Báo Cáo Tháng 1/2025</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Sản Lượng</p>
              <p className="text-2xl font-bold mt-2">600 cái</p>
              <p className="text-xs text-green-600 mt-1">+20% so với kế hoạch</p>
            </div>

            <div className="border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Tỷ Lệ Lỗi</p>
              <p className="text-2xl font-bold mt-2">1.5%</p>
              <p className="text-xs text-green-600 mt-1">-1% so với tháng trước</p>
            </div>

            <div className="border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Hiệu Suất Lao Động</p>
              <p className="text-2xl font-bold mt-2">95%</p>
              <p className="text-xs text-green-600 mt-1">+5% so với tuần trước</p>
            </div>

            <div className="border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Chi Phí Sản Xuất</p>
              <p className="text-2xl font-bold mt-2">2.5M VND</p>
              <p className="text-xs text-green-600 mt-1">-10% so với dự toán</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
