<<<<<<< HEAD
// import { NextResponse } from "next/server"

// const kpiReports: any[] = []

// export async function GET() {
//   return NextResponse.json(kpiReports)
// }

// export async function POST(request: Request) {
//   try {
//     const data = await request.json()

//     if (!data.created_by) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
//     }

//     const newReport = {
//       id: `KPI-${Date.now()}`,
//       report_date: data.report_date,
//       workshops: data.workshops,
//       average_kpi: data.average_kpi,
//       notes: data.notes,
//       created_by: data.created_by,
//       created_at: new Date().toISOString(),
//       status: "draft",
//     }

//     kpiReports.push(newReport)

//     return NextResponse.json(newReport, { status: 201 })
//   } catch (error) {
//     console.error("Error creating KPI report:", error)
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import { kpiDrafts, finalReports } from "@/app/api/kpi/data"

export async function GET() {
  // Return saved final KPI reports
  return NextResponse.json(finalReports)
=======
import { NextResponse } from "next/server"

const kpiReports: any[] = []

export async function GET() {
  return NextResponse.json(kpiReports)
>>>>>>> origin/thaibao-feature
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.created_by) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

<<<<<<< HEAD
    // Create a final consolidated report from provided draft ids
    if (data.report_name && Array.isArray(data.kpi_report_ids)) {
      // collect approved drafts matching ids
      const selectedDrafts = kpiDrafts.filter((d) => data.kpi_report_ids.includes(d.id) && d.status === "approved")

      if (selectedDrafts.length === 0) {
        return NextResponse.json({ message: "No approved KPI drafts found for provided ids" }, { status: 400 })
      }

      // Optionally aggregate values; for demo we'll copy workshops from drafts
      const aggregatedWorkshops = selectedDrafts.flatMap((d) => d.workshops || [])

      const newFinalReport = {
        id: `FINAL-KPI-${Date.now()}`,
        report_name: data.report_name,
        report_period_start: data.report_period_start,
        report_period_end: data.report_period_end,
        summary: data.summary,
        recommendations: data.recommendations,
        average_kpi: data.average_kpi,
        kpi_report_ids: data.kpi_report_ids,
        workshops: aggregatedWorkshops,
        created_by: data.created_by,
        created_at: new Date().toISOString(),
        status: "completed",
      }

      finalReports.push(newFinalReport)
      return NextResponse.json(newFinalReport, { status: 201 })
    }

    return NextResponse.json({ message: "Bad request" }, { status: 400 })
  } catch (error) {
    console.error("Error creating final KPI report:", error)
=======
    const newReport = {
      id: `KPI-${Date.now()}`,
      report_date: data.report_date,
      workshops: data.workshops,
      average_kpi: data.average_kpi,
      notes: data.notes,
      created_by: data.created_by,
      created_at: new Date().toISOString(),
      status: "draft",
    }

    kpiReports.push(newReport)

    return NextResponse.json(newReport, { status: 201 })
  } catch (error) {
    console.error("Error creating KPI report:", error)
>>>>>>> origin/thaibao-feature
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
