import { NextResponse } from "next/server";
import { query } from "@/lib/db_nhu";

export async function GET({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Lấy kế hoạch theo id
    const planRes = await query(
      "SELECT * FROM production_plans WHERE id = $1",
      [Number(id)]
    );

    if (planRes.rows.length === 0) {
      return NextResponse.json({ message: "Kế hoạch không tồn tại" }, { status: 404 });
    }

    const plan = planRes.rows[0];

    // Lấy phân công
    const assignmentRes = await query(
      "SELECT * FROM assignments WHERE plan_id = $1",
      [Number(id)]
    );

    const assignments = assignmentRes.rows.map((a: any) => ({
      step_index: a.step_index,
      team: a.team,
    }));

    return NextResponse.json({ plan, assignments });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Lỗi server" }, { status: 500 });
  }
}
