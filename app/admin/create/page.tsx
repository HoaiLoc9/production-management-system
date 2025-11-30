"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Loader2, User, Mail, Lock, Shield } from "lucide-react";
import Header from "@/components/layout/header";
import { useAuth } from "@/lib/auth-context";

const roleOptions = [
  { value: "admin", label: "🛡️ Admin", color: "bg-purple-100 border-purple-300" },
  { value: "director", label: "👔 Giám đốc", color: "bg-purple-100 border-purple-300" },
  { value: "manager", label: "📊 Quản lý sản xuất", color: "bg-blue-100 border-blue-300" },
  { value: "supervisor", label: "👷 Xưởng trưởng", color: "bg-green-100 border-green-300" },
  { value: "warehouse_raw", label: "📦 Nhân viên kho NVL", color: "bg-yellow-100 border-yellow-300" },
  { value: "warehouse_product", label: "📫 Nhân viên kho thành phẩm", color: "bg-orange-100 border-orange-300" },
  { value: "qc", label: "✅ QC", color: "bg-cyan-100 border-cyan-300" },
  { value: "worker", label: "🔧 Công nhân", color: "bg-gray-100 border-gray-300" },
];

export default function CreateUserPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth(); // Bảo mật admin

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Redirect nếu chưa login hoặc không phải admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (user?.role !== "admin") {
      router.replace("/dashboard/statistics");
    }
  }, [isAuthenticated, user, router]);

  const validateField = (field: string, value: string) => {
    let error = "";
    if (!value) {
      error = "Không được để trống";
    } else {
      if (field === "name") {
        const nameRegex = /^\p{Lu}\p{Ll}*(\s\p{Lu}\p{Ll}*)*$/u;
        if (!nameRegex.test(value)) error = "Họ tên phải đúng định dạng (vd: Nguyễn Văn A)";
      }
      if (field === "email") {
        const emailRegex = /^[A-Za-z]+@company\.com$/;
        if (!emailRegex.test(value)) error = "Email phải có định dạng abc@company.com";
      }
      if (field === "password" && value.length < 6) error = "Mật khẩu phải ≥ 6 ký tự";
      if (field === "confirmPassword" && value !== form.password) error = "Mật khẩu nhập lại không khớp";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const handleCreate = async () => {
    const isValid =
      validateField("name", form.name) &&
      validateField("email", form.email) &&
      validateField("password", form.password) &&
      validateField("confirmPassword", form.confirmPassword) &&
      validateField("role", form.role);

    if (!isValid) {
      setMessage({ type: "error", text: "Vui lòng kiểm tra lại thông tin" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) setMessage({ type: "error", text: data.error });
      else {
        setMessage({ type: "success", text: `✅ Tạo tài khoản ${form.name} thành công!` });
        setForm({ name: "", email: "", password: "", confirmPassword: "", role: "" });
        setErrors({ name: "", email: "", password: "", confirmPassword: "", role: "" });
        setTimeout(() => router.push("/admin"), 1000);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== "admin") return null;

  const selectedRole = roleOptions.find((r) => r.value === form.role);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      {message && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded border shadow-md ${
            message.type === "success"
              ? "bg-green-50 border-green-300 text-green-800"
              : "bg-red-50 border-red-300 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r border-b">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl">Tạo tài khoản mới</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Tạo tài khoản và phân quyền cho nhân viên</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Các input tương tự */}
              {/* Họ tên */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" /> Họ tên
                </label>
                <Input
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onBlur={(e) => validateField("name", e.target.value)}
                  className={`h-10 border ${errors.name ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:ring-blue-500`}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" /> Email
                </label>
                <Input
                  placeholder="abc@company.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onBlur={(e) => validateField("email", e.target.value)}
                  className={`h-10 border ${errors.email ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:ring-blue-500`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* Mật khẩu */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" /> Mật khẩu
                </label>
                <Input
                  placeholder="Nhập mật khẩu"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onBlur={(e) => validateField("password", e.target.value)}
                  className={`h-10 border ${errors.password ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:ring-blue-500`}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              {/* Nhập lại mật khẩu */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" /> Nhập lại mật khẩu
                </label>
                <Input
                  placeholder="Nhập lại mật khẩu"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  onBlur={(e) => validateField("confirmPassword", e.target.value)}
                  className={`h-10 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:ring-blue-500`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>

              {/* Quyền */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" /> Phân quyền
                </label>
                <Select
                  value={form.role}
                  onValueChange={(value) => {
                    setForm({ ...form, role: value });
                    validateField("role", value);
                  }}
                >
                  <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Chọn quyền" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
              </div>

              {/* Hiển thị quyền được chọn */}
              {selectedRole && (
                <div className={`p-3 rounded-lg border-2 ${selectedRole.color}`}>
                  <p className="text-sm font-semibold">
                    Quyền được chọn: <span className="text-blue-700">{selectedRole.label}</span>
                  </p>
                </div>
              )}

              {/* Nút tạo */}
              <div className="flex gap-3 pt-6 border-t">
                <Button
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Tạo tài khoản
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
