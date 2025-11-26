import { NextResponse } from "next/server";
import { query } from "@/lib/db_dinh";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const workerId = url.searchParams.get("workerId");

    if (!workerId) {
      return NextResponse.json({ error: "Thiếu workerId" }, { status: 400 });
    }

    const res = await query(
      `
      SELECT 
        wa.id,
        wa.task_description,
        wa.status,
        wa.progress,
        wa.assigned_date,
        wa.work_shift,
        pp.plan_code,
        o.maDH,
        c.tenKH,
        pp.start_date,
        pp.end_date,
        w.tenXuong
      FROM work_assignments wa
      JOIN production_plans pp ON wa.production_plan_id = pp.plan_code
      JOIN orders o ON pp.maDH = o.maDH
      JOIN customers c ON o.maKH = c.maKH
      JOIN workshops w ON pp.maXuong = w.maXuong
      WHERE wa.worker_id = $1
      ORDER BY wa.assigned_date ASC
      `,
      [parseInt(workerId)]
    );

    const assignments = res.rows.map((row: any) => ({
      id: row.id,
      taskDescription: row.task_description,
      status: row.status,
      progress: parseInt(row.progress) || 0,
      assignedDate: row.assigned_date,
      work_shift:row.work_shift,
      planCode: row.plan_code,
      orderId: row.madh,
      customerName: row.tenkh,
      startDate: row.start_date,
      endDate: row.end_date,
      workshopName: row.tenxuong,
    }));

    return NextResponse.json(assignments);
  } catch (e: any) {
    console.error("Error in GET /api/worker/assignments:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}