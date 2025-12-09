import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db_nhu";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    if (!payload.plan_id || payload.ca == null || !Array.isArray(payload.records)) {
      return NextResponse.json({ success: false, message: "Payload không hợp lệ" }, { status: 400 });
    }

    for (const rec of payload.records) {
      for (const t of rec.tasks) {
        await query(
          `INSERT INTO attendance_quantity
          (plan_id, ca, worker_name, worker_id, team, step_index, quantity, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
          ON CONFLICT (plan_id, ca, worker_id, step_index) DO UPDATE
          SET quantity = EXCLUDED.quantity, created_at = NOW()`,
          [payload.plan_id, payload.ca, rec.worker_name, rec.worker_id, rec.team, t.step_index, t.quantity]
        );
      }
    }

    return NextResponse.json({ success: true, message: "Lưu chấm công thành công!" });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
