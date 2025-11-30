import { NextResponse } from "next/server";
import { query } from "@/lib/db_dinh";

// ======================= GET ========================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Thiếu ID nhân viên!" },
        { status: 400 }
      );
    }

    const res = await query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      [id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy tài khoản" },
        { status: 404 }
      );
    }

    return NextResponse.json(res.rows[0]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


// ======================= PUT ========================
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID!" }, { status: 400 });
    }

    const { name, email, password, role } = await req.json();

    if (!name || !email || !role) {
      return NextResponse.json({ error: "Thiếu dữ liệu!" }, { status: 400 });
    }

    const updateFields: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (name) { updateFields.push(`name = $${index++}`); values.push(name); }
    if (email) { updateFields.push(`email = $${index++}`); values.push(email); }
    if (password) { updateFields.push(`password = $${index++}`); values.push(password); }
    if (role) { updateFields.push(`role = $${index++}`); values.push(role); }

    values.push(id);

    const sql = `UPDATE users SET ${updateFields.join(", ")} WHERE id = $${index}`;

    await query(sql, values);

    return NextResponse.json({ message: "Cập nhật thành công!" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


// ======================= DELETE ========================
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID!" }, { status: 400 });
    }

    await query("DELETE FROM users WHERE id = $1", [id]);

    return NextResponse.json({ message: "Xóa tài khoản thành công!" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
