"use client";

import { useEffect, useState, useMemo } from "react";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* TYPES */
interface Plan {
  id: number;
  plan_code: string;
}

interface Task {
  step_index: number;
  step_name: string;
  quantity: number;
  canEdit?: boolean;
}

interface WorkerRecord {
  worker_id: number;
  worker_name: string;
  team: number;
  tasks: Task[];
}

export default function AttendanceRecordPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [cas, setCas] = useState<number[]>([]);
  const [selectedCa, setSelectedCa] = useState<number | null>(null);
  const [workers, setWorkers] = useState<WorkerRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* ========== LOAD PLANS ========== */
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await fetch("/api/attendance");
        const data = await res.json();
        setPlans(data.data || []);
      } catch {
        setError("Không thể tải kế hoạch");
      }
    };
    loadPlans();
  }, []);

  /* ========== LOAD CAS ========== */
  useEffect(() => {
    if (selectedPlan === null) return;
    setSelectedCa(null);
    setCas([]);
    setWorkers([]);

    const loadCas = async () => {
      try {
        const res = await fetch(`/api/attendance/plans/${selectedPlan}/cas`);
        const data = await res.json();
        setCas(data.data || []);
      } catch {
        setCas([]);
      }
    };
    loadCas();
  }, [selectedPlan]);

  /* ========== LOAD WORKERS ========== */
  const loadWorkers = async () => {
    if (!selectedPlan || !selectedCa) {
      setError("Vui lòng chọn kế hoạch và ca");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `/api/attendance/plans/${selectedPlan}/ca/${selectedCa}/workers`
      );
      const data = await res.json();

      const normalized: WorkerRecord[] = (data.data || []).map((w: any) => ({
        worker_id: Number(w.worker_id),
        worker_name: w.worker_name,
        team: Number(w.team),
        tasks: (w.tasks || []).map((t: any) => ({
          step_index: Number(t.step_index),
          step_name: t.step_name ?? `Công đoạn ${t.step_index}`,
          quantity: t.quantity === "" ? 0 : Number(t.quantity),
        })),
      }));

      setWorkers(normalized);
      setError("");
    } catch {
      setError("Không thể tải nhân viên");
    } finally {
      setLoading(false);
    }
  };

  /* ========== ALL STEPS ========== */
  const allSteps = useMemo(() => {
  const map = new Map<number, string>();
  workers.forEach((w) =>
    w.tasks.forEach((t) => {
      // Nếu step_name rỗng/null thì fallback tên từ index
      if (!map.has(t.step_index)) {
        map.set(t.step_index, t.step_name?.trim() || `Công đoạn ${t.step_index +1 }`);
      }
    })
  );
  return Array.from(map.entries())
    .map(([step_index, step_name]) => ({ step_index, step_name }))
    .sort((a, b) => a.step_index - b.step_index);
}, [workers]);


  /* ========== WORKERS WITH ALL TASKS ========== */
  const workersWithTasks = useMemo(() => {
    return workers.map((w) => ({
      ...w,
      tasks: allSteps.map((s) => {
        const exist = w.tasks.find((t) => t.step_index === s.step_index);
        return exist
          ? { ...exist, canEdit: true }
          : { step_index: s.step_index, step_name: s.step_name, quantity: 0, canEdit: false };
      }),
    }));
  }, [workers, allSteps]);

  /* ========== GROUP BY TEAM ========== */
  const groupedByTeam = useMemo(() => {
    const map: Record<string, WorkerRecord[]> = {};
    workersWithTasks.forEach((w) => {
      if (!map[w.team]) map[w.team] = [];
      map[w.team].push(w);
    });
    return map;
  }, [workersWithTasks]);

  /* ========== HANDLE QUANTITY CHANGE ========== */
  const handleQuantityChange = (workerId: number, stepIndex: number, value: string) => {
    const qty = Number(value);
    setWorkers((prev) =>
      prev.map((w) =>
        w.worker_id === workerId
          ? {
              ...w,
              tasks: w.tasks.map((t) =>
                t.step_index === stepIndex ? { ...t, quantity: isNaN(qty) ? 0 : qty } : t
              ),
            }
          : w
      )
    );
  };

  /* ========== HANDLE SAVE ========== */
  const handleSave = async () => {
    try {
      if (!selectedPlan) {
        setError("Chưa chọn kế hoạch");
        return;
      }
      if (!selectedCa) {
        setError("Chưa chọn ca");
        return;
      }

      setError("");
      setSuccessMessage("");

      const payload = {
        plan_id: Number(selectedPlan),
        ca: Number(selectedCa),
        records: workers.map((w) => ({
          worker_id: Number(w.worker_id),
          worker_name: w.worker_name,
          team: Number(w.team),
          tasks: w.tasks.map((t) => ({
            step_index: Number(t.step_index),
            quantity: Number(t.quantity ?? 0),
          })),
        })),
      };

      const res = await fetch("/api/attendance/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        const errorMsg =
          data && typeof data === "object" && "message" in data
            ? data.message
            : "Lỗi server không xác định";
        throw new Error(errorMsg);
      }

      setSuccessMessage(data.message || "Lưu chấm công thành công!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: unknown) {
      console.error("SAVE ERROR:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã có lỗi xảy ra");
      }
    }
  };

  /* ========== UI ========== */
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <h1 className="text-3xl font-bold">Chấm công theo kế hoạch</h1>

        {/* PLAN + CA + LOAD WORKERS */}
        {/* Bên trong render */}
