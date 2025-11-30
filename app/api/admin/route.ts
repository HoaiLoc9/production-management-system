import { NextResponse } from "next/server";
import { query } from "@/lib/db_dinh";

export async function GET() {
  try {
    const result = await query(`
      SELECT id, name, email, role
      FROM users
      ORDER BY id ASC
    `);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
