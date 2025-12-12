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
  id: string
  name: string
  currentStock: number | null
  requestQuantity: number
  unit: string
}

interface PurchaseRequest {
  id: string
  date: string
  requester: string
  materials: Material[]
  status: string
  // thêm fields server có thể trả về
}

export default function PurchaseRequestPage() {
  const router = useRouter()

  // Mặc định để rỗng (không tạo NVL mẫu)
  const [materials, setMaterials] = useState<Material[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState("")
  const [quantity, setQuantity] = useState("")
  const [selectedUnit, setSelectedUnit] = useState("lít")
  const [requestDate, setRequestDate] = useState(() => {
    // Khởi tạo ngày hôm nay theo dd/mm/yyyy
    const d = new Date()
    const dd = String(d.getDate()).padStart(2, "0")
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const yyyy = d.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  })
  const [requester, setRequester] = useState("Nguyễn Trần Thái Bảo")
  const [showConfirm, setShowConfirm] = useState(false)
  const [successData, setSuccessData] = useState<PurchaseRequest | null>(null)
  const [allRequests, setAllRequests] = useState<PurchaseRequest[]>([])
  // lưu id của phiếu vừa tạo tạm thời (temp id) để xóa/replace chính xác
  const [lastCreatedTempId, setLastCreatedTempId] = useState<string | null>(null)
  const [errors, setErrors] = useState<string | null>(null)

  // Load persisted purchase requests from server when page mounts
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch('/api/warehouse/purchase-requests')
        if (res.ok) {
          const list = await res.json()
          if (mounted) setAllRequests(Array.isArray(list) ? list : [])
        } else {
          console.error('Không thể lấy danh sách phiếu:', await res.text())
        }
      } catch (err) {
        console.error('Lỗi khi lấy danh sách phiếu:', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // Helper validate before adding material or submitting
  const validateAddMaterial = () => {
    if (!selectedMaterial) {
      setErrors("Vui lòng chọn nguyên vật liệu.")
      return false
    }
    const q = Number(quantity)
    if (!quantity || isNaN(q) || !Number.isInteger(q) || q <= 0) {
      setErrors("Số lượng phải là số nguyên dương.")
      return false
    }
    // tránh trùng NVL (trùng theo name)
    if (materials.some((m) => m.name === selectedMaterial)) {
      setErrors("Nguyên vật liệu đã được thêm. Nếu cần, chỉnh sửa số lượng.")
      return false
    }
    setErrors(null)
    return true
  }

  const handleAddMaterial = async () => {
    if (!validateAddMaterial()) return

    // Lấy tồn kho thực từ server nếu có API; tạm đặt null (không sure)
    let stock: number | null = null
    try {
      // Nếu bạn có API cho tồn kho, bật đoạn dưới và sửa endpoint
      // const sres = await fetch(`/api/warehouse/materials/${encodeURIComponent(selectedMaterial)}`)
      // if (sres.ok) { const j = await sres.json(); stock = j.currentStock ?? null }
      // else stock = null
      stock = null
    } catch {
      stock = null
    }

    const newMaterial: Material = {
      id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      name: selectedMaterial,
      currentStock: stock,
      requestQuantity: Number(quantity),
      unit: selectedUnit,
    }

    // dùng functional update để tránh race condition
    setMaterials((prev) => [...prev, newMaterial])

    // reset form add
    setSelectedMaterial("")
    setQuantity("")
    setSelectedUnit("lít")
    setErrors(null)
  }

  const handleRemoveMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id))
  }

  const handleShowConfirm = () => {
    if (materials.length === 0) {
      setErrors("Vui lòng thêm ít nhất một nguyên vật liệu!")
      return
    }
    // validate also requester & date
    if (!requester.trim()) {
      setErrors("Vui lòng nhập người xác nhận.")
      return
    }
    if (!requestDate.trim()) {
      setErrors("Vui lòng nhập ngày lập phiếu.")
      return
    }
    setErrors(null)
    setShowConfirm(true)
  }

  const handleConfirmSubmit = async () => {
    setShowConfirm(false)

    // Tạo temporary request (optimistic) với id tạm thời
    const tempId = `temp-${crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`}`
    const optimisticRequest: PurchaseRequest = {
      id: tempId,
      date: requestDate,
      requester,
      materials,
      status: "Chờ phê duyệt", // hiển thị cho người dùng
    }

    // cập nhật theo functional update
    setAllRequests((prev) => [...prev, optimisticRequest])
    setLastCreatedTempId(tempId)
    setSuccessData(optimisticRequest)

    // Gửi đến API
    try {
      const response = await fetch("/api/warehouse/purchase-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // gửi kiểu dữ liệu server mong muốn
          date: requestDate,
          requester,
          materials: materials.map(({ id, ...m }) => m), // loại bỏ id cục bộ nếu server ko cần
          status: "pending",
        }),
      })

      if (!response.ok) {
        const txt = await response.text()
        console.error("Lỗi API:", txt)
        // keep optimistic but mark as failed
        setAllRequests((prev) => prev.map(r => r.id === tempId ? { ...r, status: "Lưu thất bại" } : r))
        setSuccessData((prev) => prev ? { ...prev, status: "Lưu thất bại" } : prev)
        return
      }

      const saved = await response.json()

      // Nếu server trả về id, thay thế optimistic entry chính xác bằng id server
      if (saved && saved.id) {
        setAllRequests((prev) => prev.map((r) => (r.id === tempId ? saved : r)))
        setSuccessData(saved)
        setLastCreatedTempId(saved.id)
      } else {
        // nếu server không trả id, cập nhật trạng thái / giữ server object
        setAllRequests((prev) => prev.map((r) => (r.id === tempId ? { ...r, ...saved } : r)))
        setSuccessData((prev) => prev ? { ...prev, ...saved } : prev)
      }
    } catch (error) {
      console.error("Lỗi khi gửi API:", error)
      setAllRequests((prev) => prev.map(r => r.id === tempId ? { ...r, status: "Lưu thất bại" } : r))
      setSuccessData((prev) => prev ? { ...prev, status: "Lưu thất bại" } : prev)
    }
  }

  const handleCancel = async () => {
    // Hủy form: nếu có temp created request thì xóa trên server (xóa bằng id server nếu có)
    if (lastCreatedTempId) {
      const want = confirm(`Bạn có chắc muốn hủy và xóa phiếu ${lastCreatedTempId} không?`)
      if (!want) return

      // tìm phiếu cục bộ theo temp id (có thể đã được replace bằng id server)
      const target = allRequests.find(r => r.id === lastCreatedTempId) ||
                     allRequests[allRequests.length - 1] // fallback

      if (!target) {
        // nothing to delete
        setMaterials([])
        setSelectedMaterial("")
        setQuantity("")
        setSelectedUnit("lít")
        router.push("/warehouse/materials")
        return
      }

      try {
        // Nếu id bắt đầu với "temp-" thì server không có, chỉ xóa local
        if (String(target.id).startsWith("temp-")) {
          // chỉ xóa local
          setAllRequests((prev) => prev.filter(r => r.id !== target.id))
          alert("Phiếu tạm đã bị hủy (chỉ ở local).")
        } else {
          const res = await fetch(`/api/warehouse/purchase-requests/${encodeURIComponent(target.id)}`, {
            method: "DELETE",
          })
          if (!res.ok) {
            const txt = await res.text()
            console.error("Lỗi xóa phiếu:", txt)
            alert("Không thể xóa phiếu trên server. Kiểm tra console.")
          } else {
            setAllRequests((prev) => prev.filter(r => r.id !== target.id))
            alert("Phiếu đã được hủy và xóa.")
          }
        }
        // reset local form
        setMaterials([])
        setSelectedMaterial("")
        setQuantity("")
        setSelectedUnit("lít")
        setLastCreatedTempId(null)
        setSuccessData(null)
        router.push("/warehouse/materials")
      } catch (error) {
        console.error("Lỗi khi xóa phiếu:", error)
        alert("Lỗi khi xóa phiếu. Kiểm tra console.")
      }
      return
    }

    // Nếu không có lastCreatedTempId thì chỉ reset form và điều hướng
    const want = confirm("Bạn có chắc muốn huỷ? Dữ liệu chưa lưu sẽ mất.")
    if (!want) return
    setMaterials([])
    setSelectedMaterial("")
    setQuantity("")
    setSelectedUnit("lít")
    setErrors(null)
    router.push("/warehouse/materials")
  }

  const alertText =
    materials.length > 0
      ? `Hệ thống đề xuất lập phiếu nhập nguyên vật liệu. Có ${materials.length} loại NVL đang cần:` // sửa từ "gần hết"
      : "Không có nguyên vật liệu nào cần mua."

  // Hiển thị trang success nếu phiếu đã tạo
  if (successData) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Success Header */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="text-green-600 text-3xl">✓</div>
            <div>
              <h1 className="text-2xl font-bold text-green-700">Lập Phiếu Thành Công</h1>
              <p className="text-green-600">Phiếu đề xuất mua NVL đã được lưu vào hệ thống</p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        <Alert className="border-green-200 bg-green-50">
          <Info className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <p>✓ Phiếu đề xuất đã được lưu với trạng thái "{successData.status}". Ban giám đốc sẽ nhận được thông báo.</p>
          </AlertDescription>
        </Alert>

        {/* Request Info */}
        <div className="bg-white rounded-lg border p-6 space-y-6">
          <h2 className="text-lg font-semibold">Thông tin phiếu đề xuất</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Mã phiếu:</p>
              <p className="font-semibold">{successData.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ngày lập:</p>
              <p className="font-semibold">{successData.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Người xác nhận:</p>
              <p className="font-semibold">{successData.requester}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Trạng thái:</p>
              <p className="font-semibold text-yellow-600 bg-yellow-50 px-3 py-1 rounded inline-block">{successData.status}</p>
            </div>
          </div>

          {/* Materials Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tên NVL</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Tên NVL</TableHead>
                    <TableHead>Số lượng đề xuất</TableHead>
                    <TableHead>Đơn vị</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {successData.materials.map((material: Material) => (
                    <TableRow key={material.id}>
                      <TableCell>{material.name}</TableCell>
                      <TableCell>{material.requestQuantity}</TableCell>
                      <TableCell>{material.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              onClick={() => {
                setSuccessData(null)
                setMaterials([])
                setSelectedMaterial("")
                setQuantity("")
                setSelectedUnit("lít")
              }}
              className="bg-black text-white hover:bg-gray-800"
            >
              Lập phiếu mới
            </Button>
             {/* Nút quay về kho NVL */}
              <Button
                variant="outline"
                onClick={() => router.push("/warehouse/materials")}
              >
                ← Quay về kho NVL
              </Button>
          </div>
        </div>

        {/* List of Created Requests */}
        <div className="bg-white rounded-lg border p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Danh sách Phiếu Đề Xuất Mua NVL</h2>
            <p className="text-gray-600 text-sm">Các phiếu đề xuất đã được tạo</p>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Mã phiếu</TableHead>
                  <TableHead>Ngày lập</TableHead>
                  <TableHead>Người xác nhận</TableHead>
                  <TableHead>Số lượng NVL</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      Chưa có phiếu nào được tạo
                    </TableCell>
                  </TableRow>
                ) : (
                  allRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-semibold">{request.id}</TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>{request.requester}</TableCell>
                      <TableCell>{request.materials.length} loại</TableCell>
                      <TableCell>
                        <span className="text-yellow-600 bg-yellow-50 px-3 py-1 rounded text-sm">
                          {request.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Lập Phiếu Mua NVL</h1>

      {/* inline errors */}
      {errors && (
        <div className="mb-4 text-red-700 bg-red-50 border border-red-100 rounded p-3">
          {errors}
        </div>
      )}

      {/* Alert Section */}
      <Alert className="border-orange-200 bg-orange-50 mb-6">
        <Info className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <p className="font-semibold mb-2">{alertText}</p>
          {materials.length > 0 && (
            <ul className="list-disc list-inside space-y-1">
              {materials.map((m) => (
                <li key={m.id}>
                  {m.name}: {m.currentStock ?? "—"} {m.unit}
                </li>
              ))}
            </ul>
          )}
        </AlertDescription>
      </Alert>

      {/* Main grid: form (left) + created requests (right) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: form area spans 2 columns on md+ */}
        <div className="md:col-span-2 bg-white rounded-lg border p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Lập Phiếu Đề Xuất Mua NVL</h2>
            <p className="text-gray-600 mb-6">Nhập thông tin để tạo phiếu đề xuất mua nguyên vật liệu</p>

            {/* Date and Requester Fields */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold mb-2">Ngày lập phiếu *</label>
                <Input
                  type="text"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                  className="bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Người xác nhận *</label>
                <Input
                  type="text"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  className="bg-gray-100"
                />
              </div>
            </div>

            {/* Add Material Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🛒</span>
                <h3 className="text-lg font-semibold">Thêm nguyên vật liệu</h3>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Chọn NVL</label>
                  <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="-- Chọn nguyên vật liệu --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Keo dán">Keo dán</SelectItem>
                      <SelectItem value="Sơn PU">Sơn PU</SelectItem>
                      <SelectItem value="Chất tẩy rửa">Chất tẩy rửa</SelectItem>
                      <SelectItem value="Bánh xe">Bánh xe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Số lượng</label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Số lượng"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Đơn vị</label>
                  <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lít">lít</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="cái">cái</SelectItem>
                      <SelectItem value="bộ">bộ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleAddMaterial}
                    className="w-full bg-black text-white hover:bg-gray-800"
                  >
                    + Thêm
                  </Button>
                </div>
              </div>
            </div>

            {/* Materials Table */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Danh sách NVL để xuất mua</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Tên NVL</TableHead>
                      <TableHead>Tồn kho hiện tại</TableHead>
                      <TableHead>Số lượng đề xuất</TableHead>
                      <TableHead>Đơn vị</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                          Chưa có nguyên vật liệu nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      materials.map((material) => (
                        <TableRow key={material.id}>
                          <TableCell>{material.name}</TableCell>
                          <TableCell>{material.currentStock ?? "—"}</TableCell>
                          <TableCell>{material.requestQuantity}</TableCell>
                          <TableCell>{material.unit}</TableCell>
                          <TableCell>
                            <button
                              onClick={() => handleRemoveMaterial(material.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              onClick={handleShowConfirm}
              className="bg-black text-white hover:bg-gray-800"
            >
              ✓ Tạo phiếu
            </Button>
            <Button variant="outline" onClick={handleCancel}>Hủy</Button>
          </div>
        </div>

        {/* Right: created requests list */}
        <aside className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-2">Danh sách phiếu đã tạo</h2>
          <p className="text-sm text-gray-600 mb-4">Các phiếu NVL đã được tạo trong phiên này</p>

          <div className="max-h-[60vh] overflow-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>SL NVL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">Chưa có phiếu nào</TableCell>
                  </TableRow>
                ) : (
                  allRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-semibold">{req.id}</TableCell>
                      <TableCell>{req.date}</TableCell>
                      <TableCell>{req.materials.length} loại</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </aside>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận lập phiếu</DialogTitle>
            <DialogDescription>
              Hệ thống sẽ kiểm tra dữ liệu và lưu phiếu vào CSDL với trạng thái "Chờ phê duyệt". Bạn giám đốc sẽ nhận được thông báo về phiếu đề xuất này.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div>
              <p className="font-semibold mb-2">Thông tin phiếu đề xuất:</p>
              <ul className="space-y-1 text-sm">
                <li>• Ngày lập: {requestDate}</li>
                <li>• Người xác nhận: {requester}</li>
                <li>• Số lượng NVL: {materials.length} loại</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
            >
              Quay lại
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              className="bg-black text-white hover:bg-gray-800"
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
