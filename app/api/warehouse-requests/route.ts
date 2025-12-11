// app/api/warehouse-requests/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db_nhu";

/**
 * GET: trả về danh sách phiếu + items
 */
export async function GET() {
  try {
    // join và aggregate items thành mảng JSON per form
    const sql = `
      SELECT
        f.id,
        f.request_code,
        f.created_date,
        f.expected_date,
        f.workshop,
        f.created_by,
        f.created_at,
        COALESCE(json_agg(
          json_build_object(
            'id', i.id,
            'material_code', i.material_code,
            'material_name', i.material_name,
            'quantity', i.quantity
          )
        ) FILTER (WHERE i.id IS NOT NULL), '[]') AS items
      FROM warehouse_request_forms f
      LEFT JOIN warehouse_request_items i ON i.form_id = f.id
      GROUP BY f.id
      ORDER BY f.created_at DESC
    `;
    const res = await query(sql);
    // res.rows for pg, or res if your query returns array
    const rows = res.rows ?? res;
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("GET warehouse-requests error:", err);
    return NextResponse.json({ message: "Lỗi khi lấy danh sách phiếu" }, { status: 500 });
  }
}

/**
 * POST: tạo 1 phiếu + nhiều items
 * Body:
 * {
 *   created_date: "2025-12-11",
 *   expected_date: "2025-12-18",
 *   workshop: "Xưởng 1",
 *   created_by?: "Nguyen",
 *   materials: [
 *     { material_code, material_name, quantity },
 *     ...
 *   ]
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { created_date, expected_date, workshop, created_by, materials } = body;

    // validate main
    if (!created_date || !expected_date || !workshop) {
      return NextResponse.json({ message: "Vui lòng cung cấp ngày lập, ngày dự kiến và xưởng" }, { status: 400 });
    }

    // validate materials array
    if (!Array.isArray(materials) || materials.length === 0) {
      return NextResponse.json({ message: "Vui lòng nhập ít nhất 1 nguyên vật liệu" }, { status: 400 });
    }

    for (const m of materials) {
      if (!m.material_code || !m.material_name || m.quantity === undefined || m.quantity === null) {
        return NextResponse.json({ message: "Thông tin nguyên vật liệu không đầy đủ" }, { status: 400 });
      }
      if (Number(m.quantity) < 1) {
        return NextResponse.json({ message: "Số lượng phải từ 1 trở lên" }, { status: 400 });
      }
    }

    // === Transaction: insert form, insert items ===
    // Note: simple transaction using query() — adjust if your query util differs
    await query("BEGIN");

    // optional: generate request_code like WR-YYYY-XXX
    const codeGenRes = await query(`
    SELECT COUNT(*)::int AS cnt 
    FROM warehouse_request_forms 
    WHERE date_trunc('year', created_at) = date_trunc('year', NOW())
    `);

    const year = new Date().getFullYear();

    // ⭐ QueryResult luôn trả về .rows — không bao giờ trả về mảng trực tiếp
    const seq = Number(codeGenRes.rows[0]?.cnt ?? 0) + 1;

    const requestCode = `WR-${year}-${String(seq).padStart(3, "0")}`;

    // Insert form
    const insertFormSql = `
    INSERT INTO warehouse_request_forms
        (request_code, created_date, expected_date, workshop, created_by)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, request_code, created_at
    `;

    const formRes = await query(insertFormSql, [
    requestCode,
    created_date,
    expected_date,
    workshop,
    created_by || null,
    ]);

    // ⭐ Chuẩn hóa lấy kết quả
    const formId = formRes.rows[0].id;

    // batch insert items
    const insertItemSql = `
      INSERT INTO warehouse_request_items
        (form_id, material_code, material_name, quantity)
      VALUES ($1, $2, $3, $4)
    `;
    for (const m of materials) {
      await query(insertItemSql, [formId, m.material_code, m.material_name, Number(m.quantity)]);
    }

    await query("COMMIT");

    return NextResponse.json({ message: "Gửi phiếu thành công", form: { id: formId, request_code: requestCode } });
  } catch (err: any) {
    console.error("POST warehouse-requests error:", err);
    try { await query("ROLLBACK"); } catch (e) {}
    return NextResponse.json({ message: "Lỗi khi gửi phiếu" }, { status: 500 });
  }
}
