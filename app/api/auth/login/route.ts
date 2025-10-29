import { type NextRequest, NextResponse } from "next/server"

const mockUsers = [
  {
    id: "1",
    email: "director@company.com",
    password: "password123",
    name: "Trần Văn B",
    role: "director",
    department: "Ban Giám Đốc",
  },
  {
    id: "2",
    email: "manager@company.com",
    password: "password123",
    name: "Nguyễn Văn A",
    role: "manager",
    department: "Quản Lý Sản Xuất",
  },
  {
    id: "3",
    email: "supervisor@company.com",
    password: "password123",
    name: "Lê Văn C",
    role: "supervisor",
    department: "Xưởng Trưởng",
  },
  {
    id: "4",
    email: "warehouse.raw@company.com",
    password: "password123",
    name: "Phạm Thị D",
    role: "warehouse_raw",
    department: "Kho NVL",
  },
  {
    id: "5",
    email: "warehouse.product@company.com",
    password: "password123",
    name: "Hoàng Văn E",
    role: "warehouse_product",
    department: "Kho Thành Phẩm",
  },
  {
    id: "6",
    email: "qc@company.com",
    password: "password123",
    name: "Vũ Thị F",
    role: "qc",
    department: "QC",
  },
  {
    id: "7",
    email: "worker@company.com",
    password: "password123",
    name: "Đặng Văn G",
    role: "worker",
    department: "Công Nhân",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Email hoặc mật khẩu không chính xác" }, { status: 401 })
    }

    // Generate mock JWT token
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString("base64")

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 })
  }
}
