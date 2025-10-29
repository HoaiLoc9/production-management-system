import { NextResponse } from "next/server"

const kpiReports: any[] = []

export async function GET() {
  return NextResponse.json(kpiReports)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.created_by) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

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
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
