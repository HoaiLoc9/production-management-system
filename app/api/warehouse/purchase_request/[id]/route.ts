// app/api/warehouse/purchase_request/[id]/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const maPhieu = params.id; // VD: 'PM0001'

  try {
    const client = await pool.connect();

    const result = await client.query(
      `
      SELECT 
        pr.manvl AS "maNVL",
        rm.tennvl AS "tenNVL",
        pr.quantity AS "soLuongYeuCau",
        rm.dongia::text AS "donGia",
        s.tenncc AS "tenNCC"
      FROM purchase_requests pr
      JOIN raw_materials rm ON pr.manvl = rm.manvl
      JOIN suppliers s ON rm.mancc = s.mancc
      WHERE pr.maphieumuanvl = $1
      ORDER BY pr.manvl
      `,
      [maPhieu] // <-- truyền giá trị parameterized
    );

    client.release();

    console.log('[API] Mã phiếu:', maPhieu);
    console.log('[API] Số dòng trả về:', result.rowCount);
    console.log('[API] Dữ liệu:', result.rows);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Lỗi API chi tiết:', error.message);
    return NextResponse.json(
      { error: 'Lỗi DB', details: error.message },
      { status: 500 }
    );
  }
}
