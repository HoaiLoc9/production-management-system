"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import { User, Edit, Plus, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AdminPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Redirect về login nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // Lấy danh sách nhân viên
  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/admin");
      if (!res.ok) throw new Error("Không tải được dữ liệu");
      const data = await res.json();
      const employeesArray = Array.isArray(data) ? data : data.users || [];
      setEmployees(employeesArray);
    } catch (error) {
      console.error("Lỗi khi lấy nhân viên:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchEmployees();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const handleCreate = () => {
    router.push("/admin/create");
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/update/${id}`);
  };

  const handleDelete = async (id: number, name: string) => {
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa "${name}" không?`);
    if (!confirmDelete) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/delete?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xóa thất bại");
      setEmployees(employees.filter((e) => e.id !== id));
      alert(`Tài khoản "${name}" đã xóa thành công`);
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto">

          {/* Tiêu đề gradient */}
          <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-10 mb-8 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="relative text-center">
              <div className="inline-block p-3 bg-white/20 rounded-lg mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                Quản lý thông tin tài khoản nhân viên
              </h1>
            </div>
          </div>

          {/* Nút Tạo tài khoản */}
          <div className="mb-8 flex items-center gap-4">
            <Button
              onClick={handleCreate}
              size="lg"
              className="gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-14 px-10 text-lg font-semibold rounded-xl"
            >
              <Plus className="w-6 h-6" />
              Tạo tài khoản mới
            </Button>
            <div className="text-sm text-muted-foreground">
              Tổng số: <span className="font-bold text-blue-600">{employees.length}</span> nhân viên
            </div>
          </div>

          {/* Danh sách nhân viên */}
          <div className="space-y-3">
            {employees.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Không có nhân viên nào</p>
              </div>
            ) : (
              employees.map((emp) => (
                <Card key={emp.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center justify-between p-4">
                    <div
                      className="flex items-center gap-4 flex-1 cursor-pointer hover:opacity-80 transition"
                      onClick={() => handleEdit(emp.id)}
                    >
                      <User className="w-12 h-12 p-2 bg-blue-100 text-blue-600 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{emp.name}</div>
                        <div className="text-sm text-muted-foreground">{emp.email}</div>
                        <div className="text-xs font-medium text-blue-600 mt-1 inline-block px-2 py-1 bg-blue-50 rounded">
                          {emp.role}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleEdit(emp.id)}
                      >
                        <Edit className="w-4 h-4" />
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(emp.id, emp.name)}
                        disabled={deleting === emp.id}
                        className="gap-2"
                      >
                        {deleting === emp.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        {deleting === emp.id ? "Đang xóa..." : "Xóa"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
