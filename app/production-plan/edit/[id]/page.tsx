"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Trash2, Edit2 } from "lucide-react"

interface Product {
  id: number
  name: string
  quantity: string
  unit: string
  estimate: string
  completion: string
}

interface Material {
  id: number
  name: string
  unit: string
  quantityPerProduct: string
  totalQuantity: string
  inStock: string
  needToPurchase: string
}

export default function EditProductionPlanPage() {
  const [formData, setFormData] = useState({
    id: 0,
    code: "",
    orderCode: "",
    customer: "",
    startDate: "",
    endDate: "",
    workshop: "",
    status: "in-progress",
    notes: "",
  })

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "", quantity: "", unit: "", estimate: "", completion: "" },
  ])

  const [materials, setMaterials] = useState<Material[]>([])
  const [showMaterialTable, setShowMaterialTable] = useState(false)

  const workshops = [
    "Xưởng 1",
    "Xưởng 2",
    "Xưởng 3",
    "Xưởng 4",
    "Xưởng 5",
    "Xưởng 6",
  ]

  const materialRequirements: Record<string, Array<{ name: string; unit: string; quantity: number; inStock: number }>> = {
    "Ghế Gỗ": [
      { name: "Gỗ", unit: "m³", quantity: 0.08, inStock: 50 },
      { name: "Sơn PU", unit: "Lít", quantity: 0.5, inStock: 100 },
      { name: "Vít gỗ", unit: "Hộp", quantity: 2, inStock: 200 },
      { name: "Keo dán gỗ", unit: "Kg", quantity: 0.3, inStock: 80 },
    ],
    "Bàn Gỗ": [
      { name: "Gỗ", unit: "m³", quantity: 0.15, inStock: 50 },
      { name: "Sơn PU", unit: "Lít", quantity: 1.2, inStock: 100 },
      { name: "Vít gỗ", unit: "Hộp", quantity: 3, inStock: 200 },
      { name: "Keo dán gỗ", unit: "Kg", quantity: 0.5, inStock: 80 },
      { name: "Chân bàn kim loại", unit: "Bộ", quantity: 1, inStock: 30 },
    ],
    "Ghế gỗ cao cấp": [
      { name: "Gỗ", unit: "m³", quantity: 0.08, inStock: 50 },
      { name: "Sơn PU", unit: "Lít", quantity: 0.5, inStock: 100 },
      { name: "Vít gỗ", unit: "Hộp", quantity: 2, inStock: 200 },
      { name: "Keo dán gỗ", unit: "Kg", quantity: 0.3, inStock: 80 },
    ],
    "Bàn gỗ sồi": [
      { name: "Gỗ sồi", unit: "m³", quantity: 0.2, inStock: 30 },
      { name: "Sơn PU", unit: "Lít", quantity: 1.5, inStock: 100 },
      { name: "Vít gỗ", unit: "Hộp", quantity: 3, inStock: 200 },
      { name: "Keo dán gỗ", unit: "Kg", quantity: 0.6, inStock: 80 },
    ],
    "Tủ gỗ sồi": [
      { name: "Gỗ sồi", unit: "m³", quantity: 0.3, inStock: 30 },
      { name: "Sơn PU", unit: "Lít", quantity: 2, inStock: 100 },
      { name: "Vít gỗ", unit: "Hộp", quantity: 5, inStock: 200 },
      { name: "Keo dán gỗ", unit: "Kg", quantity: 1, inStock: 80 },
      { name: "Bản lề", unit: "Bộ", quantity: 4, inStock: 150 },
    ],
    "Bàn làm việc gỗ": [
      { name: "Gỗ", unit: "m³", quantity: 0.18, inStock: 50 },
      { name: "Sơn PU", unit: "Lít", quantity: 1.3, inStock: 100 },
      { name: "Vít gỗ", unit: "Hộp", quantity: 3, inStock: 200 },
      { name: "Keo dán gỗ", unit: "Kg", quantity: 0.5, inStock: 80 },
    ],
  }

  const productUnits: Record<string, string> = {
    "Ghế Gỗ": "Cái",
    "Bàn Gỗ": "Cái",
    "Ghế gỗ cao cấp": "Cái",
    "Bàn gỗ sồi": "Cái",
    "Tủ gỗ sồi": "Cái",
    "Bàn làm việc gỗ": "Cái",
  }

  useEffect(() => {
    const pathParts = window.location.pathname.split('/')
    const planId = parseInt(pathParts[pathParts.length - 1])
    
    if (planId) {
      const plans = JSON.parse(localStorage.getItem("productionPlans") || "[]")
      const plan = plans.find((p: any) => p.id === planId)
      
      if (plan) {
        setFormData({
          id: plan.id,
          code: plan.code || "",
          orderCode: plan.orderCode || "",
          customer: plan.customer || "",
          startDate: plan.startDate || "",
          endDate: plan.endDate || "",
          workshop: plan.workshop || "",
          status: plan.status || "in-progress",
          notes: plan.notes || "",
        })

        // Parse products từ plan
        if (plan.product && plan.quantity) {
          const productNames = plan.product.split(", ")
          const initialProducts = productNames.map((name: string, index: number) => ({
            id: index + 1,
            name: name.trim(),
            quantity: plan.quantity.toString(),
            unit: productUnits[name.trim()] || "Cái",
            estimate: "",
            completion: plan.endDate || "",
          }))
          setProducts(initialProducts)
        }
      }
    }
  }, [])

  const addProduct = () => {
    setProducts([...products, { 
      id: products.length + 1, 
      name: "", 
      quantity: "", 
      unit: "", 
      estimate: "", 
      completion: formData.endDate 
    }])
  }

  const removeProduct = (id: number) => {
    if (products.length > 1) {
      setProducts(products.filter((p) => p.id !== id))
    } else {
      alert("Phải có ít nhất một sản phẩm!")
    }
  }

  const updateProduct = (id: number, field: keyof Product, value: string) => {
    const updatedProducts = products.map((p) => {
      if (p.id === id) {
        const updated = { ...p, [field]: value }
        if (field === "name" && value && productUnits[value]) {
          updated.unit = productUnits[value]
        }
        return updated
      }
      return p
    })
    setProducts(updatedProducts)
  }

  const handleCalculateMaterials = () => {
    const validProducts = products.filter((p) => p.name && p.quantity)
    if (validProducts.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm và nhập số lượng!")
      return
    }

    const materialMap = new Map<
      string,
      { name: string; unit: string; quantityPerProduct: number; totalQuantity: number; inStock: number }
    >()

    validProducts.forEach((product) => {
      const requirements = materialRequirements[product.name]
      if (!requirements) return
      const productQty = parseFloat(product.quantity) || 0
      requirements.forEach((req) => {
        const key = req.name
        if (materialMap.has(key)) {
          const existing = materialMap.get(key)!
          existing.totalQuantity += req.quantity * productQty
        } else {
          materialMap.set(key, {
            name: req.name,
            unit: req.unit,
            quantityPerProduct: req.quantity,
            totalQuantity: req.quantity * productQty,
            inStock: req.inStock,
          })
        }
      })
    })

    const calculatedMaterials: Material[] = Array.from(materialMap.values()).map((mat, index) => {
      const needToPurchase = Math.max(0, mat.totalQuantity - mat.inStock)
      return {
        id: index + 1,
        name: mat.name,
        unit: mat.unit,
        quantityPerProduct: mat.quantityPerProduct.toFixed(2),
        totalQuantity: mat.totalQuantity.toFixed(2),
        inStock: mat.inStock.toString(),
        needToPurchase: needToPurchase.toFixed(2),
      }
    })

    setMaterials(calculatedMaterials)
    setShowMaterialTable(true)
  }

  const handleSubmit = () => {
    if (!formData.code || !formData.orderCode || !formData.startDate || !formData.endDate || !formData.workshop) {
      alert("Vui lòng điền đầy đủ thông tin!")
      return
    }

    const validProducts = products.filter((p) => p.name && p.quantity)
    if (validProducts.length === 0) {
      alert("Vui lòng thêm ít nhất một sản phẩm!")
      return
    }

    const plans = JSON.parse(localStorage.getItem("productionPlans") || "[]")
    const updatedPlans = plans.map((p: any) => 
      p.id === formData.id 
        ? {
            ...p,
            code: formData.code,
            orderCode: formData.orderCode,
            customer: formData.customer,
            product: validProducts.map((p) => p.name).join(", "),
            quantity: validProducts.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0),
            startDate: formData.startDate,
            endDate: formData.endDate,
            workshop: formData.workshop,
            status: formData.status,
            notes: formData.notes,
          }
        : p
    )
    
    localStorage.setItem("productionPlans", JSON.stringify(updatedPlans))
    alert("✅ Cập nhật kế hoạch thành công!")
    window.location.href = "/production-plan"
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sửa Kế Hoạch Sản Xuất</h1>
        <p className="text-muted-foreground mt-2">Cập nhật thông tin kế hoạch sản xuất</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit2 className="w-6 h-6 text-blue-500" />
            Thông Tin Kế Hoạch
          </CardTitle>
          <CardDescription>Chỉnh sửa thông tin chi tiết về kế hoạch sản xuất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Mã Kế Hoạch *</label>
                  <Input
                    type="text"
                    value={formData.code}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Mã Đơn Hàng *</label>
                  <Input
                    type="text"
                    value={formData.orderCode}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Khách Hàng</label>
                  <Input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    placeholder="Tên khách hàng"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Xưởng Phụ Trách *</label>
                  <Select 
                    value={formData.workshop} 
                    onValueChange={(value) => setFormData({ ...formData, workshop: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn xưởng phụ trách" />
                    </SelectTrigger>
                    <SelectContent>
                      {workshops.map((w) => (
                        <SelectItem key={w} value={w}>
                          {w}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Ngày Bắt Đầu *</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Ngày Kết Thúc *</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Trạng Thái *</label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ Xử Lý</SelectItem>
                      <SelectItem value="in-progress">Đang Thực Hiện</SelectItem>
                      <SelectItem value="completed">Hoàn Thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Danh sách thành phẩm cần sản xuất</h2>
                <Button onClick={addProduct} className="bg-green-500 hover:bg-green-600">
                  <Plus className="w-4 h-4 mr-2" /> Thêm thành phẩm
                </Button>
              </div>

              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left">Tên sản phẩm</th>
                      <th className="px-4 py-3 text-left">Số lượng</th>
                      <th className="px-4 py-3 text-left">Đơn vị</th>
                      <th className="px-4 py-3 text-left">Dự kiến chi phí</th>
                      <th className="px-4 py-3 text-left">Hạn hoàn thành</th>
                      <th className="px-4 py-3 text-left">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-3">
                          <Input 
                            type="text" 
                            value={p.name}
                            onChange={(e) => updateProduct(p.id, "name", e.target.value)}
                            placeholder="Tên sản phẩm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input 
                            type="number" 
                            value={p.quantity} 
                            onChange={(e) => updateProduct(p.id, "quantity", e.target.value)}
                            placeholder="Số lượng"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input 
                            type="text" 
                            value={p.unit} 
                            onChange={(e) => updateProduct(p.id, "unit", e.target.value)}
                            placeholder="Đơn vị"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input 
                            type="number" 
                            value={p.estimate} 
                            onChange={(e) => updateProduct(p.id, "estimate", e.target.value)} 
                            placeholder="0" 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input 
                            type="date" 
                            value={p.completion} 
                            onChange={(e) => updateProduct(p.id, "completion", e.target.value)} 
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeProduct(p.id)}
                            disabled={products.length === 1}
                          >
                            <Trash2 size={16} className={products.length === 1 ? "text-gray-400" : "text-red-600"} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Nút tính toán nguyên vật liệu */}
            <Button onClick={handleCalculateMaterials} className="w-full bg-purple-600 hover:bg-purple-700">
              <Calendar className="w-5 h-5 mr-2" /> Tính toán nguyên vật liệu cần thiết
            </Button>

            {/* Bảng nguyên vật liệu */}
            {showMaterialTable && (
              <div className="border rounded-lg p-6 bg-blue-50">
                <h2 className="text-lg font-semibold mb-4">Bảng tính toán nguyên vật liệu</h2>
                <div className="overflow-x-auto border rounded-lg bg-white">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left">Tên nguyên vật liệu</th>
                        <th className="px-4 py-3 text-left">Đơn vị</th>
                        <th className="px-4 py-3 text-left">Định mức/SP</th>
                        <th className="px-4 py-3 text-left">Tổng số lượng cần</th>
                        <th className="px-4 py-3 text-left">Tồn kho</th>
                        <th className="px-4 py-3 text-left">Cần mua thêm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {materials.map((m) => (
                        <tr key={m.id}>
                          <td className="px-4 py-3 font-medium">{m.name}</td>
                          <td className="px-4 py-3">{m.unit}</td>
                          <td className="px-4 py-3">{m.quantityPerProduct}</td>
                          <td className="px-4 py-3 font-semibold text-blue-600">{m.totalQuantity}</td>
                          <td className="px-4 py-3 text-green-600">{m.inStock}</td>
                          <td className="px-4 py-3 font-semibold text-red-600">{m.needToPurchase}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Ghi chú */}
            <div>
              <label className="text-sm font-medium block mb-2">Ghi Chú</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ghi chú về kế hoạch..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={4}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Hủy
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                Cập Nhật Kế Hoạch
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}