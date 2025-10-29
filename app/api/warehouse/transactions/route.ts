import { NextResponse } from "next/server"

// Mock data - replace with real database
const transactions = [
  {
    id: 1,
    type: "import",
    material_id: 1,
    quantity: 100,
    supplier: "Công ty ABC",
    date: "2025-01-20",
  },
  {
    id: 2,
    type: "export",
    material_id: 2,
    quantity: 50,
    destination: "Xưởng Sản Xuất",
    date: "2025-01-19",
  },
]

export async function GET() {
  return NextResponse.json(transactions)
}

export async function POST(request: Request) {
  const data = await request.json()
  const newTransaction = {
    id: transactions.length + 1,
    ...data,
    date: new Date().toISOString().split("T")[0],
  }
  transactions.push(newTransaction)
  return NextResponse.json(newTransaction, { status: 201 })
}
