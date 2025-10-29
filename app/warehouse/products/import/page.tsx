"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProductsImportPage() {
  const [formData, setFormData] = useState({
    product_type: "",
    quantity: "",
    unit: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Nhập Thành Phẩm</h1>
        <p className="text-muted-foreground mt-2">Ghi nhận giao dịch nhập kho thành phẩm</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phiếu Nhập Thành Phẩm</CardTitle>
          <CardDescription>Điền thông tin chi tiết về thành phẩm nhập kho</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Loại Sản Phẩm *</label>
                <Select
                  value={formData.product_type}
                  onValueChange={(value) => setFormData({ ...formData, product_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chair">Ghế Gỗ</SelectItem>
                    <SelectItem value="table">Bàn Gỗ</SelectItem>
                    <SelectItem value="sofa">Sofa</SelectItem>
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
                    <SelectItem value="piece">Cái</SelectItem>
                    <SelectItem value="set">Bộ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Ghi Chú</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ghi chú về giao dịch..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={4}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline">
                Hủy
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground">
                Lưu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
