import { NextResponse } from "next/server";
import { query } from "@/lib/db_dinh";

export async function GET() {
  try {
    const res = await query(`
      SELECT pr.maPhieuMuaNVL, pr.trangThai, pr.ngayLap,
            d.id, d.maNVL, d.soLuongYC, d.donGia,
            r.tenNVL, r.donVi, s.tenNCC
      FROM purchase_requests pr
      LEFT JOIN purchase_request_details d ON pr.maPhieuMuaNVL = d.maPhieuMuaNVL
      LEFT JOIN raw_materials r ON d.maNVL = r.maNVL
      LEFT JOIN suppliers s ON r.maNCC = s.maNCC 
      WHERE pr.trangThai = 'pending'
      ORDER BY pr.ngayLap DESC
    `);

    const data: Record<string, any[]> = {};

    res.rows.forEach(row => {
      if (!data[row.maphieumuanvl]) data[row.maphieumuanvl] = [];
      if (row.id) {
        data[row.maphieumuanvl].push({
          id: row.id,
          maNVL: row.manvl,
          tenNVL: row.tennvl,
          soLuongYC: Number(row.soluongyc),
          donGia: Number(row.dongia),
          donVi: row.donvi,
          tenNCC: row.tenncc
        });
      }
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
