
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await login(email, password)
      router.push("/dashboard/statistics")
    } catch (err: any) {
      setError("Email hoặc mật khẩu không đúng")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="pt-10 pb-6 text-center">
          <div className="mx-auto w-16 h-16 bg-[#0066FF] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Đăng Nhập</h1>
          <p className="text-sm text-gray-600 mt-1">Hệ Thống Quản Lý Sản Xuất Bàn Ghế</p>
        </div>

        {/* FORM */}
        <div className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="your@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-gray-300 focus:border-[#0066FF] focus:ring-[#0066FF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Mật Khẩu</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl border-gray-300 focus:border-[#0066FF] focus:ring-[#0066FF]"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm text-center font-medium">
                {error}
              </div>
            )}

            {/* NÚT ĐĂNG NHẬP – MÀU XANH "NHẬP KHO" CHUẨN 100% */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-lg font-bold text-white rounded-xl shadow-lg"
              style={{ backgroundColor: "#0066FF" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0055EE"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0066FF"}
            >
              {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </Button>

            
          </form>
        </div>
      </div>
    </div>
  )
}