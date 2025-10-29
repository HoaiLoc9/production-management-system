"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"

interface KPIItem {
  id: string
  label: string
  actual: string
  target: string
  status: string
}

export default function CreateKPIDraftPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<KPIItem[]>([
    { id: "1", label: "Sản Lượng Tháng Này", actual: "", target: "", status: "Đang nhập" },
    { id: "2", label: "Tỷ Lệ Lỗi", actual: "", target: "", status: "Đang nhập" },
    { id: "3", label: "Công Nhân Hoạt Động", actual: "", target: "", status: "Đang nhập" },
    { id: "4", label: "Kế Hoạch Hoàn Thành", actual: "", target: "", status: "Đang nhập" },
  ])

  const [workshopName, setWorkshopName] = useState("")

  useEffect(() => {
    // only supervisors can create drafts
    if (user && user.role !== "supervisor") {
      setError("Chỉ Xưởng trưởng mới có quyền tạo phiếu KPI")
      setTimeout(() => router.push("/dashboard/statistics"), 1500)
    }
  }, [user, router])

  const handleChange = (index: number, field: "actual" | "target", value: string) => {
    const next = [...items]
    next[index] = { ...next[index], [field]: value }
    setItems(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!workshopName.trim()) {
      setError("Vui lòng chọn tên xưởng")
      setIsLoading(false)
      return
    }

    try {
      const payload = {
        created_by: user?.name || user?.email || "Xưởng trưởng",
        workshop_name: workshopName,
        report_date: new Date().toISOString().split("T")[0],
        workshops: items.map((it) => ({ metric: it.label, actual: it.actual, target: it.target, status: it.status })),
        average_kpi: "",
        notes: "",
      }

      const res = await fetch("/api/kpi/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error("Lỗi khi gửi phiếu KPI")
      }

      toast({ title: "Gửi thành công", description: "Phiếu KPI đã được gửi để duyệt." })
      await new Promise((r) => setTimeout(r, 800))
      router.push("/statistics/kpi/review")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  if (error && user?.role !== "supervisor") {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tạo Phiếu KPI</h1>

      <Card>
        <CardHeader>
          <CardTitle>Nhập Thông Tin Chỉ Số KPI</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-2">
              <div className="md:col-span-1">
                <label className="text-sm font-medium">Tên Xưởng *</label>
                <select
                  value={workshopName}
                  onChange={(e) => setWorkshopName(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Chọn xưởng --</option>
                  <option value="A">Xưởng A</option>
                  <option value="B">Xưởng B</option>
                  <option value="C">Xưởng C</option>
                  <option value="D">Xưởng D</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="py-3 px-4">Chỉ Số Hiệu Suất (KPI)</th>
                    <th className="py-3 px-4">Giá Trị Thực Tế (cái)</th>
                    <th className="py-3 px-4">Giá Trị Mục Tiêu (cái)</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={it.id} className="border-b border-border">
                      <td className="py-4 px-4 font-medium">{it.label}</td>
                      <td className="py-3 px-4">
                        <Input value={it.actual} onChange={(e) => handleChange(idx, "actual", e.target.value)} placeholder="Nhập giá trị" />
                      </td>
                      <td className="py-3 px-4">
                        <Input value={it.target} onChange={(e) => handleChange(idx, "target", e.target.value)} placeholder="Nhập mục tiêu" />
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">{it.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Hủy
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground" disabled={isLoading}>
                {isLoading ? "Đang gửi..." : "Gửi"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
