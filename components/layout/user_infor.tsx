// components/layout/user-info-modal.tsx
"use client"

import { X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface UserInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserInfoModal({ isOpen, onClose }: UserInfoModalProps) {
  const { user, logout } = useAuth()

  const roleLabels: Record<string, string> = {
    warehouse_raw: "Nhân Viên Kho NVL",
    manager: "Quản lý sản xuất",
    director: "Giám đốc",
    admin: "Admin",
    supervisor: "Xưởng trưởng",
    warehouse_product: "Nhân Viên Kho Thành Phẩm",
    qc: "QC",
    worker: "Công nhân",
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-20 right-8 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">Thông tin tài khoản</h3>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: '#396fc8' }}
            >
              {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U"}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">ID</p>
              <p className="text-sm font-medium text-gray-900">{user?.id ?? "N/A"}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Tên</p>
              <p className="text-sm font-medium text-gray-900">{user?.name ?? "N/A"}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm font-medium text-gray-900">{user?.email ?? "N/A"}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Chức vụ</p>
              <p className="text-sm font-medium text-gray-900">
                {user ? roleLabels[user.role] ?? user.role : "N/A"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition-colors mt-4"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </>
  )
}