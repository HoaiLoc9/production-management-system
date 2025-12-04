"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Clipboard } from "lucide-react"

interface ProductionPlan {
  id: number
  code: string
  product: string
  quantity: number
  startDate: string
  endDate: string
  status: string
}

export default function ManageProductionPlansPage() {
  const [plans, setPlans] = useState<ProductionPlan[]>([])
  const [selected, setSelected] = useState<ProductionPlan | null>(null)
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending")

  // Load plans from localStorage
  useEffect(() => {
    const allPlans: ProductionPlan[] = JSON.parse(
      localStorage.getItem("productionPlans") || "[]"
    )
    setPlans(allPlans)
  }, [])

  const openAction = (plan: ProductionPlan, type: "approve" | "reject") => {
    setSelected(plan)
    setAction(type)
    setShowActionDialog(true)
  }

  const openDetail = (plan: ProductionPlan) => {
    setSelected(plan)
    setShowDetailDialog(true)
  }

  const processAction = () => {
    if (!selected || !action) return

    const updatedPlans = plans.map((p) => {
      if (p.id === selected.id) {
        return { ...p, status: action === "approve" ? "approved" : "rejected" }
      }
      return p
    })
    localStorage.setItem("productionPlans", JSON.stringify(updatedPlans))
    setPlans(updatedPlans)
    setShowActionDialog(false)
  }

  const filteredPlans =
    activeTab === "pending"
      ? plans.filter((p) => p.status === "in-progress")
      : plans.filter((p) => p.status === "approved")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clipboard className="w-6 h-6 text-blue-500" /> Quản lý kế hoạch sản xuất
        </h1>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "pending" ? "default" : "outline"}
            onClick={() => setActiveTab("pending")}
          >
            Đang chờ duyệt
          </Button>
          <Button
            variant={activeTab === "approved" ? "default" : "outline"}
            onClick={() => setActiveTab("approved")}
          >
            Đã duyệt
          </Button>
        </div>
      </div>

      {activeTab === "pending" && (
        <Alert className="border-blue-200 bg-blue-50 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Các kế hoạch sản xuất đang chờ phê duyệt.
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Mã kế hoạch</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Tổng số lượng</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                {activeTab === "pending" && <TableHead>Thao tác</TableHead>}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredPlans.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={activeTab === "pending" ? 6 : 5}
                    className="text-center text-gray-500 py-4"
                  >
                    {activeTab === "pending"
                      ? "Không có kế hoạch nào đang chờ duyệt"
                      : "Chưa có kế hoạch nào được duyệt"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlans.map((plan) => (
                  <TableRow
                    key={plan.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => openDetail(plan)}
                  >
                    <TableCell className="font-semibold">{plan.code}</TableCell>
                    <TableCell>{plan.product}</TableCell>
                    <TableCell>{plan.quantity}</TableCell>
                    <TableCell>{plan.startDate}</TableCell>
                    <TableCell>{plan.endDate}</TableCell>
                    {activeTab === "pending" && (
                      <TableCell className="flex gap-2">
                        <Button
                          className="bg-green-600 text-white hover:bg-green-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            openAction(plan, "approve")
                          }}
                        >
                          ✓ Phê duyệt
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            openAction(plan, "reject")
                          }}
                        >
                          ✗ Từ chối
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dialog xem chi tiết */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Thông tin kế hoạch sản xuất</DialogTitle>
            <DialogDescription>
              {selected && (
                <div className="space-y-2 mt-3">
                  <div>Mã kế hoạch: <strong>{selected.code}</strong></div>
                  <div>Sản phẩm: <strong>{selected.product}</strong></div>
                  <div>Tổng số lượng: <strong>{selected.quantity}</strong></div>
                  <div>Thời gian: <strong>{selected.startDate}</strong> → <strong>{selected.endDate}</strong></div>
                  <div>Trạng thái: <strong>{selected.status}</strong></div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog phê duyệt/từ chối */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {action === "approve" ? "Phê duyệt kế hoạch" : "Từ chối kế hoạch"}
            </DialogTitle>
            <DialogDescription>
              {selected && (
                <div className="space-y-2 mt-3">
                  <div>Mã kế hoạch: <strong>{selected.code}</strong></div>
                  <div>Sản phẩm: <strong>{selected.product}</strong></div>
                  <div>Tổng số lượng: <strong>{selected.quantity}</strong></div>
                  <div>Thời gian: <strong>{selected.startDate}</strong> → <strong>{selected.endDate}</strong></div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Quay lại
            </Button>
            <Button
              className={action === "approve" ? "bg-green-600 text-white" : "bg-red-600 text-white"}
              onClick={processAction}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
