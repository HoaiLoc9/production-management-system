// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"

// interface KPIReport {
//   id: string
//   report_name: string
//   report_period_start: string
//   report_period_end: string
//   average_kpi: number | null | string
//   created_by: string
//   created_at: string
// }

// export default function KPIReportPage() {
//   const router = useRouter()
//   const [reports, setReports] = useState<KPIReport[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const res = await fetch("/api/kpi/reports")
//         if (res.ok) {
//           const data = await res.json()
//           console.log("Data from API:", data)
//           setReports(data)
//         } else {
//           console.error("Failed to fetch reports:", await res.text())
//         }
//       } catch (err) {
//         console.error(err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchReports()
//   }, [])

//   if (loading) return <p>Đang tải dữ liệu...</p>

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">Danh sách báo cáo KPI</h1>
//         <Button onClick={() => router.push("/statistics/kpi/create")}>Tạo báo cáo mới</Button>
//       </div>

//       {reports.length === 0 ? (
//         <p>Chưa có báo cáo nào.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm border border-border rounded-md">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="py-2 px-3">Tên báo cáo</th>
//                 <th className="py-2 px-3">Kỳ báo cáo</th>
//                 <th className="py-2 px-3">KPI TB (%)</th>
//                 <th className="py-2 px-3">Người tạo</th>
//                 <th className="py-2 px-3">Ngày tạo</th>
//               </tr>
//             </thead>
//             <tbody>
//               {reports.map((r) => {
//                 const averageKpi = Number(r.average_kpi)
//                 return (
//                   <tr key={r.id} className="border-t border-border">
//                     <td className="py-2 px-3">{r.report_name}</td>
//                     <td className="py-2 px-3">
//                       {r.report_period_start} → {r.report_period_end}
//                     </td>
//                     <td className="py-2 px-3">
//                       {isNaN(averageKpi) ? "0.00%" : averageKpi.toFixed(2) + "%"}
//                     </td>
//                     <td className="py-2 px-3">{r.created_by}</td>
//                     <td className="py-2 px-3">
//                       {new Date(r.created_at).toLocaleDateString("vi-VN", {
//                         day: "2-digit",
//                         month: "2-digit",
//                         year: "numeric",
//                       })}
//                     </td>
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   )
// }
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface KPIReport {
  id: string
  report_name: string
  report_period_start: string
  report_period_end: string
  average_kpi: number | string | null
  created_by: string
  created_at: string
}

export default function KPIReportPage() {
  const router = useRouter()
  const [reports, setReports] = useState<KPIReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/kpi/reports")
        if (!res.ok) throw new Error("Không thể tải dữ liệu KPI")
        const data: KPIReport[] = await res.json()
        setReports(data)
      } catch (err) {
        console.error(err)
        setReports([])
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Danh sách báo cáo KPI</h1>
        <Button onClick={() => router.push("/statistics/kpi/create")}>Tạo báo cáo mới</Button>
      </div>

      {reports.length === 0 ? (
        <p>Chưa có báo cáo nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 text-left">Tên báo cáo</th>
                <th className="py-2 px-3 text-left">Kỳ báo cáo</th>
                <th className="py-2 px-3 text-left">KPI TB (%)</th>
                <th className="py-2 px-3 text-left">Người tạo</th>
                <th className="py-2 px-3 text-left">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-border hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => router.push(`/statistics/kpi/report/${r.id}`)}
                >
                  <td className="py-2 px-3">{r.report_name}</td>
                  <td className="py-2 px-3">
                    {r.report_period_start} → {r.report_period_end}
                  </td>
                  <td className="py-2 px-3">
                    {r.average_kpi !== null && r.average_kpi !== undefined
                      ? parseFloat(String(r.average_kpi)).toFixed(2) + "%"
                      : "0%"}
                  </td>
                  <td className="py-2 px-3">{r.created_by}</td>
                  <td className="py-2 px-3">
                    {new Date(r.created_at).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
