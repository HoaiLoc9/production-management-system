<<<<<<< HEAD
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
=======
"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
>>>>>>> origin/PhanHongLieu
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
<<<<<<< HEAD
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
=======
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC"];

// ========== DEMO DATA ==========
// Dữ liệu có thể thay đổi theo tháng/quý/năm
const demoData = {
  month: {
    materials: {
      wood: [
        { name: "Gỗ sồi", used: 120, errorRate: 2.0 },
        { name: "Gỗ thông", used: 95, errorRate: 3.2 },
        { name: "Gỗ keo", used: 75, errorRate: 1.5 },
        { name: "Gỗ xoan", used: 65, errorRate: 2.8 },
      ],
      accessories: [
        { name: "Ốc vít", used: 200, errorRate: 0.5 },
        { name: "Bản lề", used: 130, errorRate: 1.1 },
        { name: "Ke sắt", used: 100, errorRate: 1.8 },
        { name: "Sơn PU", used: 90, errorRate: 0.9 },
        { name: "Keo dán", used: 60, errorRate: 1.3 },
        { name: "Nút cao su", used: 80, errorRate: 0.7 },
      ],
    },
    products: [
      { name: "Bàn học", produced: 55, errorRate: 1.8 },
      { name: "Ghế gỗ", produced: 80, errorRate: 2.5 },
      { name: "Ghế xoay", produced: 70, errorRate: 1.3 },
      { name: "Tủ gỗ", produced: 45, errorRate: 3.0 },
      { name: "Kệ sách", produced: 40, errorRate: 0.9 },
      { name: "Giường ngủ", produced: 35, errorRate: 2.2 },
    ],
  },
  quarter: {
    materials: {
      wood: [
        { name: "Gỗ sồi", used: 320, errorRate: 1.9 },
        { name: "Gỗ thông", used: 295, errorRate: 2.5 },
        { name: "Gỗ keo", used: 240, errorRate: 1.3 },
        { name: "Gỗ xoan", used: 220, errorRate: 2.1 },
      ],
      accessories: [
        { name: "Ốc vít", used: 600, errorRate: 0.4 },
        { name: "Bản lề", used: 350, errorRate: 1.0 },
        { name: "Ke sắt", used: 310, errorRate: 1.5 },
        { name: "Sơn PU", used: 270, errorRate: 0.8 },
        { name: "Keo dán", used: 180, errorRate: 1.2 },
        { name: "Nút cao su", used: 210, errorRate: 0.6 },
      ],
    },
    products: [
      { name: "Bàn học", produced: 160, errorRate: 1.5 },
      { name: "Ghế gỗ", produced: 220, errorRate: 2.0 },
      { name: "Ghế xoay", produced: 180, errorRate: 1.1 },
      { name: "Tủ gỗ", produced: 130, errorRate: 2.5 },
      { name: "Kệ sách", produced: 110, errorRate: 0.8 },
      { name: "Giường ngủ", produced: 100, errorRate: 1.8 },
    ],
  },
  year: {
    materials: {
      wood: [
        { name: "Gỗ sồi", used: 1400, errorRate: 2.2 },
        { name: "Gỗ thông", used: 1200, errorRate: 2.8 },
        { name: "Gỗ keo", used: 950, errorRate: 1.7 },
        { name: "Gỗ xoan", used: 800, errorRate: 2.3 },
      ],
      accessories: [
        { name: "Ốc vít", used: 2300, errorRate: 0.6 },
        { name: "Bản lề", used: 1400, errorRate: 1.2 },
        { name: "Ke sắt", used: 1300, errorRate: 1.7 },
        { name: "Sơn PU", used: 1200, errorRate: 0.9 },
        { name: "Keo dán", used: 900, errorRate: 1.4 },
        { name: "Nút cao su", used: 1000, errorRate: 0.8 },
      ],
    },
    products: [
      { name: "Bàn học", produced: 600, errorRate: 1.7 },
      { name: "Ghế gỗ", produced: 950, errorRate: 2.3 },
      { name: "Ghế xoay", produced: 800, errorRate: 1.2 },
      { name: "Tủ gỗ", produced: 550, errorRate: 2.8 },
      { name: "Kệ sách", produced: 480, errorRate: 1.0 },
      { name: "Giường ngủ", produced: 420, errorRate: 2.0 },
    ],
  },
};

// ========== MAIN COMPONENT ==========
export default function StatisticsPage() {
  const [period, setPeriod] = useState("month");
  const data = demoData[period];

  // Hàm xuất Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const woodSheet = XLSX.utils.json_to_sheet(data.materials.wood);
    const accessorySheet = XLSX.utils.json_to_sheet(data.materials.accessories);
    const productSheet = XLSX.utils.json_to_sheet(data.products);

    XLSX.utils.book_append_sheet(wb, woodSheet, "Gỗ");
    XLSX.utils.book_append_sheet(wb, accessorySheet, "Phụ kiện");
    XLSX.utils.book_append_sheet(wb, productSheet, "Thành phẩm");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `ThongKe_${period}.xlsx`);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Tiêu đề + Lọc thời gian + Xuất Excel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">📊 Thống Kê Sản Xuất Bàn Ghế</h1>
          <p className="text-muted-foreground">Tổng quan về nguyên liệu & thành phẩm theo {period === "month" ? "tháng" : period === "quarter" ? "quý" : "năm"}</p>
        </div>

        <div className="flex gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-background text-foreground"
          >
            <option value="month">Theo tháng</option>
            <option value="quarter">Theo quý</option>
            <option value="year">Theo năm</option>
          </select>
          <button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg"
          >
            ⬇️ Xuất Excel
          </button>
        </div>
      </div>

      {/* NGUYÊN LIỆU */}
      <Card>
        <CardHeader>
          <CardTitle>📦 Thống kê nguyên liệu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Gỗ */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-700">🪵 Nhóm gỗ</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.materials.wood}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="used" fill="#00C49F" name="Số lượng sử dụng" />
                <Bar dataKey="errorRate" fill="#FF8042" name="Tỷ lệ lỗi (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Phụ kiện */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-700">⚙️ Phụ kiện</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={data.materials.accessories}
                    dataKey="used"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {data.materials.accessories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.materials.accessories}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="errorRate" fill="#FF8042" name="Tỷ lệ lỗi (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* THÀNH PHẨM */}
      <Card>
        <CardHeader>
          <CardTitle>🪑 Thống kê thành phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.products}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="produced" fill="#0088FE" name="Số lượng sản xuất" />
              <Bar dataKey="errorRate" fill="#FF8042" name="Tỷ lệ lỗi (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
>>>>>>> origin/PhanHongLieu
}
