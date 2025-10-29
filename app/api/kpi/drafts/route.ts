import { NextResponse } from "next/server"
import { kpiDrafts } from "@/app/api/kpi/data"

export async function GET() {
  // Ensure each draft includes a workshop_name for clients (derive if missing)
  const normalized = kpiDrafts.map((d) => {
    if (d.workshop_name) return d
    // try common fallbacks
    const from = d.workshop || d.workshop_id || null
    if (from) return { ...d, workshop_name: from }
    // try to infer from workshops array: look for metric mentioning workshop or a single-letter code
    if (Array.isArray(d.workshops) && d.workshops.length > 0) {
      const maybe = d.workshops.find((w: any) => /[A-D]/i.test(String(w.metric || "")))
      if (maybe) return { ...d, workshop_name: String(maybe.metric).slice(-1) }
    }
    return d
  })
  return NextResponse.json(normalized)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.created_by) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const newDraft = {
      id: `KPI-${Date.now()}`,
      report_date: data.report_date,
      workshop_name: data.workshop_name || data.workshop || data.workshop_id || null,
      workshops: data.workshops || [],
      average_kpi: data.average_kpi,
      notes: data.notes,
      created_by: data.created_by,
      created_at: new Date().toISOString(),
      status: "draft",
    }

    kpiDrafts.push(newDraft)

    return NextResponse.json(newDraft, { status: 201 })
  } catch (error) {
    console.error("Error creating KPI draft:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
