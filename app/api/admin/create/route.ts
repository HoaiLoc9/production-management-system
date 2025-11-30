import { NextResponse } from "next/server";
import { query } from "@/lib/db_dinh";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Kiểm tra email trùng
    const check = await query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (check.rows.length > 0) {
      return NextResponse.json(
        { error: "Email đã tồn tại" },
        { status: 400 }
      );
    }

    // Tạo tài khoản (password sẽ tự hash bằng trigger)
    const res = await query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at
      `,
      [name, email, password, role]
    );

    return NextResponse.json({
      message: "Tạo tài khoản thành công",
      user: res.rows[0],
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
