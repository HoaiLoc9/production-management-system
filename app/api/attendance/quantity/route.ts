import { NextResponse } from "next/server";
import { query } from "@/lib/db_nhu";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { plan_id, worker_id, step_index, quantity } = body;

    if (!plan_id || !worker_id || !step_index || quantity == null) {
      return NextResponse.json(
        { success: false, message: "Thiếu dữ liệu" },
        { status: 400 }
      );
    }

    const result = await query(
      `
      INSERT INTO attendance_quantity (plan_id, worker_id, step_index, quantity, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
      `,
      [plan_id, worker_id, step_index, quantity]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("POST /attendance/quantity ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Lỗi lưu số lượng" },
      { status: 500 }
    );
  }
}
