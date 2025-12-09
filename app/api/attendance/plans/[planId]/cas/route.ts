import { NextResponse } from "next/server";
import { query } from "@/lib/db_nhu";

export async function GET(req: Request, context: any) {
  try {
    const params = await context.params;
    const planId = Number(params.planId);

    if (isNaN(planId)) {
      return NextResponse.json({ message: "planId không hợp lệ" }, { status: 400 });
    }

    // 1) Lấy tất cả ca của kế hoạch
    const res = await query(
      `SELECT DISTINCT ca FROM assignments WHERE plan_id = $1 ORDER BY ca`,
      [planId]
    );
    const cas = res.rows.map((r: any) => r.ca);

    // 2) Lấy các ca đã chấm
    const resCompleted = await query(
      `SELECT DISTINCT ca FROM attendance_quantity WHERE plan_id = $1`,
      [planId]
    );
    const completedCas = resCompleted.rows.map((r: any) => r.ca);

    return NextResponse.json({ data: cas, completedCas });
  } catch (err: any) {
    console.error("GET /api/attendance/plans/[planId]/cas ERROR:", err);
    return NextResponse.json({ message: "Lỗi server khi tải ca" }, { status: 500 });
  }
}
