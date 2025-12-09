"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Sidebar from "@/components/layout/sidebar"

export default function WorkAssignments() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<any[]>([])
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [assignments, setAssignments] = useState<Record<number, AssignmentInfo>>({})
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isReadOnly, setIsReadOnly] = useState(false)

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

  interface AssignmentInfo {
    team?: string;
    ca?: string;
  }

  // 🔹 Fetch danh sách kế hoạch
  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch("/api/work-assignment/plans")
        if (!res.ok) throw new Error("Không thể lấy kế hoạch")
        const data = await res.json()
        setPlans([
          ...data.approved.map((p: any) => ({ ...p, assigned: true, assignedSteps: {} })),
          ...data.notApproved.map((p: any) => ({ ...p, assigned: false, assignedSteps: {} })),
        ])
      } catch (err) {
        console.error("Lỗi khi fetch plans:", err)
      }
    }
    fetchPlans()
  }, [])

  // 🔹 Khi click vào kế hoạch (chỉ cho phép nếu chưa phân công)
  const handleClick = (plan: any) => {
    if (plan.assigned) return // chặn click nếu đã phân công
    setSelectedPlan(plan)
    setOpen(true)
    setIsReadOnly(plan.assigned)
  }

  // 🔹 Lưu phân công
  const handleSave = async () => {
    if (!user?.name) {
      setError("Bạn chưa đăng nhập")
      return
    }

    const missingSteps = workSteps.filter((_, i) => {
      return !assignments[i]?.team || !assignments[i]?.ca
    })
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

    try {
      const res = await fetch("/api/work-assignment/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: selectedPlan.id,
          steps: assignments,
          assigned_by: user.name,
        }),
      })

      let data: any = {}
      try { data = await res.json() } catch {}
      if (!res.ok) throw new Error(data.message || "Lưu phân công thất bại")

      // ✅ Cập nhật UI và DB
      setSuccessMessage("Phân công thành công!")
      setPlans(prev =>
        prev.map(p =>
          p.id === selectedPlan.id
            ? { ...p, assigned: true, assignedSteps: { ...assignments } }
            : p
        )
      )
      setOpen(false)
      setAssignments({})
      setError("")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err: any) {
      setError("Lỗi khi lưu phân công: " + err.message)
    }
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
          {plans.map(plan => (
            <Card
              key={plan.id}
              className={`transition-colors ${
                plan.assigned ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-muted"
              }`}
              onClick={() => handleClick(plan)}
            >
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{plan.plan_code}</p>
                  <p className="text-sm text-muted-foreground">
                    Sản phẩm: {plan.product_type} | Số lượng: {plan.quantity} | Ngày bắt đầu: {plan.start_date} | Ngày kết thúc: {plan.end_date}
                  </p>
                </div>
                <div>
                  {plan.assigned ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Đã phân công</Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-500 border-red-400">Chưa phân công</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Dialog phân công */}
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
              <div className="space-y-4 pt-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h2 className="text-xl font-semibold mb-2">Chi tiết kế hoạch</h2>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div><strong>Mã kế hoạch:</strong> {selectedPlan.plan_code}</div>
                    <div><strong>Sản phẩm:</strong> {selectedPlan.product_type}</div>
                    <div><strong>Số lượng:</strong> {selectedPlan.quantity}</div>
                    <div><strong>Ngày bắt đầu:</strong> {selectedPlan.start_date}</div>
                    <div><strong>Ngày kết thúc:</strong> {selectedPlan.end_date}</div>
                    <div><strong>Ghi chú:</strong> {selectedPlan.note || "-"}</div>
                  </div>
                </div>

          {workSteps.map((step, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_200px_150px] items-center border rounded-lg p-3 gap-4"
            >
              <span>{step}</span>

              {/* Select tổ */}
              <Select
                disabled={isReadOnly}
                value={assignments[index]?.team ?? ""}
                onValueChange={(value) => {
                  if (!isReadOnly) {
                    setAssignments(prev => ({
                      ...prev,
                      [index]: { ...(prev[index] ?? {}), team: value }
                    }))
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn tổ" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i} value={`to${i + 1}`}>Tổ {i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Select ca */}
              <Select
                disabled={isReadOnly}
                value={assignments[index]?.ca ?? ""}
                onValueChange={(value) => {
                  if (!isReadOnly) {
                    setAssignments(prev => ({
                      ...prev,
                      [index]: { ...(prev[index] ?? {}), ca: value }
                    }))
                  }
                }}
    >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn ca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ca 1</SelectItem>
                    <SelectItem value="2">Ca 2</SelectItem>
                    <SelectItem value="3">Ca 3</SelectItem>
                  </SelectContent>
              </Select>
            </div>
          ))}
                {!isReadOnly && error && <p className="text-red-500 text-sm">{error}</p>}

                {!isReadOnly && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                    <Button onClick={handleSave}>Lưu</Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
