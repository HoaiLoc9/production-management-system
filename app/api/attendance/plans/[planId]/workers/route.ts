import { NextResponse } from "next/server"
import { query } from "@/lib/db_nhu"

interface Task {
  step_index: number
  step_name: string
  quantity: number
}

interface WorkerRecord {
  worker_id: number
  worker_name: string
  team: string
  tasks: Task[]
}

export async function GET({ params }: { params: { planId: string } }) {
  const planId = Number(params.planId)

  // Fake dữ liệu: 10 tổ, mỗi tổ 5-6 nhân viên, 5 bước
  const teams = Array.from({ length: 10 }, (_, i) => `Tổ ${i + 1}`)
  let workerId = 1
  const workers: WorkerRecord[] = []

  teams.forEach(team => {
    const num = Math.floor(Math.random() * 2) + 5
    for (let i = 0; i < num; i++) {
      const tasks: Task[] = []
      for (let j = 0; j < 5; j++) {
        tasks.push({ step_index: j, step_name: `Bước ${j + 1}`, quantity: 0 })
      }
      workers.push({
        worker_id: workerId,
        worker_name: `Nhân viên ${workerId}`,
        team,
        tasks
      })
      workerId++
    }
  })

  return NextResponse.json({ data: workers })
}
