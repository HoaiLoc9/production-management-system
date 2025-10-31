"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Trash2, Clipboard } from "lucide-react"

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

export default function AddProductionPlanPage() {
  const [planName, setPlanName] = useState("")
  const [orderCode, setOrderCode] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showMaterialTable, setShowMaterialTable] = useState(false)
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "", quantity: "100", unit: "", estimate: "5000000", completion: "" },
  ])
  const [materials, setMaterials] = useState<Material[]>([])

  const materialRequirements: Record<string, Array<{ name: string; unit: string; quantity: number; inStock: number }>> = {
    "Ghế Gỗ": [
      { name: "Gỗ ", unit: "m³", quantity: 0.08, inStock: 50 },
      { name: "Sơn PU", unit: "Lít", quantity: 0.5, inStock: 100 },
      { name: "Vít gỗ", unit: "Hộp", quantity: 2, inStock: 200 },
      { name: "Keo dán gỗ", unit: "Kg", quantity: 0.3, inStock: 80 },
    ],
    "Bàn Gỗ": [
      { name: "Gỗ ", unit: "m³", quantity: 0.15, inStock: 50 },
      { name: "Sơn PU", unit: "Lít", quantity: 1.2, inStock: 100 },
      { name: "Vít gỗ", unit: "Hộp", quantity: 3, inStock: 200 },
      { name: "Keo dán gỗ", unit: "Kg", quantity: 0.5, inStock: 80 },
      { name: "Chân bàn kim loại", unit: "Bộ", quantity: 1, inStock: 30 },
    ],
  }

  const productUnits: Record<string, string> = {
    "Ghế Gỗ": "Cái",
    "Bàn Gỗ": "Cái",
  }

  const addProduct = () => {
    setProducts([...products, { id: products.length + 1, name: "", quantity: "", unit: "", estimate: "", completion: "" }])
  }

  const removeProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
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

  // ✅ Lưu kế hoạch vào localStorage
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!planName || !orderCode || !startDate || !endDate) {
      alert("Vui lòng điền đầy đủ thông tin kế hoạch!")
      return
    }

    const validProducts = products.filter((p) => p.name && p.quantity)
    if (validProducts.length === 0) {
      alert("Vui lòng thêm ít nhất một sản phẩm!")
      return
    }

    const existingPlans = JSON.parse(localStorage.getItem("productionPlans") || "[]")
    const newId = existingPlans.length > 0 ? Math.max(...existingPlans.map((p: any) => p.id)) + 1 : 3

    const newPlan = {
      id: newId,
      code: planName,
      product: validProducts.map((p) => p.name).join(", "),
      quantity: validProducts.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0),
      startDate,
      endDate,
      status: "in-progress",
    }

    const updatedPlans = [...existingPlans, newPlan]
    localStorage.setItem("productionPlans", JSON.stringify(updatedPlans))

    alert("✅ Kế hoạch đã được lưu thành công!")
    window.location.href = "/production-plan"
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

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-start gap-3">
            <Clipboard className="w-8 h-8 text-blue-500 mt-1" />
            <div>
              <CardTitle className="text-2xl">Thêm kế hoạch sản xuất</CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Thông tin kế hoạch */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Thông tin kế hoạch</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mã kế hoạch *</label>
                  <Input type="text" placeholder="Nhập mã kế hoạch" value={planName} onChange={(e) => setPlanName(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Đơn hàng *</label>
                  <Select value={orderCode} onValueChange={(v) => setOrderCode(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn đơn hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DH001">DH-2025-001</SelectItem>
                      <SelectItem value="DH002">DH-2025-002</SelectItem>
                      <SelectItem value="DH003">DH-2025-003</SelectItem>
                      <SelectItem value="DH004">DH-2025-004</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngày bắt đầu *</label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngày kết thúc *</label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Danh sách thành phẩm */}
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
                          <Select value={p.name} onValueChange={(v) => updateProduct(p.id, "name", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn sản phẩm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ghế Gỗ">Ghế Gỗ</SelectItem>
                              <SelectItem value="Bàn Gỗ">Bàn Gỗ</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3">
                          <Input type="number" value={p.quantity} onChange={(e) => updateProduct(p.id, "quantity", e.target.value)} />
                        </td>
                        <td className="px-4 py-3">{p.unit}</td>
                        <td className="px-4 py-3">
                          <Input type="number" value={p.estimate} onChange={(e) => updateProduct(p.id, "estimate", e.target.value)} />
                        </td>
                        <td className="px-4 py-3">
                          <Input type="date" value={p.completion} onChange={(e) => updateProduct(p.id, "completion", e.target.value)} />
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" onClick={() => removeProduct(p.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Button onClick={handleCalculateMaterials} className="w-full bg-purple-600 hover:bg-purple-700">
              <Calendar className="w-5 h-5 mr-2" /> Tính toán nguyên vật liệu cần thiết
            </Button>

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

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Hủy
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                Lưu kế hoạch
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
