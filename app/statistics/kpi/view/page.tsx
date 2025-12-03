"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface KPIReport {
  id: string
  workshop_name: string
  created_by: string
  created_at: string
  status: "approved" | "pending"
  workshops: {
    metric: string
    actual: number | string
    target: number | string
    status: string
  }[]
}

export default function KPIViewPage() {
  const router = useRouter()
  const [reports, setReports] = useState<KPIReport[]>([])
  const [filterWorkshop, setFilterWorkshop] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/kpi/drafts")
        if (!res.ok) throw new Error("Không thể tải dữ liệu KPI")
        const data: KPIReport[] = await res.json()
        // Chỉ lấy các phiếu đã duyệt
        const approvedReports = data.filter(r => r.status === "approved")
        setReports(approvedReports)
      } catch (err) {
        console.error(err)
        setReports([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchReports()
  }, [])

  if (isLoading) return <p className="p-6">Đang tải dữ liệu...</p>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Báo cáo KPI</h1>

      <Card>
        <CardHeader>
          <CardTitle>Phiếu KPI đã duyệt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <label className="text-sm font-medium">Lọc xưởng:</label>
              <div className="flex gap-2">
                {["all", "A", "B", "C", "D"].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setFilterWorkshop(w)}
                    className={`px-3 py-1 rounded-md text-sm ${filterWorkshop === w ? "bg-primary text-primary-foreground" : "bg-muted/30"}`}>
                    {w === "all" ? "Tất cả" : `Xưởng ${w}`}
                  </button>
                ))}
              </div>
            </div>

            {reports.length === 0 && <p className="text-sm text-muted-foreground">Chưa có phiếu KPI nào đã được duyệt.</p>}

            {reports
              .filter((r) => filterWorkshop === "all" ? true : String(r.workshop_name) === filterWorkshop)
              .map((r) => (
                <div
                  key={r.id}
                  className="border border-border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => router.push(`/statistics/kpi/report/${r.id}`)} // link chi tiết từng phiếu
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{r.workshop_name ? `Xưởng ${r.workshop_name}` : r.workshop_name}</p>
                      <p className="text-sm text-muted-foreground">Người tạo: {r.created_by} • {new Date(r.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                        Đã duyệt
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b border-border">
                          <th className="py-2 px-3">Chỉ số</th>
                          <th className="py-2 px-3">Thực tế</th>
                          <th className="py-2 px-3">Mục tiêu</th>
                          <th className="py-2 px-3">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(r.workshops) && r.workshops.map((w, i) => (
                          <tr key={i} className="border-b border-border">
                            <td className="py-2 px-3">{w.metric}</td>
                            <td className="py-2 px-3">{w.actual}</td>
                            <td className="py-2 px-3">{w.target}</td>
                            <td className="py-2 px-3">{w.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
