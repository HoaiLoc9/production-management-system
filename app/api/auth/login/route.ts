// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db_dinh"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const result = await query(
      "SELECT id, email, name, role, password FROM users WHERE email = $1",
      [email]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Email hoặc mật khẩu sai" },
        { status: 401 }
      )
    }

    const user = result.rows[0]

    // DÙNG crypt() CỦA POSTGRESQL → CHUẨN 100% VỚI TRIGGER CỦA BẠN
    const check = await query(
      "SELECT crypt($1, $2) = $2 AS match",
      [password, user.password]
    )

    if (!check.rows[0].match) {
      return NextResponse.json(
        { message: "Email hoặc mật khẩu sai" },
        { status: 401 }
      )
    }

    const token = Buffer.from(
      JSON.stringify({ id: user.id, email: user.email, role: user.role })
    ).toString("base64")

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 })
  }
}