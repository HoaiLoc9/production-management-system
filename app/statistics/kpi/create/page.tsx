"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"

interface WorkshopKPI {
  workshop_id: string
  workshop_name: string
  productivity: number
  cycle_time: number
  completion_rate: number
}

export default function CreateKPIReportPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    report_date: new Date().toISOString().split("T")[0],
    workshops: [
      { workshop_id: "A", workshop_name: "Xưởng A", productivity: 0, cycle_time: 0, completion_rate: 0 },
      { workshop_id: "B", workshop_name: "Xưởng B", productivity: 0, cycle_time: 0, completion_rate: 0 },
      { workshop_id: "C", workshop_name: "Xưởng C", productivity: 0, cycle_time: 0, completion_rate: 0 },
      { workshop_id: "D", workshop_name: "Xưởng D", productivity: 0, cycle_time: 0, completion_rate: 0 },
    ],
    notes: "",
  })

  useEffect(() => {
    if (user && user.role !== "supervisor") {
      setError("Chỉ xưởng trưởng mới có quyền lập báo cáo KPI")
      setTimeout(() => router.push("/dashboard/statistics"), 2000)
    }
  }, [user, router])

  const handleWorkshopChange = (index: number, field: string, value: string | number) => {
    const updatedWorkshops = [...formData.workshops]
    updatedWorkshops[index] = {
      ...updatedWorkshops[index],
      [field]: typeof value === "string" ? Number.parseFloat(value) || 0 : value,
    }
    setFormData({ ...formData, workshops: updatedWorkshops })
  }

  const calculateAverageKPI = () => {
    const rates = formData.workshops.map((w) => w.completion_rate)
    return rates.length > 0 ? (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(1) : "0"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/kpi/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          created_by: user?.id,
          average_kpi: calculateAverageKPI(),
        }),
      })

      if (!response.ok) {
        throw new Error("Lỗi khi lưu báo cáo KPI")
      }

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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Lập báo cáo KPI</h1>
        <p className="text-muted-foreground mt-2">Tổng hợp hiệu suất sản xuất từ các xưởng</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lập báo cáo KPI</CardTitle>
          <CardDescription>Ghi nhận giao dịch nhập kho nguyên vật liệu</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Report Date */}
            <div>
              <label className="text-sm font-medium">Ngày lập báo cáo *</label>
              <Input
                type="date"
                value={formData.report_date}
                onChange={(e) => setFormData({ ...formData, report_date: e.target.value })}
                required
              />
            </div>

            {/* KPI Summary Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-foreground">Thông tin KPI từ các xưởng</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Năng suất TB (ghế/ca)</p>
                  <p className="text-xl font-bold mt-1">
                    {(formData.workshops.reduce((sum, w) => sum + w.productivity, 0) / 4).toFixed(1)}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Đơn giá</p>
                  <p className="text-sm text-primary font-medium mt-1">Từ động tính</p>
                </div>
                <div className="bg-white p-3 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Chu kỳ TB (cái/lô)</p>
                  <p className="text-xl font-bold mt-1">
                    {(formData.workshops.reduce((sum, w) => sum + w.cycle_time, 0) / 4).toFixed(1)}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Tỷ lệ hoàn thành TB</p>
                  <p className="text-sm text-primary font-medium mt-1">{calculateAverageKPI()}%</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded border border-border">
                <p className="text-xs text-muted-foreground">Tổng KPI trung bình</p>
                <p className="text-2xl font-bold text-primary mt-2">{calculateAverageKPI()}%</p>
              </div>
            </div>

            {/* Workshop Details */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Xem chi tiết KPI từng xưởng</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 font-medium">Xưởng</th>
                      <th className="text-left py-2 px-3 font-medium">Năng suất</th>
                      <th className="text-left py-2 px-3 font-medium">Chu kỳ</th>
                      <th className="text-left py-2 px-3 font-medium">Hoàn thành</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.workshops.map((workshop, index) => (
                      <tr key={workshop.workshop_id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-3 font-medium">{workshop.workshop_name}</td>
                        <td className="py-3 px-3">
                          <Input
                            type="number"
                            step="0.1"
                            value={workshop.productivity}
                            onChange={(e) => handleWorkshopChange(index, "productivity", e.target.value)}
                            className="w-20"
                            placeholder="0"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <Input
                            type="number"
                            step="0.1"
                            value={workshop.cycle_time}
                            onChange={(e) => handleWorkshopChange(index, "cycle_time", e.target.value)}
                            className="w-20"
                            placeholder="0"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                              value={workshop.completion_rate}
                              onChange={(e) => handleWorkshopChange(index, "completion_rate", e.target.value)}
                              className="w-20"
                              placeholder="0"
                            />
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium">Nhận xét *</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="hoạt động ổn định, cần có gắng để đạt được 100%"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={4}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Hủy
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground" disabled={isLoading}>
                {isLoading ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
