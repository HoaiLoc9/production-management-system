"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface Order {
  id: number
  code: string
  customer: string
  product: string
  quantity: number
  deliveryDate: string
  status: string
}

export default function AddProductionPlanPage() {
  const [planName, setPlanName] = useState("")
  const [orderCode, setOrderCode] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showMaterialTable, setShowMaterialTable] = useState(false)
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "", quantity: "", unit: "", estimate: "", completion: "" },
  ])
  const [materials, setMaterials] = useState<Material[]>([])

  // ✅ Tạo mã kế hoạch tự động không trùng lặp
  const generateUniquePlanCode = (): string => {
    const existingPlans = JSON.parse(localStorage.getItem("productionPlans") || "[]")
    const existingCodes = new Set(existingPlans.map((p: any) => p.code))
    
    let newCode: string
    do {
      const randomNum = Math.floor(Math.random() * 9000) + 1000
      newCode = `KH-${new Date().getFullYear()}-${randomNum}`
    } while (existingCodes.has(newCode))
    
    return newCode
  }

  // ✅ Load đơn hàng và tạo mã kế hoạch khi component mount
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    setOrders(savedOrders)
    
    if (!planName) {
      setPlanName(generateUniquePlanCode())
    }
  }, [])

  // ✅ Khi chọn đơn hàng, tự động điền thông tin
  const handleOrderChange = (code: string) => {
    setOrderCode(code)
    const order = orders.find(o => o.code === code)
    if (order) {
      setSelectedOrder(order)
      // Tự động điền sản phẩm và số lượng từ đơn hàng
      setProducts([{
        id: 1,
        name: order.product,
        quantity: order.quantity.toString(),
        unit: "Cái",
        estimate: "",
        completion: order.deliveryDate
      }])
    }
  }

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

  // ✅ Lưu kế hoạch và xóa đơn hàng khỏi danh sách
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

    // Lưu kế hoạch mới
    const existingPlans = JSON.parse(localStorage.getItem("productionPlans") || "[]")
    const newId = existingPlans.length > 0 ? Math.max(...existingPlans.map((p: any) => p.id)) + 1 : 1

    const newPlan = {
      id: newId,
      code: planName,
      orderCode: orderCode,
      customer: selectedOrder?.customer || "",
      product: validProducts.map((p) => p.name).join(", "),
      quantity: validProducts.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0),
      startDate,
      endDate,
      status: "in-progress",
    }

    const updatedPlans = [...existingPlans, newPlan]
    localStorage.setItem("productionPlans", JSON.stringify(updatedPlans))

    // ✅ Xóa đơn hàng đã chọn khỏi danh sách
    const updatedOrders = orders.filter(o => o.code !== orderCode)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    alert("✅ Kế hoạch đã được lưu thành công và đơn hàng đã được chuyển vào kế hoạch!")
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
                  <Input 
                    type="text" 
                    placeholder="Mã tự động" 
                    value={planName} 
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Đơn hàng *</label>
                  <Select value={orderCode} onValueChange={handleOrderChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn đơn hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      {orders.length === 0 ? (
                        <SelectItem value="no-orders" disabled>Không có đơn hàng nào</SelectItem>
                      ) : (
                        orders.map((order) => (
                          <SelectItem key={order.id} value={order.code}>
                            {order.code} - {order.customer} - {order.product}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {selectedOrder && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-sm mb-2 text-blue-900">Thông tin đơn hàng</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium">Khách hàng:</span> {selectedOrder.customer}</div>
                      <div><span className="font-medium">Sản phẩm:</span> {selectedOrder.product}</div>
                      <div><span className="font-medium">Số lượng:</span> {selectedOrder.quantity}</div>
                      <div><span className="font-medium">Ngày giao:</span> {selectedOrder.deliveryDate}</div>
                    </div>
                  </div>
                )}

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
                          <Input 
                            type="text" 
                            value={p.name}
                            onChange={(e) => updateProduct(p.id, "name", e.target.value)}
                            placeholder="Nhập tên sản phẩm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input type="number" value={p.quantity} onChange={(e) => updateProduct(p.id, "quantity", e.target.value)} />
                        </td>
                        <td className="px-4 py-3">
                          <Input type="text" value={p.unit} onChange={(e) => updateProduct(p.id, "unit", e.target.value)} />
                        </td>
                        <td className="px-4 py-3">
                          <Input type="number" value={p.estimate} onChange={(e) => updateProduct(p.id, "estimate", e.target.value)} placeholder="0" />
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