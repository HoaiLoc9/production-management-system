// app/api/warehouse/purchase_request/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT DISTINCT maphieumuanvl
      FROM purchase_requests
      ORDER BY maphieumuanvl
    `);
    client.release();

    // map dữ liệu thành object
    const data = result.rows.map(row => ({ maphieumuanvl: row.maphieumuanvl }));
    console.log('[API] Danh sách phiếu:', data);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Lỗi API danh sách:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
