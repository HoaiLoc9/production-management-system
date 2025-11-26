"use client"

import { useState } from "react"
import { Bell, User, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import UserInfoModal from "@/components/layout/user_infor"

interface WarehouseHeaderProps {
  title?: string | null
}

export default function WarehouseHeader({ title = null }: WarehouseHeaderProps) {
  const { user } = useAuth()
  const [showUserInfo, setShowUserInfo] = useState(false)

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          {/* Nếu title null thì không hiển thị gì */}
          {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <Bell size={20} className="text-gray-600" />
          </Button>

          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <Settings size={20} className="text-gray-600" />
          </Button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.name ?? user?.email ?? "Người dùng"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role ?? ""}
              </p>
            </div>
            <button
              onClick={() => setShowUserInfo(!showUserInfo)}
              className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center transition-colors hover:text-white"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#396fc8")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
            >
              <User size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Modal thông tin user */}
      <UserInfoModal isOpen={showUserInfo} onClose={() => setShowUserInfo(false)} />
    </>
  )
}
