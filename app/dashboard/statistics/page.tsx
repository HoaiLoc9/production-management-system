"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const productionData = [
  { month: "T1", produced: 400, target: 500 },
  { month: "T2", produced: 450, target: 500 },
  { month: "T3", produced: 480, target: 500 },
  { month: "T4", produced: 520, target: 500 },
  { month: "T5", produced: 550, target: 500 },
  { month: "T6", produced: 600, target: 500 },
]

const qualityData = [
  { week: "Tuần 1", defect_rate: 2.5 },
  { week: "Tuần 2", defect_rate: 2.1 },
  { week: "Tuần 3", defect_rate: 1.8 },
  { week: "Tuần 4", defect_rate: 1.5 },
]

export default function StatisticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Thống Kê Sản Xuất</h1>
        <p className="text-muted-foreground mt-2">Tổng quan về hiệu suất sản xuất</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sản Lượng Tháng Này</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">600</div>
            <p className="text-xs text-green-600 mt-1">+20% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tỷ Lệ Lỗi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.5%</div>
            <p className="text-xs text-green-600 mt-1">-1% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Công Nhân Hoạt Động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground mt-1">Tất cả đang làm việc</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kế Hoạch Hoàn Thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-green-600 mt-1">+5% so với tuần trước</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sản Lượng vs Kế Hoạch</CardTitle>
            <CardDescription>Biểu đồ so sánh sản lượng thực tế với kế hoạch</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="produced" fill="hsl(var(--color-primary))" name="Sản Lượng Thực Tế" />
                <Bar dataKey="target" fill="hsl(var(--color-muted))" name="Kế Hoạch" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tỷ Lệ Lỗi Theo Tuần</CardTitle>
            <CardDescription>Xu hướng tỷ lệ lỗi sản phẩm</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={qualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="defect_rate" stroke="hsl(var(--color-primary))" name="Tỷ Lệ Lỗi (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
