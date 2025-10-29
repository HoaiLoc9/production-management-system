"use client"

import type React from "react"
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/PhanHongLieu

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
<<<<<<< HEAD
=======
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Info, X } from "lucide-react"

interface Material {
  name: string
  currentStock: number
  requestQuantity: number
  unit: string
}

interface PurchaseRequest {
  id: string
  date: string
  confirmer: string
  materials: Material[]
  status: string
}

export default function RequestPurchasePage() {
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [requestId, setRequestId] = useState("PR-2025-001")
  const [requests, setRequests] = useState<PurchaseRequest[]>(() => {
    // Load saved requests from localStorage
    const saved = localStorage.getItem('purchaseRequests')
    return saved ? JSON.parse(saved) : []
  })
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("lít")
  // Mock current stock lookup (in real app this comes from warehouse API)
  const currentStockLookup: Record<string, { stock: number; unit: string }> = {
    "Keo dán": { stock: 2, unit: "lít" },
    "Thép tấm CT3": { stock: 0, unit: "kg" },
    "Vải": { stock: 10, unit: "m" },
  }

  // Mock production plans (in real app load from API). Each plan lists required materials and qty.
  const [productionPlans] = useState<Array<{ id: string; required: { name: string; qty: number }[] }>>([
    { id: 'plan-1', required: [{ name: 'Keo dán', qty: 3 }, { name: 'Thép tấm CT3', qty: 2 }] },
  ])

  const [suggestedShortages, setSuggestedShortages] = useState<{ name: string; need: number; unit: string }[]>([])

  // compute shortages from production plans vs current stock, minus already requested quantities
  useEffect(() => {
    const needs: Record<string, number> = {}
    for (const plan of productionPlans) {
      for (const req of plan.required) {
        needs[req.name] = (needs[req.name] || 0) + req.qty
      }
    }

    // Sum already requested quantities from saved requests
    const requestedCount: Record<string, number> = {}
    for (const r of requests) {
      for (const m of r.materials) {
        requestedCount[m.name] = (requestedCount[m.name] || 0) + (m.requestQuantity || 0)
      }
    }

    const shortages: { name: string; need: number; unit: string }[] = []
    for (const name of Object.keys(needs)) {
      const stockInfo = currentStockLookup[name]
      const stock = stockInfo ? stockInfo.stock : 0
      const unitInfo = stockInfo ? stockInfo.unit : 'cái'
      const alreadyRequested = requestedCount[name] || 0
      const need = needs[name] - stock - alreadyRequested
      if (need > 0) {
        shortages.push({ name, need, unit: unitInfo })
      }
    }
    setSuggestedShortages(shortages)
  }, [productionPlans, requests])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [confirmer, setConfirmer] = useState("Nguyễn Trần Thái Bảo")
  const router = useRouter()

  // Save requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('purchaseRequests', JSON.stringify(requests))
  }, [requests])

  // Reset form data when component unmounts or route changes
  useEffect(() => {
    return () => {
      // Only clear draft form state
      setMaterials([])
      setSelectedMaterial("")
      setQuantity("")
      setUnit("lít")
      setSuccess(false)
      setOpen(false)
      setDetailOpen(false)
      setSelectedRequest(null)
    }
  }, [])

  const handleAddMaterial = () => {
    if (!selectedMaterial || !quantity) return

    const newMaterial: Material = {
      name: selectedMaterial,
      currentStock: 2, // This would come from your backend
      requestQuantity: Number(quantity),
      unit: unit // use selected unit
    }

    setMaterials([...materials, newMaterial])
    setSelectedMaterial("")
    setQuantity("")
  }

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index))
  }

  const handleCreateRequest = () => {
    setOpen(true)
  }

  const handleCancelDraft = () => {
    // clear current draft form
    setMaterials([])
    setSelectedMaterial("")
    setQuantity("")
    setUnit("lít")
    setDate(new Date().toISOString().split('T')[0])
  }

  const openRequestDetail = (req: PurchaseRequest) => {
    // ensure selected request set before opening dialog
    setSelectedRequest(req)
    setDetailOpen(true)
    // debug log to help diagnose
    // eslint-disable-next-line no-console
    console.log('Open request detail', req.id)
  }

  const handleConfirm = () => {
    // Handle form submission: create and store the request
    const year = new Date().getFullYear()
    const yearRequests = requests.filter(r => r.id.startsWith(`PR-${year}`))
    const nextNumber = yearRequests.length + 1
    const newId = `PR-${year}-${String(nextNumber).padStart(3, "0")}`
    const newRequest: PurchaseRequest = {
      id: newId,
      date,
      confirmer,
      materials: materials.map((m) => ({ ...m })),
      status: "Chờ phê duyệt",
    }

    setRequests((prev) => [newRequest, ...prev])
    setRequestId(newId)
    // keep current materials for success view until user creates a new one
    setOpen(false)
    setSuccess(true)
  }

  const handleCreateNew = () => {
    setSuccess(false)
    setMaterials([])
    setSelectedMaterial("")
    setQuantity("")
    setUnit("lít")
    setDate(new Date().toISOString().split('T')[0])
  }

  // Persist requests to localStorage so they survive page reloads
  useEffect(() => {
    try {
      const raw = localStorage.getItem("purchase_requests")
      if (raw) {
        const parsed = JSON.parse(raw) as PurchaseRequest[]
        setRequests(parsed)
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("purchase_requests", JSON.stringify(requests))
    } catch (e) {
      // ignore
    }
  }, [requests])

  if (success) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="px-4 py-2 text-primary border-b-2 border-primary inline-block rounded-md">Lập phiếu mua NVL</div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white px-6 py-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-none text-green-600">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium">Lập Phiếu Thành Công</h3>
                <p className="text-sm text-slate-600 mt-1">Phiếu đề xuất mua NVL đã được lưu vào hệ thống</p>

                <div className="mt-4 bg-green-50 border border-green-100 rounded-md p-3">
                  <p className="text-sm text-green-800">Phiếu đề xuất đã được lưu với trạng thái "Chờ phê duyệt". Ban giám đốc đã nhận được thông báo.</p>
                </div>

                <div className="mt-6 bg-slate-50 rounded-md p-4">
                  <h4 className="font-medium mb-2">Thông tin phiếu đề xuất</h4>
                  <dl className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                    <div>
                      <dt className="text-muted-foreground">Mã phiếu</dt>
                      <dd className="mt-1">{requestId}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Ngày lập</dt>
                      <dd className="mt-1">{date}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Người xác nhận</dt>
                      <dd className="mt-1">{confirmer}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Trạng thái</dt>
                      <dd className="mt-1"><span className="inline-block bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded-full text-xs">Chờ phê duyệt</span></dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Danh sách NVL</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên NVL</TableHead>
                        <TableHead>Số lượng đề xuất</TableHead>
                        <TableHead>Đơn vị</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials.map((material, index) => (
                        <TableRow key={index}>
                          <TableCell>{material.name}</TableCell>
                          <TableCell>{material.requestQuantity}</TableCell>
                          <TableCell>{material.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>

                  {/* Detail dialog for viewing a saved request (also available here) */}
                  <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Chi tiết phiếu</DialogTitle>
                        <DialogDescription>Thông tin chi tiết phiếu đề xuất mua nguyên vật liệu</DialogDescription>
                      </DialogHeader>

                      {selectedRequest ? (
                        <div className="py-2 space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <dt className="text-muted-foreground">Mã phiếu</dt>
                              <dd className="font-medium">{selectedRequest.id}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Ngày lập</dt>
                              <dd className="font-medium">{selectedRequest.date}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Người xác nhận</dt>
                              <dd className="font-medium">{selectedRequest.confirmer}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Trạng thái</dt>
                              <dd><span className="inline-block bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded-full text-xs">{selectedRequest.status}</span></dd>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium">Danh sách NVL</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Tên NVL</TableHead>
                                  <TableHead>Số lượng</TableHead>
                                  <TableHead>Đơn vị</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedRequest.materials.map((m, i) => (
                                  <TableRow key={i}>
                                    <TableCell>{m.name}</TableCell>
                                    <TableCell>{m.requestQuantity}</TableCell>
                                    <TableCell>{m.unit}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      ) : (
                        <div>Không có dữ liệu</div>
                      )}

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailOpen(false)}>Đóng</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                <div className="mt-6 flex gap-3">
                  <Button onClick={handleCreateNew} className="bg-slate-900 text-white hover:bg-slate-800">
                    Lập phiếu mới
                  </Button>
                  <Button variant="outline" onClick={() => router.back()}>
                    Về lại trang NVL
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách phiếu đề xuất (summary) */}
          <div className="rounded-lg border bg-white p-6">
            <h4 className="font-medium mb-3">Danh sách Phiếu Đề Xuất Mua NVL</h4>
            <p className="text-sm text-slate-600 mb-4">Các phiếu đề xuất đã được tạo</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã phiếu</TableHead>
                  <TableHead>Ngày lập</TableHead>
                  <TableHead>Người xác nhận</TableHead>
                  <TableHead>Số lượng NVL</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-[120px]">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-slate-50">
                    <TableCell>{req.id}</TableCell>
                    <TableCell>{req.date}</TableCell>
                    <TableCell>{req.confirmer}</TableCell>
                    <TableCell>{req.materials.length} loại</TableCell>
                    <TableCell>
                      <span className="inline-block bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded-full text-xs">{req.status}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openRequestDetail(req)}>
                          Xem
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="px-4 py-2 text-primary border-b-2 border-primary inline-block rounded-md">Lập phiếu mua NVL</div>

      <Alert className="bg-orange-50 border-orange-200">
        <Info className="h-5 w-5 text-orange-500" />
        <AlertDescription className="text-orange-800 flex flex-col gap-2">
          <div>Hệ thống đề xuất lập phiếu nhập NVL. Dựa trên kế hoạch sản xuất, các NVL sau đang thiếu hoặc gần hết:</div>
          {suggestedShortages.length === 0 ? (
            <div className="text-sm">Không có thiếu hụt.</div>
          ) : (
            <ul className="list-disc ml-6">
              {suggestedShortages.map((s) => (
                <li key={s.name} className="cursor-pointer hover:underline" onClick={() => { setSelectedMaterial(s.name); setQuantity(String(s.need)); setUnit(s.unit); window.scrollTo({ top: 300, behavior: 'smooth' }); }}>
                  {s.name}: {s.need} {s.unit} <span className="text-xs text-slate-600">(click để thêm vào phiếu)</span>
                </li>
              ))}
            </ul>
          )}
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Lập Phiếu Đề Xuất Mua NVL</h2>
          <p className="text-sm text-muted-foreground">Nhập thông tin để tạo phiếu đề xuất mua nguyên vật liệu</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ngày lập phiếu *</label>
            <Input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Người xác nhận *</label>
            <Input 
              value={confirmer}
              onChange={(e) => setConfirmer(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="font-medium">Thêm nguyên vật liệu</h3>
          </div>

            <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Chọn NVL</label>
              <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                <SelectTrigger>
                  <SelectValue placeholder="-- Chọn nguyên vật liệu --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Keo dán">Keo dán</SelectItem>
                  <SelectItem value="Thép tấm CT3">Thép tấm CT3</SelectItem>
                  <SelectItem value="Vải">Vải</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Số lượng</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Số lượng"
                className="w-32"
              />
            </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Đơn vị</label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lít">lít</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="cái">cái</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            <Button onClick={handleAddMaterial} className="mb-0.5">
              <span>Thêm</span>
              <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5C15 5.53043 14.7893 6.03914 14.4142 6.41421C14.0391 6.78929 13.5304 7 13 7H11C10.4696 7 9.96086 6.78929 9.58579 6.41421C9.21071 6.03914 9 5.53043 9 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="font-medium">Danh sách NVL đề xuất mua</h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên NVL</TableHead>
                <TableHead>Tồn kho hiện tại</TableHead>
                <TableHead>Số lượng đề xuất</TableHead>
                <TableHead>Đơn vị</TableHead>
                <TableHead className="w-[100px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material, index) => (
                <TableRow key={index}>
                  <TableCell>{material.name}</TableCell>
                  <TableCell>{material.currentStock}</TableCell>
                  <TableCell>{material.requestQuantity}</TableCell>
                  <TableCell>{material.unit}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMaterial(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" onClick={handleCancelDraft}>
            Huỷ
          </Button>
          <Button variant="ghost" onClick={() => router.back()}>
            Quay lại
          </Button>
          <Button onClick={handleCreateRequest}>
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
              <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Tạo phiếu</span>
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận lập phiếu</DialogTitle>
            <DialogDescription>
              Hệ thống sẽ kiểm tra dữ liệu và lưu phiếu vào CSDL với trạng thái &quot;Chờ phê duyệt&quot;. Ban giám đốc sẽ nhận được thông báo về phiếu đề xuất này.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <h4 className="font-medium">Thông tin phiếu đề xuất:</h4>
            <ul className="mt-2 space-y-1">
              <li>• Ngày lập: {date}</li>  
              <li>• Người xác nhận: {confirmer}</li>
              <li>• Số lượng NVL: {materials.length} loại</li>
            </ul>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Quay lại</Button>
            <Button onClick={handleConfirm}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Detail dialog for viewing a saved request */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết phiếu</DialogTitle>
            <DialogDescription>Thông tin chi tiết phiếu đề xuất mua nguyên vật liệu</DialogDescription>
          </DialogHeader>

          {selectedRequest ? (
            <div className="py-2 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Mã phiếu</dt>
                  <dd className="font-medium">{selectedRequest.id}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Ngày lập</dt>
                  <dd className="font-medium">{selectedRequest.date}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Người xác nhận</dt>
                  <dd className="font-medium">{selectedRequest.confirmer}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Trạng thái</dt>
                  <dd><span className="inline-block bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded-full text-xs">{selectedRequest.status}</span></dd>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Danh sách NVL</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên NVL</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Đơn vị</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRequest.materials.map((m, i) => (
                      <TableRow key={i}>
                        <TableCell>{m.name}</TableCell>
                        <TableCell>{m.requestQuantity}</TableCell>
                        <TableCell>{m.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div>Không có dữ liệu</div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
>>>>>>> origin/thaibao-feature
=======
>>>>>>> origin/PhanHongLieu
