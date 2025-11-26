import { NextResponse } from "next/server";
import { query } from "@/lib/db_dinh";

export async function POST(req: Request) {
  try {
    const { maPhieuMuaNVL } = await req.json();

    if (!maPhieuMuaNVL) {
      return NextResponse.json({ error: "Thiếu mã phiếu mua" }, { status: 400 });
    }

    // Lấy chi tiết phiếu mua
    const res = await query(
      `
      SELECT maNVL, soLuongYC
      FROM purchase_request_details
      WHERE maPhieuMuaNVL = $1
    `,
      [maPhieuMuaNVL]
    );

    const details = res.rows;

    if (details.length === 0) {
      return NextResponse.json({ error: "Phiếu không có NVL" }, { status: 400 });
    }

    // Tạo phiếu nhập kho
    await query(
      `INSERT INTO warehouse_receipts(maPhieuMuaNVL) VALUES ($1)`,
      [maPhieuMuaNVL]
    );

    // Cập nhật số lượng NVL trong bảng raw_materials
    for (const item of details) {
      await query(
        `
        UPDATE raw_materials
        SET soLuong = soLuong + $1
        WHERE maNVL = $2

      `,
        [item.soluongyc, item.manvl]
      );
    }

    // Cập nhật trạng thái phiếu mua
    await query(
      `
      UPDATE purchase_requests
      SET trangThai = 'imported'
      WHERE maPhieuMuaNVL = $1

    `,
      [maPhieuMuaNVL]
    );

    return NextResponse.json({ message: "Đã lưu nhập kho thành công" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