<div className="flex gap-4 items-center">
  <select
    className="border px-3 py-2 rounded"
    value={selectedPlan ?? ""}
    onChange={(e) => setSelectedPlan(Number(e.target.value))}
  >
    <option value="">-- Chọn kế hoạch --</option>
    {plans.map((p) => (
      <option key={p.id} value={p.id}>{p.plan_code}</option>
    ))}
  </select>

  <select
    className="border px-3 py-2 rounded"
    value={selectedCa ?? ""}
    onChange={(e) => setSelectedCa(Number(e.target.value))}
    disabled={!selectedPlan}
  >
    <option value="">-- Chọn ca --</option>
    {cas.map((c) => (
      <option key={c} value={c}>Ca {c}</option>
    ))}
  </select>

  <Button onClick={loadWorkers}>Tải nhân viên</Button>
</div>


        {/* Thông báo lỗi / thành công */}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {successMessage && <div className="text-green-600 mb-2">{successMessage}</div>}

        {/* DANH SÁCH NHÂN VIÊN */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách nhân viên</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Đang tải...</div>
            ) : Object.keys(groupedByTeam).length === 0 ? (
              <div className="text-gray-500 text-center mt-4">Chưa có dữ liệu</div>
            ) : (
              Object.keys(groupedByTeam).map((team) => {
                const workers = groupedByTeam[team];
                return (
                  <div key={team} className="mb-8">
                    <h2 className="font-bold text-blue-600 mb-2">Tổ {team}</h2>
                    <table className="w-full border">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="border p-2">Nhân viên</th>
                          {allSteps.map((s) => (
                            <th key={s.step_index} className="border p-2 text-center">
                              {s.step_name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {workers.map((w) => (
                          <tr key={w.worker_id}>
                            <td className="border p-2">{w.worker_name}</td>
                            {w.tasks.map((t) => (
                              <td
                                key={`${w.worker_id}-${t.step_index}`}
                                className="border p-2 text-center"
                              >
                                <input
                                  type="number"
                                  min={0}
                                  value={t.quantity}
                                  disabled={!t.canEdit}
                                  className={
                                    "border rounded px-2 py-1 w-20 text-center " +
                                    (!t.canEdit
                                      ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                                      : "")
                                  }
                                  onChange={(e) =>
                                    t.canEdit &&
                                    handleQuantityChange(w.worker_id, t.step_index, e.target.value)
                                  }
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Nút lưu */}
        <div className="flex justify-end">
            {/* Thông báo lưu thành công */}
  {successMessage && (
    <div className="text-green-600 ml-4 font-medium">{successMessage}</div>
  )}
          <Button onClick={handleSave}>Lưu chấm công</Button>

        </div>
      </main>
    </div>
  );
}
