import { NextResponse } from "next/server";
import { query } from "@/lib/db_nhu";

export async function GET(req: Request, { params }: { params: Promise<{ planId: string; ca: string }> }) {
  const { planId, ca } = await params;
  const planIdNum = Number(planId);
  const caNum = Number(ca);

  if (!planIdNum || !caNum) {
    return NextResponse.json({ message: "planId hoặc ca không hợp lệ" }, { status: 400 });
  }

  try {
    // 1) Lấy tất cả assignments của ca
    const stepsRes = await query(
      `SELECT step_index, step_name, team
       FROM assignments
       WHERE plan_id = $1 AND ca = $2
       ORDER BY step_index`,
      [planIdNum, caNum]
    );
    const steps = stepsRes.rows;

    if (steps.length === 0) return NextResponse.json({ data: [] });

    // 2) Lấy các tổ liên quan
    const teams = [...new Set(steps.map((s: any) => Number(String(s.team).replace(/^to/i, ""))))];

    // 3) Lấy nhân viên của các tổ
    const workersRes = await query(
      `SELECT manv, tennv, toid FROM nhanvien WHERE toid = ANY($1::int[]) ORDER BY toid, tennv`,
      [teams]
    );

    // 4) Ghép worker + step cùng tổ
    const result = workersRes.rows.map((w: any) => ({
      worker_id: w.manv,
      worker_name: w.tennv,
      team: w.toid,
      tasks: steps
        .filter((s: any) => Number(String(s.team).replace(/^to/i, "")) === w.toid)
        .map((s: any) => ({ step_index: s.step_index, step_name: s.step_name ?? "", quantity: 0 })),
    }));

    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("GET workers ERROR:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
