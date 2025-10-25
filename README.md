# Hệ Thống Quản Lý Sản Xuất Bàn Ghế

Một hệ thống quản lý sản xuất toàn diện cho công ty sản xuất bàn ghế, được xây dựng với Node.js, React.js, PostgreSQL và mô hình MVC.

## Tính Năng Chính

### 1. Xác Thực & Phân Quyền
- Đăng nhập/Đăng xuất
- Phân quyền theo vai trò (Role-based Access Control)
- 8 vai trò khác nhau: Admin, Director, Manager, Supervisor, Warehouse Raw, Warehouse Product, QC, Worker

### 2. Quản Lý Sản Xuất
- **Kế Hoạch Sản Xuất**: Tạo, sửa, xóa kế hoạch sản xuất
- **Phân Công Công Việc**: Phân công công việc cho công nhân
- **Chấm Công**: Ghi nhận thời gian vào/ra làm việc
- **Thống Kê & KPI**: Theo dõi hiệu suất sản xuất

### 3. Quản Lý Kho Hàng
- **Kho Nguyên Vật Liệu (NVL)**:
  - Nhập kho NVL
  - Xuất kho NVL
  - Yêu cầu mua NVL
- **Kho Thành Phẩm**:
  - Nhập kho thành phẩm
  - Xuất kho thành phẩm

### 4. Kiểm Soát Chất Lượng (QC)
- Ghi nhận lỗi sản phẩm
- Ghi nhận lỗi nguyên vật liệu
- Theo dõi tỷ lệ lỗi

### 5. Phê Duyệt & Yêu Cầu
- Phê duyệt kế hoạch sản xuất
- Phê duyệt kế hoạch mua hàng
- Quản lý phiếu yêu cầu kho

### 6. Dashboard & Báo Cáo
- Thống kê sản xuất
- Báo cáo KPI
- Thông báo hệ thống
- Hồ sơ cá nhân

## Cấu Trúc Dự Án

\`\`\`
├── app/
│   ├── api/                          # API Routes (Backend)
│   │   ├── auth/                     # Authentication
│   │   ├── production/               # Production Management
│   │   ├── warehouse/                # Warehouse Management
│   │   ├── qc/                       # Quality Control
│   │   └── attendance/               # Attendance
│   ├── dashboard/                    # Dashboard Pages
│   │   ├── statistics/               # Statistics
│   │   ├── profile/                  # User Profile
│   │   └── notifications/            # Notifications
│   ├── production-plan/              # Production Planning
│   ├── work-assignment/              # Work Assignment
│   ├── attendance/                   # Attendance
│   ├── warehouse/                    # Warehouse Management
│   │   ├── raw-materials/
│   │   └── products/
│   ├── qc/                           # Quality Control
│   ├── approval/                     # Approval System
│   ├── requests/                     # Requests
│   ├── statistics/                   # Statistics & KPI
│   ├── help/                         # Help & FAQ
│   ├── login/                        # Login Page
│   ├── layout.tsx                    # Root Layout
│   ├── page.tsx                      # Home Page
│   └── globals.css                   # Global Styles
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx               # Sidebar Navigation
│   │   └── header.tsx                # Header
│   └── ui/                           # UI Components
├── lib/
│   ├── auth-context.tsx              # Authentication Context
│   └── utils.ts                      # Utilities
├── scripts/
│   └── init-database.sql             # Database Initialization
└── package.json                      # Dependencies
\`\`\`

## Vai Trò & Quyền Hạn

| Vai Trò | Quyền Hạn |
|---------|-----------|
| **Admin** | Toàn quyền hệ thống |
| **Director** | Phê duyệt kế hoạch, xem thống kê |
| **Manager** | Quản lý sản xuất, kho hàng, nhân sự |
| **Supervisor** | Phân công công việc, chấm công |
| **Warehouse Raw** | Quản lý kho NVL |
| **Warehouse Product** | Quản lý kho thành phẩm |
| **QC** | Ghi nhận lỗi sản phẩm |
| **Worker** | Xem công việc được phân công |

## Tài Khoản Demo

\`\`\`
Manager:
Email: manager@company.com
Password: password123

Director:
Email: director@company.com
Password: password123

Supervisor:
Email: supervisor@company.com
Password: password123

Warehouse:
Email: warehouse@company.com
Password: password123

QC:
Email: qc@company.com
Password: password123
\`\`\`

## Công Nghệ Sử Dụng

- **Frontend**: React 19, Next.js 16, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Schema included)
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API

## Cài Đặt & Chạy

### 1. Clone Repository
\`\`\`bash
git clone <repository-url>
cd manufacturing-system
\`\`\`

### 2. Cài Đặt Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Cấu Hình Database
- Tạo database PostgreSQL
- Chạy script `scripts/init-database.sql` để tạo tables

### 4. Chạy Development Server
\`\`\`bash
npm run dev
\`\`\`

### 5. Truy Cập Ứng Dụng
\`\`\`
http://localhost:3000
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập

### Production Management
- `GET /api/production/plans` - Lấy danh sách kế hoạch
- `POST /api/production/plans` - Tạo kế hoạch mới

### Warehouse Management
- `GET /api/warehouse/materials` - Lấy danh sách nguyên vật liệu
- `POST /api/warehouse/materials` - Thêm nguyên vật liệu
- `GET /api/warehouse/transactions` - Lấy danh sách giao dịch
- `POST /api/warehouse/transactions` - Tạo giao dịch mới

### Quality Control
- `GET /api/qc/defects` - Lấy danh sách lỗi
- `POST /api/qc/defects` - Ghi nhận lỗi mới

### Attendance
- `GET /api/attendance` - Lấy danh sách chấm công
- `POST /api/attendance` - Ghi chấm công mới

### Approval
- `GET /api/approval` - Lấy danh sách chờ phê duyệt
- `POST /api/approval` - Phê duyệt/Từ chối

## Hướng Phát Triển Tiếp Theo

1. **Kết Nối Database Thực**: Thay thế mock data bằng PostgreSQL
2. **Authentication JWT**: Implement JWT tokens
3. **Export Reports**: Xuất báo cáo PDF/Excel
4. **Real-time Notifications**: WebSocket cho thông báo real-time
5. **Mobile App**: React Native app
6. **Advanced Analytics**: Dashboard analytics nâng cao
7. **Integration**: Tích hợp với hệ thống ERP khác

## Hỗ Trợ

Để được hỗ trợ, vui lòng liên hệ:
- Email: support@company.com
- Điện thoại: +84 (0) 123 456 789
- Giờ làm việc: Thứ 2 - Thứ 6: 8:00 - 17:00

## License

MIT License - Xem file LICENSE để chi tiết
