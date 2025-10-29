"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Hồ Sơ Cá Nhân</h1>
        <p className="text-muted-foreground mt-2">Quản lý thông tin cá nhân của bạn</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Cá Nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tên</label>
              <Input value={user?.name || ""} disabled className="mt-2" />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={user?.email || ""} disabled className="mt-2" />
            </div>

            <div>
              <label className="text-sm font-medium">Vai Trò</label>
              <Input value={user?.role || ""} disabled className="mt-2" />
            </div>

            <div>
              <label className="text-sm font-medium">ID Nhân Viên</label>
              <Input value={user?.id || ""} disabled className="mt-2" />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline">Hủy</Button>
            <Button className="bg-primary text-primary-foreground">Cập Nhật</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
