"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Loader2, Edit } from "lucide-react"; // <- icon Edit
import { useAuth } from "@/lib/auth-context";

const roleOptions = [
  { value: "admin", label: "🛡️ Admin" },
  { value: "director", label: "👔 Giám đốc" },
  { value: "manager", label: "📊 Quản lý sản xuất" },
  { value: "supervisor", label: "👷 Xưởng trưởng" },
  { value: "warehouse_raw", label: "📦 Nhân viên kho NVL" },
  { value: "warehouse_product", label: "📫 Nhân viên kho thành phẩm" },
  { value: "qc", label: "✅ QC" },
  { value: "worker", label: "🔧 Công nhân" },
];

export default function EditEmployee() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (user?.role !== "admin") {
      router.replace("/dashboard/statistics");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/update?id=${id}`);
        const data = await res.json();
        setForm({ name: data.name, email: data.email, password: "", role: data.role });
      } catch (error) {
        setMessage({ type: "error", text: "Không thể tải nhân viên!" });
      } finally {
        setLoadingData(false);
      }
    };
    fetchUser();
  }, [id, isAuthenticated, user]);

  const handleUpdate = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/update?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
      setMessage({ type: "success", text: `✅ Cập nhật ${form.name} thành công!` });
      setTimeout(() => router.push("/admin"), 1000);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />

      {message && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded border shadow-md ${
            message.type === "success" ? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-300 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-8 flex justify-center items-start">
        {loadingData ? (
          <div className="text-muted-foreground text-center">Đang tải dữ liệu...</div>
        ) : (
          <Card className="w-full max-w-3xl shadow-xl">
            {/* CardHeader dùng icon Edit */}
            <CardHeader className="bg-gradient-to-r border-b p-4">
              <div className="flex items-center gap-3">
                <Edit className="w-6 h-6 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl font-bold">Chỉnh sửa thông tin nhân viên</CardTitle>
                 
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              <Input value={form.name} placeholder="Họ tên" onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input value={form.email} placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input value={form.password} type="password" placeholder="Nhập mật khẩu mới" onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quyền" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleUpdate} disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Cập nhật thông tin"}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
