"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC"];

// ========== DEMO DATA ==========
const demoData = {
  month: {
    materials: {
      wood: [
        { name: "Gỗ sồi", used: 120, errorRate: 2.0 },
        { name: "Gỗ thông", used: 95, errorRate: 3.2 },
        { name: "Gỗ keo", used: 75, errorRate: 1.5 },
        { name: "Gỗ xoan", used: 65, errorRate: 2.8 }
      ],
      accessories: [
        { name: "Ốc vít", used: 200, errorRate: 0.5 },
        { name: "Bản lề", used: 130, errorRate: 1.1 },
        { name: "Ke sắt", used: 100, errorRate: 1.8 },
        { name: "Sơn PU", used: 90, errorRate: 0.9 },
        { name: "Keo dán", used: 60, errorRate: 1.3 },
        { name: "Nút cao su", used: 80, errorRate: 0.7 }
      ]
    },
    products: [
      { name: "Bàn học", produced: 55, errorRate: 1.8 },
      { name: "Ghế gỗ", produced: 80, errorRate: 2.5 },
      { name: "Ghế xoay", produced: 70, errorRate: 1.3 },
      { name: "Tủ gỗ", produced: 45, errorRate: 3.0 },
      { name: "Kệ sách", produced: 40, errorRate: 0.9 },
      { name: "Giường ngủ", produced: 35, errorRate: 2.2 }
    ]
  },
  quarter: {
    materials: {
      wood: [
        { name: "Gỗ sồi", used: 320, errorRate: 1.9 },
        { name: "Gỗ thông", used: 295, errorRate: 2.5 },
        { name: "Gỗ keo", used: 240, errorRate: 1.3 },
        { name: "Gỗ xoan", used: 220, errorRate: 2.1 }
      ],
      accessories: [
        { name: "Ốc vít", used: 600, errorRate: 0.4 },
        { name: "Bản lề", used: 350, errorRate: 1.0 },
        { name: "Ke sắt", used: 310, errorRate: 1.5 },
        { name: "Sơn PU", used: 270, errorRate: 0.8 },
        { name: "Keo dán", used: 180, errorRate: 1.2 },
        { name: "Nút cao su", used: 210, errorRate: 0.6 }
      ]
    },
    products: [
      { name: "Bàn học", produced: 160, errorRate: 1.5 },
      { name: "Ghế gỗ", produced: 220, errorRate: 2.0 },
      { name: "Ghế xoay", produced: 180, errorRate: 1.1 },
      { name: "Tủ gỗ", produced: 130, errorRate: 2.5 },
      { name: "Kệ sách", produced: 110, errorRate: 0.8 },
      { name: "Giường ngủ", produced: 100, errorRate: 1.8 }
    ]
  },
  year: {
    materials: {
      wood: [
        { name: "Gỗ sồi", used: 1400, errorRate: 2.2 },
        { name: "Gỗ thông", used: 1200, errorRate: 2.8 },
        { name: "Gỗ keo", used: 950, errorRate: 1.7 },
        { name: "Gỗ xoan", used: 800, errorRate: 2.3 }
      ],
      accessories: [
        { name: "Ốc vít", used: 2300, errorRate: 0.6 },
        { name: "Bản lề", used: 1400, errorRate: 1.2 },
        { name: "Ke sắt", used: 1300, errorRate: 1.7 },
        { name: "Sơn PU", used: 1200, errorRate: 0.9 },
        { name: "Keo dán", used: 900, errorRate: 1.4 },
        { name: "Nút cao su", used: 1000, errorRate: 0.8 }
      ]
    },
    products: [
      { name: "Bàn học", produced: 600, errorRate: 1.7 },
      { name: "Ghế gỗ", produced: 950, errorRate: 2.3 },
      { name: "Ghế xoay", produced: 800, errorRate: 1.2 },
      { name: "Tủ gỗ", produced: 550, errorRate: 2.8 },
      { name: "Kệ sách", produced: 480, errorRate: 1.0 },
      { name: "Giường ngủ", produced: 420, errorRate: 2.0 }
    ]
  }
};

