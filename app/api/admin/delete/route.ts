import { NextResponse } from "next/server";
import { query } from "@/lib/db_dinh";

// Lấy thông tin user
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const res = await query(`SELECT id, name, email, role, created_at FROM users WHERE id = $1`, [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Không tìm thấy tài khoản" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// XÓA USER
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
    }

    await query(`DELETE FROM users WHERE id = $1`, [id]);

    return NextResponse.json({ message: "Xóa tài khoản thành công" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
