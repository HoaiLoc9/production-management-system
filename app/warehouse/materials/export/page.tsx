"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"

type MaterialItem = {
  name: string
  requestedQty: number
  stockQty: number
  unit: string
}

type RequestItem = {
  id: string
  date: string // display date
  dateIso?: string // ISO date for input value
  requester: string
  department: string
  materials: MaterialItem[]
  status: string
}

const mockRequests: RequestItem[] = [
  {
    id: "REQ-2025-001",
    date: "20/10/2025",
    dateIso: "2025-10-20",
    requester: "Nguyễn Văn A",
    department: "Xưởng Sản Xuất 1",
    status: "Chờ xử lý",
    materials: [
      { name: "Thép tấm CT3", requestedQty: 50, stockQty: 200, unit: "kg" },
      { name: "Sơn chống gỉ", requestedQty: 10, stockQty: 50, unit: "lít" },
    ],
  },
  {
    id: "REQ-2025-002",
    date: "21/10/2025",
    dateIso: "2025-10-21",
    requester: "Trần Thị B",
    department: "Xưởng Sản Xuất 2",
    status: "Chờ xử lý",
    materials: [
      { name: "Keo dán", requestedQty: 20, stockQty: 100, unit: "lít" },
      { name: "Bánh xe", requestedQty: 5, stockQty: 20, unit: "cái" },
    ],
  },
  {
    id: "REQ-2025-003",
    date: "21/10/2025",
    dateIso: "2025-10-21",
    requester: "Lê Văn C",
    department: "Xưởng Lắp Ráp",
    status: "Chờ xử lý",
    materials: [
      { name: "Gỗ MDF", requestedQty: 30, stockQty: 40, unit: "tấm" },
      { name: "Đinh ốc", requestedQty: 200, stockQty: 500, unit: "cái" },
    ],
  },
]

