import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db_nhu";

export async function GET(req: NextRequest) {
  try {
    // 1) Lấy plan_id đã chấm công
    const completedRes = await query(`SELECT DISTINCT plan_id FROM attendance_quantity`);
    const completed = completedRes.rows.map((r: any) => r.plan_id);

    // 2) Lấy tất cả kế hoạch
    const plansRes = await query(`SELECT id, plan_code FROM production_plans`);

    return NextResponse.json({
      success: true,
      data: plansRes.rows,
      completed: completed,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
