import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"
<<<<<<< HEAD
<<<<<<< HEAD
import { Toaster } from "@/components/ui/toaster"
=======
>>>>>>> origin/thaibao-feature
=======
>>>>>>> origin/PhanHongLieu

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hệ Thống Quản Lý Sản Xuất Bàn Ghế",
  description: "Manufacturing Management System",
<<<<<<< HEAD
<<<<<<< HEAD
  generator: "Le Tran Hoai Loc",
=======
  generator: "v0.app",
>>>>>>> origin/thaibao-feature
=======
  generator: "v0.app",
>>>>>>> origin/PhanHongLieu
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {children}
<<<<<<< HEAD
<<<<<<< HEAD
          <Toaster />
=======
>>>>>>> origin/thaibao-feature
=======
>>>>>>> origin/PhanHongLieu
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
