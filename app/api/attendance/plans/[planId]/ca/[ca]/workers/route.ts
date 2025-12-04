import { NextResponse } from "next/server";
import { query } from "@/lib/db_nhu";

export async function GET(req: Request, context: any) {
  const params = await context.params; // unwrap params
  const planId = Number(params.planId);
  const caString = decodeURIComponent(params.ca);

  if (!planId || !caString) {
    return NextResponse.json({ message: "planId hoặc ca không hợp lệ" }, { status: 400 });
  }

  try {
    // 1) Lấy tất cả công đoạn theo plan_id và ca
    const stepsRes = await query(
      `SELECT step_index, step_name, team, ca
       FROM assignments
       WHERE plan_id = $1 AND ca = $2
       ORDER BY step_index`,
      [planId, caString]
    );
    const steps = stepsRes.rows;

    if (steps.length === 0) return NextResponse.json({ data: [] });

    // 2) Lấy tất cả tổ trong ca
    const teams = [...new Set(steps.map(s => s.team))];

    // 3) Lấy tất cả nhân viên trong các tổ đó
    const workersRes = await query(
      `SELECT manv, tennv, toid
       FROM nhanvien
       WHERE toid = ANY($1)
       ORDER BY toid, tennv`,
      [teams]
    );
    const workers = workersRes.rows;

    // 4) Mapping công đoạn cho nhân viên theo team
    const result = workers.map(w => {
      const workerSteps = steps
        .filter(s => s.team === w.toid)
        .map(s => ({ step_index: s.step_index, step_name: s.step_name, quantity: "" }));

      return {
        worker_id: w.manv,
        worker_name: w.tennv,
        team: w.toid,
        tasks: workerSteps
      };
    });

    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
