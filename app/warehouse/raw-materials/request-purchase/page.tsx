"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RequestPurchasePage() {
  const [formData, setFormData] = useState({
    material_type: "",
    quantity: "",
    unit: "",
    supplier: "",
    urgency: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Yêu Cầu Mua Nguyên Vật Liệu</h1>
        <p className="text-muted-foreground mt-2">Tạo yêu cầu mua nguyên vật liệu mới</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phiếu Yêu Cầu Mua</CardTitle>
          <CardDescription>Điền thông tin chi tiết về yêu cầu mua nguyên vật liệu</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Loại Nguyên Vật Liệu *</label>
                <Select
                  value={formData.material_type}
                  onValueChange={(value) => setFormData({ ...formData, material_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại nguyên vật liệu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wood">Gỗ</SelectItem>
                    <SelectItem value="fabric">Vải</SelectItem>
                    <SelectItem value="metal">Kim loại</SelectItem>
                    <SelectItem value="foam">Xốp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Số Lượng *</label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="Nhập số lượng"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Đơn Vị *</label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kg</SelectItem>
                    <SelectItem value="m">Mét</SelectItem>
                    <SelectItem value="piece">Cái</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Nhà Cung Cấp *</label>
                <Input
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Nhập tên nhà cung cấp"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Mức Độ Ưu Tiên *</label>
                <Select
                  value={formData.urgency}
                  onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mức độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung Bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Ghi Chú</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ghi chú về yêu cầu..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={4}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline">
                Hủy
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Gửi Yêu Cầu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
