"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại")
    } finally {
      setLoading(false)
    }
  }

  const demoAccounts = [
    { email: "director@company.com", name: "Ban Giám Đốc", role: "director" },
    { email: "manager@company.com", name: "Quản Lý Sản Xuất", role: "manager" },
    { email: "supervisor@company.com", name: "Xưởng Trưởng", role: "supervisor" },
    { email: "warehouse.raw@company.com", name: "Kho NVL", role: "warehouse_raw" },
    { email: "warehouse.product@company.com", name: "Kho Thành Phẩm", role: "warehouse_product" },
    { email: "qc@company.com", name: "QC", role: "qc" },
    { email: "worker@company.com", name: "Công Nhân", role: "worker" },
  ]

  const handleQuickLogin = async (accountEmail: string) => {
    setLoading(true)
    setError("")
    try {
      await login(accountEmail, "password123")
      router.push("/dashboard/statistics")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Đăng Nhập</CardTitle>
            <CardDescription>Hệ Thống Quản Lý Sản Xuất Bàn Ghế</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Mật Khẩu</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tài Khoản Demo (7 Vai Trò)</CardTitle>
            <CardDescription>Nhấp vào một tài khoản để đăng nhập nhanh</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleQuickLogin(account.email)}
                  disabled={loading}
                  className="p-3 text-left border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <div className="font-medium text-sm">{account.name}</div>
                  <div className="text-xs text-muted-foreground">{account.email}</div>
                  <div className="text-xs text-primary mt-1">password123</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
