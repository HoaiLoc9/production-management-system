import { NextResponse } from "next/server"
import { kpiDrafts } from "@/app/api/kpi/data"

// debug GET to verify route is reachable
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  console.log(`GET approve-route ping for id=${id}`)
  const draft = kpiDrafts.find((d) => d.id === id)
  if (!draft) return NextResponse.json({ message: "Not found" }, { status: 404 })
  return NextResponse.json(draft)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
  console.log(`POST approve-route called for id=${id} — current drafts count=${kpiDrafts.length} ids=${kpiDrafts.map(d=>d.id).join(',')}`)
    const data = await request.json()

    // require approver
    if (!data.approved_by) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const draft = kpiDrafts.find((d) => d.id === id)
    if (!draft) {
      return NextResponse.json({ message: "Draft not found" }, { status: 404 })
    }

    draft.status = "approved"
    draft.approved_by = data.approved_by
    draft.approved_at = new Date().toISOString()

    return NextResponse.json(draft)
  } catch (error) {
    console.error("Error approving KPI draft:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
