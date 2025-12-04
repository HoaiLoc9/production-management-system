import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
    try {
        const result = await query("SELECT * FROM donhang ORDER BY id ASC");

        return NextResponse.json(result.rows);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Không thể lấy danh sách đơn hàng" }, { status: 500 });
    }
}