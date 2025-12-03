"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

interface Material {
  name: string
  requestQuantity: number
  unit: string
}

interface PurchaseRequest {
  id: string
  date: string
  requester: string
  materials: Material[]
  status: "pending" | "approved" | "rejected"
  rejectReason?: string
}

export default function ApprovePurchasePage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([])
  const [selected, setSelected] = useState<PurchaseRequest | null>(null)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  // Load danh sách phiếu từ API
  const loadRequests = async () => {
    try {
      const res = await fetch("/api/warehouse/purchase-requests")
      if (res.ok) {
        const data = await res.json()
        setRequests(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const openAction = (req: PurchaseRequest, type: "approve" | "reject") => {
    setSelected(req)
    setAction(type)
    setRejectReason("") // reset lý do mỗi lần mở dialog
    setShowDialog(true)
  }

  const processAction = async () => {
    if (!selected || !action) return

    const endpoint =
      action === "approve"
        ? `/api/warehouse/purchase-requests/${selected.id}/approve`
        : `/api/warehouse/purchase-requests/${selected.id}/reject`

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action === "reject" ? { reason: rejectReason } : {})
      })

      if (res.ok) {
        // reload danh sách phiếu sau khi duyệt/từ chối
        await loadRequests()
        setShowDialog(false)
        setRejectReason("")
      } else {
        alert("Không thể cập nhật trạng thái phiếu")
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Duyệt Phiếu Mua NVL</h1>

      <Table className="bg-white rounded-lg border">
        <TableHeader>
          <TableRow>
            <TableHead>Mã phiếu</TableHead>
            <TableHead>Ngày</TableHead>
            <TableHead>Người lập</TableHead>
            <TableHead>Số NVL</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                Không có phiếu nào
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.id}</TableCell>
                <TableCell>{req.date}</TableCell>
                <TableCell>{req.requester}</TableCell>
                <TableCell>{req.materials.length}</TableCell>
                <TableCell>
                  {req.status === "pending" ? (
                    <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded">{req.status}</span>
                  ) : req.status === "approved" ? (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded">{req.status}</span>
                  ) : (
                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded">{req.status}</span>
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  {req.status === "pending" && (
                    <>
                      <Button className="bg-green-600 text-white" onClick={() => openAction(req, "approve")}>✓ Duyệt</Button>
                      <Button className="bg-red-600 text-white" onClick={() => openAction(req, "reject")}>✗ Từ chối</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Dialog phê duyệt / từ chối */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{action === "approve" ? "Phê duyệt phiếu" : "Từ chối phiếu"}</DialogTitle>
            <DialogDescription>
              {selected && (
                <div className="space-y-1">
                  <p>Mã phiếu: <strong>{selected.id}</strong></p>
                  <p>Người lập: <strong>{selected.requester}</strong></p>
                  <p>Số NVL: <strong>{selected.materials.length}</strong></p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Nếu từ chối, hiện textarea nhập lý do */}
          {action === "reject" && (
            <div className="mt-4">
              <label className="block mb-1 font-medium">Lý do từ chối:</label>
              <textarea
                className="w-full border rounded p-2"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối phiếu"
              />
            </div>
          )}

          <DialogFooter className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>Quay lại</Button>
            <Button
              className={action === "approve" ? "bg-green-600 text-white" : "bg-red-600 text-white"}
              onClick={processAction}
              disabled={action === "reject" && rejectReason.trim() === ""}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
