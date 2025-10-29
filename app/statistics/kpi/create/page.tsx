"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/hooks/use-toast"
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
  const [drafts, setDrafts] = useState<any[]>([])
  const [selectedDraftIds, setSelectedDraftIds] = useState<string[]>([])
  const [reportName, setReportName] = useState("")
  const [reportPeriodStart, setReportPeriodStart] = useState("")
  const [reportPeriodEnd, setReportPeriodEnd] = useState("")
  const [summary, setSummary] = useState("")
  const [recommendations, setRecommendations] = useState("")

  useEffect(() => {
    // Only allow production manager to create KPI reports
    if (user && user.role !== "manager") {
      setError("Chỉ Quản lý sản xuất mới có quyền lập báo cáo KPI")
      setTimeout(() => router.push("/dashboard/statistics"), 2000)
    }
    // load drafts for manager to choose from
    ;(async () => {
      try {
        const res = await fetch("/api/kpi/drafts")
        if (res.ok) {
          const data = await res.json()
          // only keep approved drafts for selection
          setDrafts(Array.isArray(data) ? data.filter((d: any) => d.status === "approved") : [])
        }
      } catch (e) {
        // ignore
      }
    })()
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

  // helper to extract KPI numbers from a single draft (used to display per-draft summary)
  function getMetricsFromDraft(d: any) {
    let productivity: number | null = null
    let cycle_time: number | null = null
    let completion_rate: number | null = null

    if (Array.isArray(d?.workshops) && d.workshops.length > 0) {
      // first pass: try to match by metric label (best effort)
      d.workshops.forEach((m: any) => {
        const metric = String(m.metric || "").toLowerCase()
        const raw = m.actual ?? m.value ?? m.target ?? ""
        const actual = Number.parseFloat(String(raw))
        if (!Number.isFinite(actual) || Number.isNaN(actual)) return

        if (metric.includes("sản lượng") || metric.includes("năng suất") || metric.includes("nang suat")) {
          productivity = actual
        } else if (metric.includes("chu kỳ") || metric.includes("chu ky") || metric.includes("chu kỳ tb") || metric.includes("chu ky tb")) {
          cycle_time = actual
        } else if (metric.includes("hoàn") || metric.includes("hoan") || metric.includes("tỷ lệ") || metric.includes("ty le") || metric.includes("hoan thanh")) {
          completion_rate = actual
        }
      })

      // fallback heuristics: if labels aren't present, try positional mapping or detect percent-like values
      if ((productivity == null || cycle_time == null || completion_rate == null) && d.workshops.length >= 1) {
        // gather numeric values in order
        const nums = d.workshops
          .map((m: any) => {
            const raw = m.actual ?? m.value ?? m.target ?? ""
            const n = Number.parseFloat(String(raw))
            return Number.isFinite(n) ? n : null
          })
          .filter((n: number | null) => n != null) as number[]

        // If there are at least 3 numeric entries, assume order: productivity, cycle_time, completion_rate
        if (nums.length >= 3) {
          if (productivity == null) productivity = nums[0]
          if (cycle_time == null) cycle_time = nums[1]
          if (completion_rate == null) completion_rate = nums[2]
        } else if (nums.length === 2) {
          // try to detect percent for completion_rate
          const maybePct = nums.find((v: number) => v >= 0 && v <= 100)
          if (completion_rate == null && maybePct != null) completion_rate = maybePct
          if (productivity == null) productivity = nums[0]
          if (cycle_time == null && nums[1] !== completion_rate) cycle_time = nums[1]
        } else if (nums.length === 1) {
          // single numeric value: treat as completion if it's a percent-like number, else as productivity
          const v = nums[0]
          if (v >= 0 && v <= 100 && completion_rate == null) completion_rate = v
          else if (productivity == null) productivity = v
        }
      }
    }

    return { productivity, cycle_time, completion_rate }
  }

  // derive aggregated workshop stats from selected approved drafts
  const deriveWorkshopsFromDrafts = () => {
    if (!selectedDraftIds || selectedDraftIds.length === 0) return null

    // helper: normalize workshop identifier to single letter A/B/C/D when possible
    const normalizeWorkshopKey = (raw: any) => {
      if (raw == null) return ""
      const s = String(raw).trim()
      // match single letter A-D or Vietnamese 'Xưởng A'
      const m = s.match(/([A-D])/i)
      if (m) return m[1].toUpperCase()
      // try to match last letter if format like 'Xưởng A' with accents
      const parts = s.split(" ")
      const last = parts[parts.length - 1]
      if (last && last.length === 1 && /[A-Da-d]/.test(last)) return last.toUpperCase()
      return s
    }

    // group selected drafts by normalized workshop key
    const draftsByWorkshop: Record<string, any[]> = {}
    drafts.forEach((d) => {
      if (!selectedDraftIds.includes(d.id)) return
      const key = normalizeWorkshopKey(d.workshop_name || d.workshop_id || d.workshop)
      if (!key) return
      draftsByWorkshop[key] = draftsByWorkshop[key] || []
      draftsByWorkshop[key].push(d)
    })

    // prefer consistent order A,B,C,D when present
    const keysOrder = ["A", "B", "C", "D"]
    const result: any[] = []

    keysOrder.forEach((k) => {
      const list = draftsByWorkshop[k]
      if (!list || list.length === 0) {
        // if no draft for this workshop, skip adding an entry here (will keep form defaults elsewhere)
        return
      }
      // pick latest draft by created_at
      const latest = list.slice().sort((a, b) => (a.created_at > b.created_at ? -1 : 1))[0]
      // extract metrics via helper
      const { productivity, cycle_time, completion_rate } = getMetricsFromDraft(latest)
      result.push({
        workshop_id: k,
        workshop_name: `Xưởng ${k}`,
        productivity: productivity ?? 0,
        cycle_time: cycle_time ?? 0,
        completion_rate: completion_rate ?? 0,
        source_draft_id: latest.id,
      })
    })

    // If no A-D keys found, fallback to any other grouped keys
    if (result.length === 0) {
      Object.keys(draftsByWorkshop).forEach((key) => {
        const latest = draftsByWorkshop[key].slice().sort((a, b) => (a.created_at > b.created_at ? -1 : 1))[0]
        const { productivity, cycle_time, completion_rate } = getMetricsFromDraft(latest)
        result.push({
          workshop_id: key,
          workshop_name: `Xưởng ${key}`,
          productivity: productivity ?? 0,
          cycle_time: cycle_time ?? 0,
          completion_rate: completion_rate ?? 0,
          source_draft_id: latest.id,
        })
      })
    }

    return result
  }

  const aggregatedWorkshops = deriveWorkshopsFromDrafts()

  // Auto-fill formData.workshops when manager selects approved drafts
  useEffect(() => {
    if (!selectedDraftIds || selectedDraftIds.length === 0) return
    const agg = deriveWorkshopsFromDrafts()
    if (!agg) return

    setFormData((prev) => {
      const ids = ["A", "B", "C", "D"]
      const prevMap: Record<string, any> = {}
      prev.workshops.forEach((w: any) => {
        prevMap[String(w.workshop_id)] = w
      })

      const newWorkshops = ids.map((id) => {
        const found = agg.find((w: any) => String(w.workshop_id) === id || String(w.workshop_name).includes(id) || String(w.workshop_name) === `Xưởng ${id}`)
        if (found) {
          return {
            workshop_id: id,
            workshop_name: found.workshop_name || `Xưởng ${id}`,
            productivity: found.productivity ?? (prevMap[id]?.productivity ?? 0),
            cycle_time: found.cycle_time ?? (prevMap[id]?.cycle_time ?? 0),
            completion_rate: found.completion_rate ?? (prevMap[id]?.completion_rate ?? 0),
          }
        }

        // fallback to previous values or defaults
        const prevW = prevMap[id]
        return {
          workshop_id: id,
          workshop_name: prevW?.workshop_name ?? `Xưởng ${id}`,
          productivity: prevW?.productivity ?? 0,
          cycle_time: prevW?.cycle_time ?? 0,
          completion_rate: prevW?.completion_rate ?? 0,
        }
      })

      return { ...prev, workshops: newWorkshops }
    })
  }, [selectedDraftIds, drafts])

  

  // try multiple fields on the draft to find a workshop identifier
  const normalizeWorkshopKey = (raw: any) => {
    if (raw == null) return ""
    const s = String(raw).trim()
    const m = s.match(/([A-D])/i)
    if (m) return m[1].toUpperCase()
    const parts = s.split(" ")
    const last = parts[parts.length - 1]
    if (last && last.length === 1 && /[A-Da-d]/.test(last)) return last.toUpperCase()
    return s
  }

  const formatWorkshopName = (d: any) => {
    // accept either a draft object or a raw name
    if (!d && d !== 0) return "-"
    let raw: any = d
    if (typeof d === "object") {
      raw = d.workshop_name ?? d.workshop ?? d.workshop_id ?? d.workshopCode ?? d.factory ?? d.location ?? d.unit ?? ""
      // fallback: try to find a workshop id inside workshops array
      if (!raw && Array.isArray(d.workshops)) {
        for (const w of d.workshops) {
          const label = String(w.metric || "").toLowerCase()
          if (label.includes("xưởng") || label.includes("workshop")) {
            raw = w.actual ?? w.value ?? w.target ?? raw
            break
          }
        }
      }
    }

    if (!raw && raw !== 0) return "-"
    const key = normalizeWorkshopKey(raw)
    return (typeof key === "string" && key.toLowerCase().includes("xưởng")) || key.length !== 1 ? String(key) : `Xưởng ${key}`
  }

  const calcSummaryFromAggregated = () => {
    if (!aggregatedWorkshops || aggregatedWorkshops.length === 0) return null
    // compute averages only over workshops that have numeric values
    const numeric = (v: any) => typeof v === "number" && Number.isFinite(v)
    const prodVals = aggregatedWorkshops.map((w: any) => (numeric(w.productivity) ? w.productivity : null)).filter((v: any) => v != null)
    const cycleVals = aggregatedWorkshops.map((w: any) => (numeric(w.cycle_time) ? w.cycle_time : null)).filter((v: any) => v != null)
    const compVals = aggregatedWorkshops.map((w: any) => (numeric(w.completion_rate) ? w.completion_rate : null)).filter((v: any) => v != null)
    const avg = (arr: number[]) => (arr.length === 0 ? 0 : arr.reduce((s, x) => s + x, 0) / arr.length)
    const prodAvg = avg(prodVals)
    const cycleAvg = avg(cycleVals)
    const compAvg = avg(compVals)
    return {
      productivity: Number(prodAvg.toFixed(1)),
      cycle_time: Number(cycleAvg.toFixed(1)),
      completion_rate: Number(compAvg.toFixed(1)),
    }
  }

  const aggregatedSummary = calcSummaryFromAggregated()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // If manager selected approved drafts, create a final report from them
      if (selectedDraftIds.length > 0) {
        if (!reportName.trim() || !reportPeriodStart || !reportPeriodEnd) {
          throw new Error("Vui lòng nhập tên báo cáo và kỳ báo cáo")
        }

        // prefer aggregated values derived from selected approved drafts
        const avgKpi = aggregatedSummary ? Number(aggregatedSummary.completion_rate) : Number(calculateAverageKPI())
        const payload = {
          created_by: "Quản lý sản xuất",
          report_name: reportName,
          report_period_start: reportPeriodStart,
          report_period_end: reportPeriodEnd,
          summary,
          recommendations,
          average_kpi: avgKpi,
          kpi_report_ids: selectedDraftIds,
          // include aggregated workshops to make report content explicit
          aggregated_workshops: aggregatedWorkshops ?? null,
        }

        const response = await fetch("/api/kpi/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data?.message || "Lỗi khi tạo báo cáo cuối")
        }

        toast({ title: "Lưu thành công", description: "Báo cáo KPI cuối đã được tạo." })
        await new Promise((res) => setTimeout(res, 800))
        router.push("/statistics/kpi/review")
        return
      }

      // Fallback: create a draft-style report using current formData (legacy)
      const response = await fetch("/api/kpi/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          created_by: "Quản lý sản xuất",
          average_kpi: calculateAverageKPI(),
        }),
      })

      if (!response.ok) {
        throw new Error("Lỗi khi lưu báo cáo KPI")
      }

      // show success toast then redirect
      toast({ title: "Lưu thành công", description: "Báo cáo KPI đã được lưu." })
      // small delay so user sees toast
      await new Promise((res) => setTimeout(res, 800))
      router.push("/statistics/kpi/review")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  if (error && user?.role !== "manager") {
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

            {/* Approved Drafts Selection (from supervisors) */}
            <div>
              <h3 className="font-semibold text-foreground">Chọn phiếu KPI đã duyệt</h3>
              {drafts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Không có phiếu đã duyệt</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2 px-3">Chọn</th>
                          <th className="py-2 px-3">Xưởng</th>
                          <th className="py-2 px-3">Năng suất</th>
                          <th className="py-2 px-3">Chu kỳ</th>
                          <th className="py-2 px-3">Hoàn thành</th>
                          <th className="py-2 px-3">Người tạo</th>
                          <th className="py-2 px-3">Ngày tạo</th>
                          <th className="py-2 px-3">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drafts.map((d) => (
                        <tr key={d.id} className="border-b border-border">
                          <td className="py-2 px-3">
                            <input
                              type="checkbox"
                              checked={selectedDraftIds.includes(d.id)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedDraftIds((s) => [...s, d.id])
                                else setSelectedDraftIds((s) => s.filter((id) => id !== d.id))
                              }}
                            />
                          </td>
                          <td className="py-2 px-3">{formatWorkshopName(d.workshop_name)}</td>
                          {(() => {
                            const m = getMetricsFromDraft(d)
                            return (
                              <>
                                <td className="py-2 px-3">{m.productivity ?? "-"}</td>
                                <td className="py-2 px-3">{m.cycle_time ?? "-"}</td>
                                <td className="py-2 px-3">{m.completion_rate != null ? `${m.completion_rate}%` : "-"}</td>
                              </>
                            )
                          })()}
                          <td className="py-2 px-3">{d.created_by}</td>
                          <td className="py-2 px-3">{new Date(d.created_at).toLocaleDateString()}</td>
                          <td className="py-2 px-3">{d.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Final report metadata (when using drafts) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Tên báo cáo</label>
                <Input value={reportName} onChange={(e) => setReportName(e.target.value)} placeholder="Ví dụ: Báo cáo KPI Tháng 10" />
              </div>
              <div>
                <label className="text-sm font-medium">Kỳ bắt đầu</label>
                <Input type="date" value={reportPeriodStart} onChange={(e) => setReportPeriodStart(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Kỳ kết thúc</label>
                <Input type="date" value={reportPeriodEnd} onChange={(e) => setReportPeriodEnd(e.target.value)} />
              </div>
            </div>

            {/* <div>
              <label className="text-sm font-medium">Tóm tắt</label>
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full px-3 py-2 border border-input rounded-md" rows={3} />
            </div> */}

            {/* <div>
              <label className="text-sm font-medium">Khuyến nghị</label>
              <textarea value={recommendations} onChange={(e) => setRecommendations(e.target.value)} className="w-full px-3 py-2 border border-input rounded-md" rows={3} />
            </div> */}

            {/* KPI Summary Section (computed from selected drafts when present) */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-foreground">Thông tin KPI từ các xưởng</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Năng suất TB (ghế/ca)</p>
                  <p className="text-xl font-bold mt-1">
                    {aggregatedSummary ? aggregatedSummary.productivity : (formData.workshops.reduce((sum, w) => sum + w.productivity, 0) / formData.workshops.length).toFixed(1)}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Đơn giá</p>
                  <p className="text-sm text-primary font-medium mt-1">Tự động tính</p>
                </div>
                <div className="bg-white p-3 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Chu kỳ TB (cái/lô)</p>
                  <p className="text-xl font-bold mt-1">
                    {aggregatedSummary ? aggregatedSummary.cycle_time : (formData.workshops.reduce((sum, w) => sum + w.cycle_time, 0) / formData.workshops.length).toFixed(1)}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Tỷ lệ hoàn thành TB</p>
                  <p className="text-sm text-primary font-medium mt-1">{aggregatedSummary ? `${aggregatedSummary.completion_rate}%` : `${calculateAverageKPI()}%`}</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded border border-border">
                <p className="text-xs text-muted-foreground">Tổng KPI trung bình</p>
                <p className="text-2xl font-bold text-primary mt-2">{aggregatedSummary ? `${aggregatedSummary.completion_rate}%` : `${calculateAverageKPI()}%`}</p>
              </div>
            </div>

            {/* Workshop Details - read-only layout matching design */}
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
                    {(aggregatedWorkshops || formData.workshops).map((workshop: any, index: number) => {
                      const w = aggregatedWorkshops ? workshop : formData.workshops[index]
                      const prod = Number.isFinite(Number(w.productivity)) ? Number(w.productivity) : 0
                      const cycle = Number.isFinite(Number(w.cycle_time)) ? Number(w.cycle_time) : 0
                      const pct = Number.isFinite(Number(w.completion_rate)) ? Number(w.completion_rate) : 0

                      let badge = "bg-yellow-100 text-yellow-800"
                      if (pct >= 97) badge = "bg-green-100 text-green-800"
                      else if (pct >= 95) badge = "bg-lime-100 text-lime-800"
                      else if (pct < 90) badge = "bg-red-100 text-red-800"

                      return (
                        <tr key={w.workshop_id || w.workshop_name || index} className="border-b border-border">
                          <td className="py-3 px-3 font-medium">{w.workshop_name || `Xưởng ${w.workshop_id}`}</td>
                          <td className="py-3 px-3">{Number.isInteger(prod) ? prod : prod.toFixed(1)}</td>
                          <td className="py-3 px-3">{Number.isInteger(cycle) ? cycle : cycle.toFixed(1)}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-1 rounded text-sm font-medium ${badge}`}>{pct.toFixed(1)}%</span>
                          </td>
                        </tr>
                      )
                    })}
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