// ========== MAIN COMPONENT ==========
export default function StatisticsPage() {
  const [period, setPeriod] = useState("month");
  const [selectedCategories, setSelectedCategories] = useState({
    wood: false,
    accessories: false,
    products: false
  });

  const data = demoData[period];

  // Toggle checkbox
  const handleCheckboxChange = (category) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // ✅ Xuất file Excel chỉ với các mục đã chọn
  const exportToExcel = () => {
    const hasSelection = Object.values(selectedCategories).some(val => val);
    
    if (!hasSelection) {
      alert("Vui lòng chọn ít nhất một loại dữ liệu để xuất!");
      return;
    }

    const wb = XLSX.utils.book_new();

    // Hàm format header
    const formatSheet = (data, sheetName) => {
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Lấy range của sheet
      const range = XLSX.utils.decode_range(ws['!ref']);
      
      // Format header (hàng đầu tiên)
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1";
        if (!ws[address]) continue;
        
        // Thêm style cho header
        ws[address].s = {
          font: { bold: true, sz: 14 },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }
      
      // Set column width
      ws['!cols'] = [
        { wch: 20 },
        { wch: 15 },
        { wch: 15 }
      ];
      
      return ws;
    };

    if (selectedCategories.wood) {
      const woodSheet = formatSheet(data.materials.wood, "Gỗ");
      XLSX.utils.book_append_sheet(wb, woodSheet, "Gỗ");
    }

    if (selectedCategories.accessories) {
      const accessorySheet = formatSheet(data.materials.accessories, "Phụ kiện");
      XLSX.utils.book_append_sheet(wb, accessorySheet, "Phụ kiện");
    }

    if (selectedCategories.products) {
      const productSheet = formatSheet(data.products, "Thành phẩm");
      XLSX.utils.book_append_sheet(wb, productSheet, "Thành phẩm");
    }

    XLSX.writeFile(wb, `ThongKe_${period}.xlsx`);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Tiêu đề + Lọc thời gian + Xuất Excel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">📊 Thống Kê Sản Xuất Bàn Ghế</h1>
          <p className="text-muted-foreground">
            Tổng quan về nguyên liệu & thành phẩm theo{" "}
            {period === "month" ? "tháng" : period === "quarter" ? "quý" : "năm"}
          </p>
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
          <Button 
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            ⬇️ Xuất Excel
          </Button>
        </div>
      </div>

      {/* Chọn dữ liệu xuất Excel */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">📥 Chọn dữ liệu cần thống kê</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cột 1: Nhóm gỗ */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 mb-3">🪵 Nhóm gỗ</h3>
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="wood" 
                  checked={selectedCategories.wood}
                  onCheckedChange={() => handleCheckboxChange('wood')}
                />
                <label htmlFor="wood" className="text-sm font-medium cursor-pointer">
                  Tất cả loại gỗ
                </label>
              </div>
            </div>

            {/* Cột 2: Phụ kiện */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 mb-3">⚙️ Phụ kiện</h3>
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="accessories" 
                  checked={selectedCategories.accessories}
                  onCheckedChange={() => handleCheckboxChange('accessories')}
                />
                <label htmlFor="accessories" className="text-sm font-medium cursor-pointer">
                  Ốc vít, Bản lề, Ke sắt,...
                </label>
              </div>
            </div>

            {/* Cột 3: Thành phẩm */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 mb-3">🪑 Thành phẩm</h3>
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="products" 
                  checked={selectedCategories.products}
                  onCheckedChange={() => handleCheckboxChange('products')}
                />
                <label htmlFor="products" className="text-sm font-medium cursor-pointer">
                  Bàn, Ghế, Tủ, Kệ,...
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
}