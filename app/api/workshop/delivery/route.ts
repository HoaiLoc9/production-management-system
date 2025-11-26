import { NextResponse } from "next/server";
import { query } from "@/lib/db_dinh";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("supervisorEmail");
    const planCode = url.searchParams.get("planCode");

    // Endpoint 1: Lấy chi tiết sản phẩm của một kế hoạch
    if (planCode) {
      const productRes = await query(
        `
        SELECT 
          od.id,
          p.maSP,
          p.tenSP,
          od.soLuong,
          od.donGia,
          od.tienCoc
        FROM production_plans pp
        JOIN orders o ON pp.maDH = o.maDH
        JOIN order_details od ON o.maDH = od.maDH
        JOIN products p ON od.maSP = p.maSP
        WHERE pp.plan_code = $1
        `,
        [parseInt(planCode)]
      );

      console.log("Query result for planCode:", planCode, productRes.rows);

      if (!productRes.rows || productRes.rows.length === 0) {
        return NextResponse.json({
          products: []
        });
      }

      const products = productRes.rows.map(row => ({
        id: row.id?.toString() || row.masp?.toString(),
        name: row.tensp,
        quantity: parseInt(row.soluong),
        price: parseFloat(row.dongia),
        deposit: parseFloat(row.tiencoc || 0),
      }));

      console.log("Products to return:", products);
      return NextResponse.json({ products });
    }

    // Endpoint 2: Lấy danh sách kế hoạch sản xuất của supervisor
    if (!email) {
      return NextResponse.json({ error: "Thiếu email supervisor" }, { status: 400 });
    }

    const res = await query(
      `
      SELECT 
        p.plan_code,
        o.maDH,
        c.tenKH,
        p.start_date AS ngayLapKH,
        COALESCE(SUM(od.soLuong * od.donGia), 0) AS totalAmount,
        COALESCE(SUM(od.tienCoc), 0) AS totalDeposit,
        w.tenXuong
      FROM production_plans p
      JOIN orders o ON p.maDH = o.maDH
      JOIN customers c ON o.maKH = c.maKH
      JOIN workshops w ON p.maXuong = w.maXuong
      JOIN users u ON w.matruongxuong = u.id
      JOIN order_details od ON o.maDH = od.maDH
      WHERE p.status = 'running' AND u.email = $1
      GROUP BY p.plan_code, o.maDH, c.tenKH, p.start_date, w.tenXuong
      ORDER BY p.plan_code DESC
      `,
      [email]
    );

    console.log("Orders found:", res.rows.length);

    const data = res.rows.map((row) => ({
      id: row.plan_code.toString(),
      code: "Kế hoạch sản xuất " + row.plan_code,   
      customer: row.tenkh,
      createdAt: row.ngaylapkh,
      totalAmount: Number(row.totalamount) || 0,
      totalDeposit: Number(row.totaldeposit) || 0,
      status: "running",
      workshop: row.tenxuong,
    }));

    return NextResponse.json(data);
  } catch (e: any) {
    console.error("Error in GET /api/workshop/delivery:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}