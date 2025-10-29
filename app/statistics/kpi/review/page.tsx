"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export default function KPIReviewPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [drafts, setDrafts] = useState<any[]>([])
  const [filterWorkshop, setFilterWorkshop] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user && user.role === "supervisor") {
      router.push("/statistics/kpi/drafts/create")
      return
    }

    // load all drafts for manager/director to review
    ;(async () => {
      try {
        const res = await fetch("/api/kpi/drafts")
        if (res.ok) {
          const data = await res.json()
          setDrafts(Array.isArray(data) ? data : [])
        }
      } catch (e) {
        // ignore
      }
    })()
  }, [user, router])

  const handleApprove = async (id: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/kpi/drafts/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved_by: user?.name || user?.email || "Quản lý sản xuất" }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || "Lỗi khi duyệt phiếu")
      }

      const updated = await res.json()
      setDrafts((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
      toast({ title: "Duyệt thành công", description: `Phiếu ${updated.id} đã được duyệt.` })
    } catch (err) {
      toast({ title: "Lỗi", description: err instanceof Error ? err.message : "Có lỗi xảy ra" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Duyệt Phiếu KPI</h1>
        <p className="text-muted-foreground mt-2">Danh sách phiếu KPI do xưởng trưởng gửi</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phiếu KPI</CardTitle>
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

            {drafts.length === 0 && <p className="text-sm text-muted-foreground">Chưa có phiếu KPI</p>}
            {drafts
              .filter((d) => (filterWorkshop === "all" ? true : String(d.workshop_name) === filterWorkshop))
              .map((d) => (
              <div key={d.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">{d.workshop_name ? `Xưởng ${d.workshop_name}` : d.workshop_name}</p>
                    <p className="text-sm text-muted-foreground">Người tạo: {d.created_by} • {new Date(d.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${d.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {d.status === "approved" ? "Đã duyệt" : "Chưa duyệt"}
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
                      {Array.isArray(d.workshops) && d.workshops.map((w: any, i: number) => (
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

                <div className="flex justify-end gap-3">
                  {d.status !== "approved" && (
                    <Button disabled={isLoading} onClick={() => handleApprove(d.id)}>
                      Duyệt
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
