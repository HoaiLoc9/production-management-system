import { NextResponse } from "next/server"

// Mock data - replace with real database
const approvals = [
  {
    id: 1,
    type: "production_plan",
    code: "PP-2025-003",
    status: "pending",
    submittedBy: "manager",
    date: "2025-01-20",
  },
  {
    id: 2,
    type: "purchase_plan",
    code: "PUR-2025-001",
    status: "pending",
    submittedBy: "warehouse",
    date: "2025-01-20",
  },
]

export async function GET() {
  return NextResponse.json(approvals)
}

export async function POST(request: Request) {
  const { id, action } = await request.json()
  const approval = approvals.find((a) => a.id === id)
  if (approval) {
    approval.status = action === "approve" ? "approved" : "rejected"
  }
  return NextResponse.json(approval)
}
