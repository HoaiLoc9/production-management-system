import { NextResponse } from "next/server";
import { query } from "@/lib/db_nhu";

export async function POST(req: Request) {
  const body = await req.json();
  const { plan_id, ca, records } = body;

  if (!plan_id || !ca || !records) {
    return NextResponse.json({ message: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  try {
    for (const w of records) {
      for (const t of w.tasks) {
        const qty = Number(t.quantity);
        if (isNaN(qty) || qty < 0) {
          return NextResponse.json({
            message: `Số lượng không hợp lệ cho nhân viên ${w.worker_id}, khâu ${t.step_index}`
          }, { status: 400 });
        }

        await query(
          `INSERT INTO attendance_quantity (plan_id, ca, worker_id, step_index, quantity)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (plan_id, ca, worker_id, step_index)
           DO UPDATE SET quantity = EXCLUDED.quantity`,
          [plan_id, ca, w.worker_id, t.step_index, qty]
        );
      }
    }

    return NextResponse.json({ message: "Chấm công thành công" });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
