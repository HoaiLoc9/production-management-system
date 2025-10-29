import { NextResponse } from "next/server"

// Mock data - replace with real database
const attendanceRecords = [
  {
    id: 1,
    worker_id: 1,
    date: "2025-01-20",
    check_in: "08:00",
    check_out: "17:00",
    status: "present",
  },
  {
    id: 2,
    worker_id: 2,
    date: "2025-01-20",
    check_in: "08:15",
    check_out: "17:00",
    status: "late",
  },
]

export async function GET() {
  return NextResponse.json(attendanceRecords)
}

export async function POST(request: Request) {
  const data = await request.json()
  const newRecord = {
    id: attendanceRecords.length + 1,
    ...data,
  }
  attendanceRecords.push(newRecord)
  return NextResponse.json(newRecord, { status: 201 })
}
