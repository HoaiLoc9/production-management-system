"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";

interface MaterialRow {
  material_code: string;
  material_name: string;
  quantity: string; // keep as string for input control
}

interface FormState {
  created_date: string;
  expected_date: string;
  workshop: string;
  materials: MaterialRow[];
}

export default function WarehouseRequestPage() {
  const [forms, setForms] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function getToday() {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }

  const [form, setForm] = useState<FormState>({
    created_date: getToday(),
    expected_date: "",
    workshop: "",
    materials: [{ material_code: "", material_name: "", quantity: "1" }],
  });

  useEffect(() => {
    loadForms();
  }, []);

  async function loadForms() {
    try {
      const res = await fetch("/api/warehouse-requests");
      if (!res.ok) throw new Error("Không thể lấy danh sách");
      const data = await res.json();
      setForms(data);
    } catch (e) {
      console.error("Lỗi load forms:", e);
    }
  }

  function addMaterialRow() {
    setForm((prev) => ({ ...prev, materials: [...prev.materials, { material_code: "", material_name: "", quantity: "1" }] }));
  }

  function removeMaterialRow(index: number) {
    setForm((prev) => {
      const m = [...prev.materials];
      if (m.length === 1) return prev; // ít nhất 1 dòng
      m.splice(index, 1);
      return { ...prev, materials: m };
    });
  }

  function updateMaterial(index: number, key: keyof MaterialRow, value: string) {
    setForm((prev) => {
      const m = prev.materials.map((row, i) => (i === index ? { ...row, [key]: value } : row));
      return { ...prev, materials: m };
    });
  }

  function updateMainField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateBeforeSubmit() {
    if (!form.created_date || !form.expected_date || !form.workshop) {
      setErrorMessage("Vui lòng nhập ngày lập, ngày dự kiến và xưởng");
      return false;
    }
    if (!Array.isArray(form.materials) || form.materials.length === 0) {
      setErrorMessage("Vui lòng thêm ít nhất 1 nguyên vật liệu");
      return false;
    }
    for (const [i, m] of form.materials.entries()) {
      if (!m.material_code?.trim() || !m.material_name?.trim() || m.quantity === "" || m.quantity === null) {
        setErrorMessage(`Nguyên vật liệu ở dòng ${i + 1} chưa đầy đủ thông tin`);
        return false;
      }
      const q = Number(m.quantity);
      if (isNaN(q) || q < 1) {
        setErrorMessage(`Số lượng ở dòng ${i + 1} phải là số >= 1`);
        return false;
      }
    }
    // optional: expected_date >= created_date
    if (new Date(form.expected_date) < new Date(form.created_date)) {
      setErrorMessage("Ngày dự kiến nhận phải không sớm hơn ngày lập phiếu");
      return false;
    }
    setErrorMessage("");
    return true;
  }

  async function handleSubmit() {
    if (!validateBeforeSubmit()) return;

    try {
      const payload = {
        created_date: form.created_date,
        expected_date: form.expected_date,
        workshop: form.workshop,
        created_by: "Xưởng trưởng", // bạn có thể lấy user từ context
        materials: form.materials.map((m) => ({ material_code: m.material_code.trim(), material_name: m.material_name.trim(), quantity: Number(m.quantity) })),
      };

      const res = await fetch("/api/warehouse-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Lỗi khi gửi phiếu");
        return;
      }

      setSuccessMessage("Gửi phiếu thành công");
      setTimeout(() => setSuccessMessage(""), 3000);

      // reset form to default (keep created_date default today)
      setForm({ created_date: getToday(), expected_date: "", workshop: "", materials: [{ material_code: "", material_name: "", quantity: "1" }] });

      // reload list
      loadForms();
    } catch (err) {
      console.error(err);
      setErrorMessage("Lỗi server khi gửi");
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        <h1 className="text-3xl font-bold">Phiếu Yêu Cầu Xuất Kho</h1>

        {errorMessage && <div className="rounded p-3 text-sm bg-red-100 text-red-700 border border-red-300">{errorMessage}</div>}
        {successMessage && <div className="rounded p-3 text-sm bg-green-100 text-green-700 border border-green-300">{successMessage}</div>}

        <Card>
          <CardHeader><CardTitle>Tạo Phiếu Yêu Cầu (Nhiều NVL)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {form.materials.map((m, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-4 items-end border p-3 rounded">
                  <div>
                    <label className="text-sm font-medium">Mã NVL</label>
                    <Input value={m.material_code} onChange={(e) => updateMaterial(idx, "material_code", e.target.value)} placeholder="NVL-001" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tên NVL</label>
                    <Input value={m.material_name} onChange={(e) => updateMaterial(idx, "material_name", e.target.value)} placeholder="Gỗ lim" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Số lượng</label>
                    <Input type="number" min={1} value={m.quantity} onChange={(e) => updateMaterial(idx, "quantity", e.target.value)} />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="destructive" onClick={() => removeMaterialRow(idx)} disabled={form.materials.length === 1}><Trash size={16} /></Button>
                  </div>
                </div>
              ))}

              <div>
                <Button onClick={addMaterialRow} className="flex gap-2"><Plus size={16} /> Thêm nguyên vật liệu</Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <label className="text-sm font-medium">Ngày Lập Phiếu</label>
                <Input type="date" value={form.created_date} onChange={(e) => updateMainField("created_date", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Ngày Dự Kiến Nhận</label>
                <Input type="date" value={form.expected_date} onChange={(e) => updateMainField("expected_date", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Xưởng</label>
                <Input value={form.workshop} onChange={(e) => updateMainField("workshop", e.target.value)} placeholder="Xưởng 1" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSubmit}>Gửi Phiếu</Button>
            </div>
          </CardContent>
        </Card>

        {/* LIST PHIẾU */}
        <Card>
          <CardHeader><CardTitle>Danh sách phiếu</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forms.length === 0 && <div className="text-sm text-muted-foreground">Chưa có phiếu nào</div>}
              {forms.map((f) => (
                <div key={f.id} className="border rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="font-semibold">{f.request_code ?? `Phiếu #${f.id}`}</div>
                      <div className="text-sm text-muted-foreground">Xưởng: {f.workshop} • Ngày lập: {f.created_date} • Ngày nhận: {f.expected_date}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">Tạo: {f.created_by ?? "-"}</div>
                  </div>

                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1">Mã NVL</th>
                        <th className="text-left py-1">Tên NVL</th>
                        <th className="text-left py-1">Số lượng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(f.items) && f.items.map((it: any) => (
                        <tr key={it.id}>
                          <td className="py-1">{it.material_code}</td>
                          <td className="py-1">{it.material_name}</td>
                          <td className="py-1">{it.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
