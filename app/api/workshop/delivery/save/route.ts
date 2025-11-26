import { NextResponse } from "next/server";
import { query } from "@/lib/db_dinh";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId)
      return NextResponse.json({ error: "Thiếu mã kế hoạch" }, { status: 400 });

    const plan_code = orderId;

    // Lấy chi tiết sản phẩm của đơn hàng
    const res = await query(
      `
      SELECT 
        od.soLuong, 
        od.donGia, 
        od.tienCoc
      FROM production_plans p
      JOIN orders o ON p.maDH = o.maDH
      JOIN order_details od ON od.maDH = o.maDH
      WHERE p.plan_code = $1
      `,
      [plan_code]
    );

    if (res.rows.length === 0)
      return NextResponse.json({ error: "Không có sản phẩm" }, { status: 400 });

    // Tính tổng giá và tổng tiền cọc
    const totalPrice = res.rows.reduce(
      (sum, item) => sum + Number(item.dongia) * Number(item.soluong),
      0
    );
    const totalDeposit = res.rows.reduce(
      (sum, item) => sum + Number(item.tiencoc || 0),
      0
    );

    // Lưu vào bảng delivery_notes
    await query(
      `INSERT INTO delivery_notes(plan_code) VALUES ($1)`,
      [plan_code]
    );

    // Cập nhật trạng thái kế hoạch sản xuất thành 'completed'
    await query(
      `UPDATE production_plans SET status = 'completed' WHERE plan_code = $1`,
      [plan_code]
    );

    return NextResponse.json({
      message: "Lập phiếu giao thành phẩm thành công",
      totalPrice,
      totalDeposit,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}