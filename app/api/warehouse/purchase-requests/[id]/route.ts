// app/api/warehouse/purchase-requests/[id]/route.ts
import { query } from '@/lib/db'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const result = await query('DELETE FROM purchase_requests WHERE id = $1 RETURNING *', [id])

    if (result.rowCount === 0) {
      return Response.json({ error: 'Không tìm thấy phiếu để xóa' }, { status: 404 })
    }

    return Response.json(result.rows[0])
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const result = await query('SELECT * FROM purchase_requests WHERE id = $1', [id])
    if (result.rowCount === 0) {
      return Response.json({ error: 'Không tìm thấy phiếu' }, { status: 404 })
    }
    return Response.json(result.rows[0])
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 })
  }
}
