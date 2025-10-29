import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"
<<<<<<< HEAD
import { Toaster } from "@/components/ui/toaster"
=======
>>>>>>> origin/thaibao-feature

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hệ Thống Quản Lý Sản Xuất Bàn Ghế",
  description: "Manufacturing Management System",
<<<<<<< HEAD
  generator: "Le Tran Hoai Loc",
=======
  generator: "v0.app",
>>>>>>> origin/thaibao-feature
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
          <Toaster />
=======
>>>>>>> origin/thaibao-feature
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
