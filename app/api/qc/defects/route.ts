import { NextResponse } from "next/server"

// Mock data - replace with real database
const defects = [
  {
    id: 1,
    type: "product",
    item: "Ghế Gỗ",
    defect: "Vết nứt",
    severity: "high",
    date: "2025-01-20",
  },
  {
    id: 2,
    type: "material",
    item: "Gỗ Tần Bì",
    defect: "Mục nước",
    severity: "high",
    date: "2025-01-20",
  },
]

export async function GET() {
  return NextResponse.json(defects)
}

export async function POST(request: Request) {
  const data = await request.json()
  const newDefect = {
    id: defects.length + 1,
    ...data,
    date: new Date().toISOString().split("T")[0],
  }
  defects.push(newDefect)
  return NextResponse.json(newDefect, { status: 201 })
}
