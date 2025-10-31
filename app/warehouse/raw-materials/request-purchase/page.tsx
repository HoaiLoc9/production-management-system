"use client"

import type React from "react"
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
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form')
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
  const [date, setDate] = useState("2025-10-29") // Current date: October 29, 2025
  const [confirmer, setConfirmer] = useState("Nguyễn Trần Thái Bảo")
  const router = useRouter()

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

  // Save requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('purchaseRequests', JSON.stringify(requests))
  }, [requests])

  const handleAddMaterial = () => {
    if (!selectedMaterial || !quantity) return
    
    // Validate quantity is positive
    const quantityNum = Number(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      alert("Số lượng phải lớn hơn 0")
      return
    }

    // Check for duplicate material
    if (materials.some(m => m.name === selectedMaterial)) {
      alert("Nguyên vật liệu này đã được thêm vào danh sách")
      return
    }

    const newMaterial: Material = {
      name: selectedMaterial,
      currentStock: currentStockLookup[selectedMaterial]?.stock || 0,
      requestQuantity: quantityNum,
      unit: currentStockLookup[selectedMaterial]?.unit || unit
    }

    setMaterials([...materials, newMaterial])
    setSelectedMaterial("")
    setQuantity("")
    setUnit(currentStockLookup[selectedMaterial]?.unit || "lít")
  }

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index))
  }

  const handleCreateRequest = () => {
    setOpen(true)
  }

  const handleCancelDraft = () => {
    setMaterials([])
    setSelectedMaterial("")
    setQuantity("")
    setUnit("lít")
    setDate(new Date().toISOString().split('T')[0])
  }

  const openRequestDetail = (req: PurchaseRequest) => {
    setSelectedRequest(req)
    setDetailOpen(true)
  }

  const handleConfirm = () => {
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
    setOpen(false)
    setSuccess(true)
    setActiveTab('list')
  }

  const handleCreateNew = () => {
    setSuccess(false)
    setMaterials([])
    setSelectedMaterial("")
    setQuantity("")
    setUnit("lít")
    setDate(new Date().toISOString().split('T')[0])
    setActiveTab('form')
  }

  const renderForm = () => (
    <div className="space-y-6">
      <Alert className="bg-orange-50 border-orange-200">
        <Info className="h-5 w-5 text-orange-500" />
        <AlertDescription className="text-orange-800 flex flex-col gap-2">
          <div>Hệ thống đề xuất lập phiếu nhập NVL. Dựa trên kế hoạch sản xuất, các NVL sau đang thiếu hoặc gần hết:</div>
          {suggestedShortages.length === 0 ? (
            <div className="text-sm">Không có thiếu hụt.</div>
          ) : (
            <ul className="list-disc ml-6">
              {suggestedShortages.map((s) => (
                <li key={s.name} className="cursor-pointer hover:underline" onClick={() => { setSelectedMaterial(s.name); setQuantity(String(s.need)); setUnit(s.unit); }}>
                  {s.name}: {s.need} {s.unit} <span className="text-xs text-slate-600">(click để thêm vào phiếu)</span>
                </li>
              ))}
            </ul>
          )}
        </AlertDescription>
      </Alert>

      <div className="rounded-lg border bg-white p-6 space-y-6">
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
    </div>
  )

  const renderList = () => (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-medium">Danh sách Phiếu Đề Xuất Mua NVL</h4>
          <p className="text-sm text-slate-600">Các phiếu đề xuất đã được tạo</p>
        </div>
        <Button onClick={() => setActiveTab('form')} className="bg-slate-900 text-white hover:bg-slate-800">
          Lập phiếu mới
        </Button>
      </div>

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
  )

  if (success) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex gap-4 border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'form' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('form')}
          >
            Lập phiếu mua NVL
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'list' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('list')}
          >
            Danh sách phiếu đề xuất
          </button>
        </div>

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

              <div className="mt-6">
                <Button onClick={handleCreateNew} className="bg-slate-900 text-white hover:bg-slate-800">
                  Lập phiếu mới
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex gap-4 border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'form' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={() => setActiveTab('form')}
        >
          Lập phiếu mua NVL
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'list' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={() => setActiveTab('list')}
        >
          Danh sách phiếu đề xuất
        </button>
      </div>

      {activeTab === 'form' ? renderForm() : renderList()}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận tạo phiếu</DialogTitle>
            <DialogDescription>Xác nhận thông tin phiếu đề xuất mua nguyên vật liệu</DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <div className="rounded-md bg-slate-50 p-4">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-slate-600">Ngày lập phiếu</dt>
                  <dd className="font-medium mt-1">{date}</dd>
                </div>
                <div>
                  <dt className="text-slate-600">Người xác nhận</dt>
                  <dd className="font-medium mt-1">{confirmer}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Danh sách nguyên vật liệu</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên NVL</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Đơn vị</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((m, i) => (
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

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Huỷ
            </Button>
            <Button onClick={handleConfirm}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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