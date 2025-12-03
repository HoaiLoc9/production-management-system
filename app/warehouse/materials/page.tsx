"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Package, Plus, Download, Upload } from "lucide-react"

export default function MaterialsPage() {
  const router = useRouter()

  const actions = [
    {
      title: "Nhập nguyên vật liệu",
      description: "Ghi nhận nhập kho nguyên vật liệu từ nhà cung cấp",
      icon: Upload,
      href: "/warehouse/materials/import",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
    },
    {
      title: "Xuất nguyên vật liệu",
      description: "Ghi nhận xuất kho nguyên vật liệu cho sản xuất",
      icon: Download,
      href: "/warehouse/materials/export",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
    },
    {
      title: "Lập phiếu mua NVL",
      description: "Tạo phiếu đề xuất mua nguyên vật liệu hết hàng",
      icon: Plus,
      href: "/warehouse/materials/purchase",
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-700",
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Quản lý Nguyên Vật Liệu</h1>
        <p className="text-gray-600">Quản lý kho nguyên vật liệu, nhập xuất, và tạo phiếu mua</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Card
              key={action.href}
              className={`${action.color} border-2 p-6 cursor-pointer hover:shadow-lg transition-shadow`}
              onClick={() => router.push(action.href)}
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className={`${action.textColor} w-8 h-8`} />
                <Package className={`${action.textColor} w-5 h-5 opacity-20`} />
              </div>
              <h3 className={`${action.textColor} text-lg font-semibold mb-2`}>{action.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{action.description}</p>
              <Button variant="outline" className="w-full" onClick={(e) => {
                e.stopPropagation()
                router.push(action.href)
              }}>
                Đi tới
              </Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
