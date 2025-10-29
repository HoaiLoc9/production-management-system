"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { BarChart3, Package, Users, Warehouse, CheckCircle, FileText, LogOut, Menu, X } from "lucide-react"

<<<<<<< HEAD
=======
interface SubMenuItem {
  label: string
  href: string
  roles: string[]
}

>>>>>>> origin/thaibao-feature
interface MenuItem {
  label: string
  href: string
  icon: React.ComponentType<{ size: number }>
  roles: string[]
<<<<<<< HEAD
=======
  submenu?: SubMenuItem[]
>>>>>>> origin/thaibao-feature
}

const menuItems: MenuItem[] = [
  {
    label: "Thống Kê",
    href: "/dashboard/statistics",
    icon: BarChart3,
    roles: ["admin", "manager", "director"],
  },
  {
    label: "Kế Hoạch Sản Xuất",
    href: "/production-plan",
    icon: Package,
    roles: ["manager", "director"],
  },
  {
    label: "Phân Công & Chấm Công",
    href: "/work-assignment",
    icon: Users,
    roles: ["manager", "supervisor", "director"],
  },
  {
    label: "Kho NVL",
<<<<<<< HEAD
    href: "/warehouse/raw-materials/import",
    icon: Warehouse,
    roles: ["warehouse_raw", "manager", "director"],
=======
    href: "/warehouse/raw-materials",
    icon: Warehouse,
    roles: ["warehouse_raw", "manager", "director"],
    submenu: [
      {
        label: "Nhập kho",
        href: "/warehouse/raw-materials/import",
        roles: ["warehouse_raw", "manager", "director"],
      },
      {
        label: "Lập phiếu đề xuất mua",
        href: "/warehouse/raw-materials/request-purchase",
        roles: ["warehouse_raw", "manager", "director"],
      },
    ]
>>>>>>> origin/thaibao-feature
  },
  {
    label: "Kho Thành Phẩm",
    href: "/warehouse/products/import",
    icon: Package,
    roles: ["warehouse_product", "manager", "director"],
  },
  {
    label: "QC",
    href: "/qc/defect-product",
    icon: CheckCircle,
    roles: ["qc", "manager", "director"],
  },
  {
    label: "Phiếu & Yêu Cầu",
    href: "/requests/warehouse-request",
    icon: FileText,
    roles: ["manager", "supervisor", "director"],
  },
<<<<<<< HEAD
  // KPI menu for production manager
  {
    label: "Lập báo cáo KPI",
    href: "/statistics/kpi/create",
    icon: FileText,
    // Only production manager (Quản lý sản xuất) can create KPI reports
    roles: ["manager"],
  },
  // Supervisor (Xưởng trưởng) can create KPI draft (phiếu KPI)
  {
    label: "Tạo Phiếu KPI",
    href: "/statistics/kpi/drafts/create",
    icon: FileText,
    roles: ["supervisor"],
  },
  {
    label: "Duyệt Phiếu KPI",
    href: "/statistics/kpi/review",
    icon: CheckCircle,
    roles: ["manager", "director"],
  },
=======
>>>>>>> origin/thaibao-feature
  {
    label: "Phê Duyệt",
    href: "/approval/production-plan",
    icon: CheckCircle,
    roles: ["director"],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(true)

<<<<<<< HEAD
  const roleLabels: Record<string, string> = {
    admin: "Admin",
    director: "Giám đốc",
    manager: "Quản lý sản xuất",
    supervisor: "Xưởng trưởng",
    warehouse_raw: "Kho NVL",
    warehouse_product: "Kho Thành Phẩm",
    qc: "QC",
    worker: "Công nhân",
  }

=======
>>>>>>> origin/thaibao-feature
  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user?.role || ""))

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-primary-foreground rounded-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative w-64 h-screen bg-sidebar text-sidebar-foreground transition-transform duration-300 z-40 flex flex-col border-r border-sidebar-border`}
      >
<<<<<<< HEAD
        {/* Logo / User info */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-primary">Công ty An Phát</h1>
          <p className="text-sm font-medium mt-1">{user?.name ?? user?.email ?? "Khách"}</p>
          <p className="text-xs text-sidebar-foreground/60 mt-1">{user ? roleLabels[user.role] ?? user.role : "Chưa đăng nhập"}</p>
=======
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-primary">Công ty An Phát</h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">Quản Lý Sản Xuất</p>
>>>>>>> origin/thaibao-feature
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
<<<<<<< HEAD
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Button>
              </Link>
=======
            const hasSubmenu = item.submenu && item.submenu.length > 0
            
            return (
              <div key={item.href} className="space-y-1">
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Button>
                </Link>
                
                {hasSubmenu && (
                  <div className="ml-6 space-y-1">
                    {item.submenu?.map((subItem) => {
                      const isSubActive = pathname === subItem.href
                      return (
                        <Link key={subItem.href} href={subItem.href}>
                          <Button
                            variant={isSubActive ? "default" : "ghost"}
                            className={`w-full justify-start text-sm ${
                              isSubActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            }`}
                          >
                            {subItem.label}
                          </Button>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
>>>>>>> origin/thaibao-feature
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut size={18} />
            <span>Đăng Xuất</span>
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
