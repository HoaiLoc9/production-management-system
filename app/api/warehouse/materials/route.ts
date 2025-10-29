import { NextResponse } from "next/server"

// Mock data - replace with real database
const materials = [
  { id: 1, code: "MAT-001", name: "Gỗ Tần Bì", unit: "kg", quantity: 500, reorder_level: 100 },
  { id: 2, code: "MAT-002", name: "Vải Linen", unit: "m", quantity: 200, reorder_level: 50 },
  { id: 3, code: "MAT-003", name: "Kim Loại", unit: "kg", quantity: 150, reorder_level: 30 },
]

export async function GET() {
  return NextResponse.json(materials)
}

export async function POST(request: Request) {
  const data = await request.json()
  const newMaterial = {
    id: materials.length + 1,
    ...data,
  }
  materials.push(newMaterial)
  return NextResponse.json(newMaterial, { status: 201 })
}
