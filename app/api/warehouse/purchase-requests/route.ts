// app/api/warehouse/purchase-requests/route.ts
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query("SELECT * FROM purchase_requests ORDER BY created_at DESC")
    return Response.json(result.rows)
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { date, requester, materials, status } = await request.json()

    const queryStr = `
      INSERT INTO purchase_requests (date, requester, materials, status, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `

    const result = await query(queryStr, [date, requester, JSON.stringify(materials), status])
    return Response.json(result.rows[0], { status: 201 })
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { date, requester, materials, status } = await request.json()

    // Attempt to delete a matching row. We match on date, requester and materials JSON string.
    const result = await query(
      `DELETE FROM purchase_requests WHERE date = $1 AND requester = $2 AND materials = $3 RETURNING *`,
      [date, requester, JSON.stringify(materials)]
    )

    if (result.rowCount === 0) {
      return Response.json({ error: "Không tìm thấy phiếu để xóa" }, { status: 404 })
    }

    return Response.json(result.rows[0])
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 })
  }
}
