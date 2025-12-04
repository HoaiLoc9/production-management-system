import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db_nhu"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { plan_id, steps, assigned_by } = body

    if (!plan_id || !steps || !assigned_by) {
      return NextResponse.json({ message: "Thiếu dữ liệu bắt buộc" }, { status: 400 })
    }

    // Xóa phân công cũ nếu có
    await query("DELETE FROM assignments WHERE plan_id = $1", [plan_id])

    // Insert các bước mới
    for (const [stepIndex, team] of Object.entries(steps)) {
      await query(
        "INSERT INTO assignments (plan_id, step_index, team, assigned_by) VALUES ($1, $2, $3, $4)",
        [plan_id, parseInt(stepIndex), team, assigned_by]
      )
    }

    // Cập nhật trạng thái kế hoạch
    await query("UPDATE production_plans SET status='approved' WHERE id=$1", [plan_id])

    return NextResponse.json({ success: true, message: "Phân công thành công" })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
