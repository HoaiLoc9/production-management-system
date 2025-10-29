"use client"

import React, { useEffect, useState } from "react"

export default function KpiReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterMonth, setFilterMonth] = useState("") // format YYYY-MM

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/kpi/reports")
        const data = await res.json()
        if (!cancelled) setReports(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error("Failed to fetch KPI reports:", e)
        if (!cancelled) setReports([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = filterMonth
    ? reports.filter((r) => {
        const t = r.created_at || r.report_period_start || r.createdAt
        if (!t) return false
        const d = new Date(t)
        if (Number.isNaN(d.getTime())) return false
        return d.toISOString().slice(0, 7) === filterMonth
      })
    : reports

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Lịch sử báo cáo KPI</h1>

      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm">Lọc theo tháng:</label>
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button
          onClick={() => setFilterMonth("")}
          className="ml-2 px-3 py-1 bg-gray-200 rounded"
        >
          Clear
        </button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div>Không có báo cáo nào khớp.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <div key={r.id} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-600">ID: {r.id}</div>
                  <div className="text-lg font-medium">{r.report_name || "Báo cáo KPI"}</div>
                  <div className="text-sm text-gray-500">Tạo: {r.created_at || r.createdAt || "-"}</div>
                </div>
                <div className="text-right">
                  <div>Trung bình KPI: {r.average_kpi ?? "-"}</div>
                  <div className="text-sm text-gray-500">Trạng thái: {r.status}</div>
                </div>
              </div>

              <details className="mt-3">
                <summary className="cursor-pointer text-sm text-blue-600">Xem chi tiết</summary>
                <pre className="mt-2 max-h-64 overflow-auto bg-gray-50 p-2 text-xs rounded">
                  {JSON.stringify(r, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
