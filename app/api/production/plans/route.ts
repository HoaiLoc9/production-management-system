import { NextResponse } from "next/server"

// Mock data - replace with real database
const productionPlans = [
  {
    id: 1,
    code: "PP-2025-001",
    product: "Ghế Gỗ",
    quantity: 100,
    start_date: "2025-01-01",
    end_date: "2025-01-15",
    status: "completed",
  },
  {
    id: 2,
    code: "PP-2025-002",
    product: "Bàn Gỗ",
    quantity: 50,
    start_date: "2025-01-16",
    end_date: "2025-01-31",
    status: "in-progress",
  },
]

export async function GET() {
  return NextResponse.json(productionPlans)
}

export async function POST(request: Request) {
  const data = await request.json()
  const newPlan = {
    id: productionPlans.length + 1,
    code: `PP-2025-${String(productionPlans.length + 1).padStart(3, "0")}`,
    ...data,
  }
  productionPlans.push(newPlan)
  return NextResponse.json(newPlan, { status: 201 })
}
