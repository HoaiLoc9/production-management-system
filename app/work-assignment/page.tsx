"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Sidebar from "@/components/layout/sidebar" // Đường dẫn sidebar của bạn

export default function WorkAssignments() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [assignments, setAssignments] = useState<{ [key: number]: string }>({})
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [plans, setPlans] = useState<any[]>([])

  interface Plan {
    id: string
    orderCode: string
    product: string
    quantity: number
    workshop: string
    deliveryDate: string
    importDate: string
    note: string
    assigned: boolean
    assignedSteps: { [key: number]: string }
  }
  
  const workSteps = [
    "Cắt gỗ theo khuôn mẫu",
    "Bảo dưỡng bề mặt",
    "Khoan lỗ và tạo then",
    "Lắp ráp khung ghế",
    "Sơn lót và phủ",
    "Bọc nệm và hoàn thiện",
    "Kiểm tra chất lượng",
    "Đóng gói",
  ]

  useEffect(() => {
    try {
      const savedPlans = localStorage.getItem("plans")
      const parsed = savedPlans ? JSON.parse(savedPlans) : null

      if (Array.isArray(parsed) && parsed.length > 0) {
        setPlans(parsed)
      } else {
        setPlans([
          {
            id: "KH001",
            orderCode: "#X7K9P2M5",
            product: "Ghế gỗ cao cấp",
            quantity: 500,
            workshop: "Xưởng 1",
            deliveryDate: "30/11/2025",
            importDate: "25/11/2025",
            note: "Ưu tiên hoàn thành trước thời hạn",
            assigned: true,
            assignedSteps: {
              0: "to1",
              1: "to2",
              2: "to3",
              3: "to4",
              4: "to5",
              5: "to6",
              6: "to7",
              7: "to8",
            },
          },
          {
            id: "KH002",
            orderCode: "#A1B2C3D4",
            product: "Bàn gỗ tròn",
            quantity: 200,
            workshop: "Xưởng 2",
            deliveryDate: "10/12/2025",
            importDate: "05/12/2025",
            note: "Làm mẫu trưng bày",
            assigned: false,
            assignedSteps: {},
          },
          {
            id: "KH003",
            orderCode: "#28G68RTY",
            product: "Tủ 3 cánh",
            quantity: 100,
            workshop: "Xưởng 2",
            deliveryDate: "30/12/2025",
            importDate: "20/11/2025",
            note: "Ưu tiên hoàn thành trước thời hạn",
            assigned: false,
            assignedSteps: {},
          },
          {
            id: "KH004",
            orderCode: "#159654DR",
            product: "Ghế gỗ cao cấp",
            quantity: 500,
            workshop: "Xưởng 1",
            deliveryDate: "15/01/2026",
            importDate: "25/11/2025",
            note: "Ưu tiên hoàn thành trước thời hạn",
            assigned: false,
            assignedSteps: {},
          },
        ])
      }
    } catch (err) {
      console.error("Lỗi khi đọc localStorage:", err)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("plans", JSON.stringify(plans))
  }, [plans])

  const handleClick = (plan: any) => {
    setSelectedPlan(plan)
    setOpen(true)
    setError("")
    setIsReadOnly(plan.assigned)

    if (plan.assigned && plan.assignedSteps) {
      setAssignments({ ...plan.assignedSteps })
    } else {
      setAssignments({})
    }
  }

  const handleSave = () => {
    const missingSteps = workSteps.filter((_, i) => !assignments[i])
    if (missingSteps.length > 0) {
      setError("Vui lòng chọn tổ thực hiện cho tất cả công đoạn.")
      return
    }

    const selectedTeams = Object.values(assignments)
    const hasDuplicate = new Set(selectedTeams).size !== selectedTeams.length
    if (hasDuplicate) {
      setError("Không được phân công trùng tổ.")
      return
    }

    if (!selectedPlan?.id) return

    setPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.id === selectedPlan.id
          ? {
              ...plan,
              assigned: true,
              assignedSteps: { ...assignments },
            }
          : plan
      )
    )

    setOpen(false)
    setAssignments({})
    setError("")
    setSuccessMessage("✅ Phân công thành công!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        <h1 className="text-3xl font-bold">Phân công công việc</h1>

        {successMessage && (
          <div className="rounded p-3 text-sm border text-green-600 bg-green-100 border-green-300">
            {successMessage}
          </div>
        )}

        <p className="text-muted-foreground">
          Chọn kế hoạch sản xuất để xem chi tiết và phân công công đoạn
        </p>

        <div className="space-y-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleClick(plan)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{plan.id} - {plan.orderCode}</p>
                    <p className="text-sm text-muted-foreground">
                      Sản phẩm: {plan.product} | Số lượng: {plan.quantity} | Xưởng: {plan.workshop}
                    </p>
                  </div>
                  <div>
                    {plan.assigned ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Đã phân công</Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-500 border-red-400">Chưa phân công</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Phân công công việc</DialogTitle>
              <DialogDescription>
                {isReadOnly
                  ? "Lịch phân công đã được thiết lập"
                  : "Chi tiết kế hoạch sản xuất và phân công công đoạn"}
              </DialogDescription>
            </DialogHeader>

            {selectedPlan && (
              <>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h2 className="text-xl font-semibold mb-2">Chi tiết kế hoạch sản xuất</h2>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div><strong>Mã kế hoạch:</strong> {selectedPlan.id}</div>
                    <div><strong>Mã đơn hàng:</strong> {selectedPlan.orderCode}</div>
                    <div><strong>Sản phẩm:</strong> {selectedPlan.product}</div>
                    <div><strong>Số lượng:</strong> {selectedPlan.quantity}</div>
                    <div><strong>Thời gian giao hàng:</strong> {selectedPlan.deliveryDate}</div>
                    <div><strong>Thời gian nhập kho:</strong> {selectedPlan.importDate}</div>
                    <div><strong>Xưởng:</strong> {selectedPlan.workshop}</div>
                    <div><strong>Ghi chú:</strong> {selectedPlan.note}</div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  {workSteps.map((step, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_240px] items-center border rounded-lg p-3 gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                          {index + 1}
                        </div>
                        <span>{step}</span>
                      </div>
                      <Select
                        disabled={isReadOnly}
                        value={assignments[index]}
                        onValueChange={(value) => {
                          if (!isReadOnly) {
                            setAssignments((prev) => ({ ...prev, [index]: value }))
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn tổ thực hiện" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(10)].map((_, i) => (
                            <SelectItem key={i} value={`to${i + 1}`}>Tổ {i + 1}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}

                  {!isReadOnly && error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  {!isReadOnly && (
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                      <Button onClick={handleSave}>Lưu</Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
