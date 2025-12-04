"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/sidebar";

interface Task {
  step_index: number;
  step_name: string;
  quantity: number | string;
}

interface WorkerRecord {
  worker_id: number;
  worker_name: string;
  team: string;
  tasks: Task[];
}

export default function AttendancePage() {
  const [planId] = useState<number>(1);
  const [selectedCa, setSelectedCa] = useState<string>("Ca 1");
  const [workers, setWorkers] = useState<WorkerRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Load danh sách nhân viên + công đoạn
  const loadWorkers = async () => {
    setLoading(true);
    setError("");
    setWorkers([]);

    try {
      const res = await fetch(
        `/api/attendance/plans/${planId}/ca/${encodeURIComponent(selectedCa)}/workers`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể lấy danh sách nhân viên");

      setWorkers(data.data || []);
    } catch (err: any) {
      setError(err.message || "Lỗi server");
      console.error("[Load Workers Error]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, [selectedCa]);

  // Cập nhật số lượng nhập
  const handleQuantityChange = (workerId: number, stepIndex: number, value: string) => {
    setWorkers(prev =>
      prev.map(w =>
        w.worker_id === workerId
          ? {
              ...w,
              tasks: w.tasks.map(t =>
                t.step_index === stepIndex ? { ...t, quantity: value } : t
              ),
            }
          : w
      )
    );
  };

  // Lưu dữ liệu
  const handleSave = async () => {
    setError("");
    setSuccessMessage("");

    // Validate số lượng
    for (const w of workers) {
      for (const t of w.tasks) {
        const qty = Number(t.quantity);
        if (t.quantity === "" || isNaN(qty) || qty < 0) {
          setError(`Số lượng của ${w.worker_name} ở khâu "${t.step_name}" không hợp lệ!`);
          return;
        }
      }
    }

    // Chuẩn bị payload
    const payload = {
      plan_id: planId,
      ca: selectedCa,
      records: workers.map(w => ({
        worker_id: w.worker_id,
        team: w.team,
        tasks: w.tasks.map(t => ({ step_index: t.step_index, quantity: Number(t.quantity) })),
      })),
    };

    try {
      const res = await fetch("/api/attendance/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lưu thất bại");

      setSuccessMessage("Chấm công thành công");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Lỗi server");
    }
  };

  // Lấy tất cả các công đoạn để hiển thị cột
  const allSteps: Task[] = [];
  workers.forEach(w => {
    (w.tasks || []).forEach(t => {
      if (!allSteps.find(s => s.step_index === t.step_index)) {
        allSteps.push({ ...t });
      }
    });
  });
  allSteps.sort((a, b) => a.step_index - b.step_index);

  // Nhóm nhân viên theo team
  const groupedByTeam = workers.reduce((acc: any, w) => {
    if (!acc[w.team]) acc[w.team] = [];
    acc[w.team].push(w);
    return acc;
  }, {});

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <h1 className="text-3xl font-bold">Chấm công theo số lượng</h1>

        {/* Chọn ca */}
        <div className="flex items-center gap-3 mb-4">
          <label className="font-semibold">Chọn ca:</label>
          <select
            value={selectedCa}
            onChange={(e) => setSelectedCa(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option>Ca 1</option>
            <option>Ca 2</option>
            <option>Ca 3</option>
          </select>
        </div>

        {/* Thông báo */}
        {error && <div className="text-red-600 p-2 bg-red-100 rounded">{error}</div>}
        {successMessage && (
          <div className="text-green-700 p-2 bg-green-100 rounded">{successMessage}</div>
        )}

        {/* Bảng chấm công */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách nhân viên theo tổ</CardTitle>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Đang tải...</div>
            ) : workers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Không có nhân viên trong ca này</div>
            ) : (
              <>
                {Object.keys(groupedByTeam).map(team => (
                  <div key={team} className="mb-8">
                    <h2 className="text-xl font-bold mb-2 text-blue-700">Tổ: {team}</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full border rounded bg-white shadow-sm">
                        <thead className="sticky top-0 bg-gray-200">
                          <tr>
                            <th className="border px-3 py-2">Nhân viên</th>
                            {/* Cột công đoạn */}
                            {allSteps.map(step => (
                              <th key={step.step_index} className="border px-3 py-2">
                                {step.step_name}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {groupedByTeam[team].map((w: WorkerRecord) => (
                            <tr key={w.worker_id} className="hover:bg-gray-50">
                              <td className="border px-3 py-2 font-medium">{w.worker_name}</td>
                              {/* Ô nhập số lượng cho từng công đoạn */}
                              {allSteps.map(step => {
                                const task = w.tasks.find(t => t.step_index === step.step_index);
                                return (
                                  <td className="border px-3 py-2 text-center" key={step.step_index}>
                                    <input
                                      type="number"
                                      min={0}
                                      className="w-24 px-2 py-1 rounded border"
                                      value={task?.quantity ?? ""}
                                      onChange={(e) =>
                                        handleQuantityChange(
                                          w.worker_id,
                                          step.step_index,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>

        {/* Nút lưu */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-6 py-2 text-lg">
            Lưu chấm công
          </Button>
        </div>
      </main>
    </div>
  );
}