export default function RawMaterialsExportPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    material_type: "",
    quantity: "",
    unit: "",
    destination: "",
    notes: "",
  })
  const [requests, setRequests] = useState<RequestItem[]>(mockRequests)
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null)
  const [completedRequests, setCompletedRequests] = useState<Set<string>>(new Set())
  const [materials, setMaterials] = useState<(
    MaterialItem & { exportQty: number }
  )[]>([])
  const [exportDate, setExportDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [successData, setSuccessData] = useState<{id: string; date: string; requester: string; department: string; materials: Array<{name: string; exportQty: number; unit: string}>} | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  useEffect(() => {
    // Load completed requests from localStorage
    const saved = localStorage.getItem('completedExportRequests')
    const completed = saved ? new Set(JSON.parse(saved)) : new Set()
    setCompletedRequests(completed)
    
    // Update requests status based on completed requests
    const updatedRequests = mockRequests.map(r => ({
      ...r,
      status: completed.has(r.id) ? "Hoàn thành" : "Chờ xử lý"
    }))
    setRequests(updatedRequests)
    
    setSelectedRequest(null)
    setMaterials([])
    setExportDate(new Date().toISOString().slice(0, 10))
    setSuccessData(null)
  }, [])

  useEffect(() => {
    if (selectedRequest) {
      // initialize materials with exportQty default to requestedQty
      setMaterials(
        selectedRequest.materials.map((m) => ({ ...m, exportQty: m.requestedQty }))
      )
      setExportDate(selectedRequest.dateIso ?? new Date().toISOString().slice(0, 10))
    } else {
      setMaterials([])
    }
  }, [selectedRequest])

  const handleChangeExportQty = (index: number, value: number) => {
    setMaterials((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], exportQty: value }
      return next
    })
  }

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const validateMaterials = () => {
    for (const m of materials) {
      if (m.exportQty > m.stockQty) {
        alert(`Số lượng xuất cho "${m.name}" vượt quá tồn kho.`)
        return false
      }
      if (m.exportQty <= 0) {
        alert(`Số lượng xuất cho "${m.name}" phải lớn hơn 0.`)
        return false
      }
    }
    return true
  }

  const handleConfirmClick = () => {
    if (!validateMaterials()) return
    // open confirmation dialog
    setShowConfirmDialog(true)
  }

  const performExport = () => {
    if (!selectedRequest) return
    
    const exportMaterials = materials
      .filter(m => m.exportQty > 0)
      .map(m => ({
        name: m.name,
        exportQty: m.exportQty,
        unit: m.unit
      }))
    
    setSuccessData({
      id: selectedRequest.id,
      date: exportDate,
      requester: selectedRequest.requester,
      department: selectedRequest.department,
      materials: exportMaterials
    })
    
    // Mark request as completed and update status
    const newCompleted = new Set([...completedRequests, selectedRequest.id])
    setCompletedRequests(newCompleted)
    // Save to localStorage
    localStorage.setItem('completedExportRequests', JSON.stringify(Array.from(newCompleted)))
    
    setRequests(prev => prev.map(r => 
      r.id === selectedRequest.id ? { ...r, status: "Hoàn thành" } : r
    ))
    
    setShowConfirmDialog(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Xuất Nguyên Vật Liệu</h1>
        <p className="text-muted-foreground mt-2">Chọn một phiếu yêu cầu để tiến hành xuất kho nguyên vật liệu</p>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => router.push("/warehouse/materials")}>
          ← Quay lại trang chủ
        </Button>
      </div>

      {!selectedRequest ? (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Phiếu Yêu Cầu Xuất NVL</CardTitle>
            <CardDescription>Chọn một phiếu yêu cầu để tiến hành xuất kho nguyên vật liệu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-muted-foreground">
                    <th className="py-4 px-4">Mã phiếu</th>
                    <th className="py-4 px-4">Ngày yêu cầu</th>
                    <th className="py-4 px-4">Người yêu cầu</th>
                    <th className="py-4 px-4">Bộ phận</th>
                    <th className="py-4 px-4">Vật liệu</th>
                    <th className="py-4 px-4">Trạng thái</th>
                    <th className="py-4 px-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="py-4 px-4">{r.id}</td>
                      <td className="py-4 px-4">{r.date}</td>
                      <td className="py-4 px-4">{r.requester}</td>
                      <td className="py-4 px-4">{r.department}</td>
                      <td className="py-4 px-4">{r.materials.length} loại NVL</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${r.status === "Hoàn thành" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>{r.status}</span>
                      </td>
                      <td className="py-4 px-4">
                        {r.status === "Hoàn thành" ? (
                          <span className="text-gray-400 text-sm">—</span>
                        ) : (
                          <Button onClick={() => setSelectedRequest(r)} className="bg-black text-white">Xử lý</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : successData ? (
        // Success Screen
        <div>
          <div className="mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-green-900">Xuất Kho Thành Công</h2>
                <p className="text-sm text-green-700">Phiếu xuất kho đã được lập và lưu vào hệ thống</p>
              </div>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Thông Tin Phiếu Xuất Kho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Mã phiếu</p>
                  <p className="font-semibold text-sm mt-1">{successData.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Ngày xuất kho</p>
                  <p className="font-semibold text-sm mt-1">{successData.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Người yêu cầu</p>
                  <p className="font-semibold text-sm mt-1">{successData.requester}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Bộ phận</p>
                  <p className="font-semibold text-sm mt-1">{successData.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Danh Sách Nguyên Vật Liệu Xuất Kho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 text-sm text-muted-foreground">
                    <tr>
                      <th className="py-3 px-4 text-left">Tên NVL</th>
                      <th className="py-3 px-4 text-left">Số lượng xuất</th>
                      <th className="py-3 px-4 text-left">Đơn vị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {successData.materials.map((m) => (
                      <tr key={m.name} className="border-t">
                        <td className="py-3 px-4">{m.name}</td>
                        <td className="py-3 px-4 font-medium">{m.exportQty}</td>
                        <td className="py-3 px-4">{m.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button className="bg-black text-white">
              🖨️ In phiếu xuất
            </Button>
            <Button variant="outline" onClick={() => {
              setSuccessData(null)
              setSelectedRequest(null)
            }}>
              ← Quay lại danh sách
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Xuất Kho Nguyên Vật Liệu</h2>
              <p className="text-sm text-muted-foreground">Xử lý phiếu yêu cầu: {selectedRequest.id}</p>
            </div>
            <div>
              <Button variant="ghost" onClick={() => setSelectedRequest(null)}>← Quay lại</Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-muted-foreground">Người yêu cầu:</h4>
                  <div className="font-medium">{selectedRequest.requester}</div>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Bộ phận:</h4>
                  <div className="font-medium">{selectedRequest.department}</div>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Ngày yêu cầu:</h4>
                  <div className="font-medium">{selectedRequest.date}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <label className="block text-sm font-medium mb-2">Ngày lập phiếu xuất *</label>
            <Input type="date" value={exportDate} onChange={(e) => setExportDate(e.target.value)} className="max-w-xs" />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Danh sách nguyên vật liệu</h3>

            <div className="overflow-x-auto bg-white rounded-lg border">
              <table className="w-full">
                <thead className="bg-gray-50 text-sm text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4 text-left">Tên NVL</th>
                    <th className="py-3 px-4 text-left">Số lượng yêu cầu</th>
                    <th className="py-3 px-4 text-left">Tồn kho</th>
                    <th className="py-3 px-4 text-left">Số lượng xuất</th>
                    <th className="py-3 px-4 text-left">Đơn vị</th>
                    <th className="py-3 px-4 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m, idx) => (
                    <tr key={m.name} className="border-t">
                      <td className="py-3 px-4">{m.name}</td>
                      <td className="py-3 px-4">{m.requestedQty}</td>
                      <td className="py-3 px-4 text-green-600 font-medium">{m.stockQty}</td>
                      <td className="py-3 px-4 w-48">
                        <Input
                          type="number"
                          value={String(m.exportQty ?? m.requestedQty)}
                          onChange={(e) => handleChangeExportQty(idx, Number(e.target.value))}
                          className="w-full"
                        />
                      </td>
                      <td className="py-3 px-4">{m.unit}</td>
                      <td className="py-3 px-4">
                        {m.stockQty >= (m.exportQty ?? m.requestedQty) ? (
                          <span className="text-green-600">Đủ hàng</span>
                        ) : (
                          <span className="text-red-600">Thiếu</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Button onClick={handleConfirmClick} className="bg-black text-white">Xác nhận</Button>
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>Hủy</Button>
            </div>
          </div>

          {/* Confirmation Dialog */}
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Xác nhận xuất kho</DialogTitle>
                <DialogDescription>
                  Hệ thống sẽ xác minh lại chứng từ liên quan trước khi lập phiếu xuất. Bạn có chắc chắn muốn tạo phiếu xuất kho này không?
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-4">
                <div>
                  <p className="font-semibold mb-2">Thông tin xuất kho:</p>
                  <ul className="space-y-1 text-sm list-disc list-inside text-muted-foreground">
                    {materials.map((m) => (
                      <li key={m.name}>{m.name}: {m.exportQty} {m.unit}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <DialogFooter className="flex gap-3">
                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Hủy</Button>
                <Button onClick={performExport} className="bg-black text-white">Xác nhận</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
