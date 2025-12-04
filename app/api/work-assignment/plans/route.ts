import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db_nhu"

export async function GET(req: NextRequest) {
  try {
    const result = await query("SELECT * FROM production_plans ORDER BY id DESC")

    const approved = result.rows.filter(p => p.status === "approved")
    const notApproved = result.rows.filter(p => p.status !== "approved")

    return NextResponse.json({ approved, notApproved })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
