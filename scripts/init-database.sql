-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create production plans table
CREATE TABLE IF NOT EXISTS production_plans (
  id SERIAL PRIMARY KEY,
  plan_code VARCHAR(50) UNIQUE NOT NULL,
  product_type VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  maNCC CHAR(20) PRIMARY KEY DEFAULT CONCAT('NCC', SUBSTRING(MD5(RANDOM()::text), 1, 7)),
  tenNCC VARCHAR(255) NOT NULL,
  diaChi VARCHAR(255),
  sdt VARCHAR(20)
);

-- Raw materials table
CREATE TABLE IF NOT EXISTS raw_materials (
  maNVL CHAR(20) PRIMARY KEY DEFAULT CONCAT('NVL', SUBSTRING(MD5(RANDOM()::text), 1, 7)),
  tenNVL VARCHAR(255) NOT NULL,
  soLuong INT DEFAULT 0,
  donGia DECIMAL(15,2) NOT NULL,
  ngayNhap TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  maNCC CHAR(20) REFERENCES suppliers(maNCC)
);

-- Purchase requests
CREATE TABLE IF NOT EXISTS purchase_requests (
  maPhieuMuaNVL CHAR(20),
  maNVL CHAR(20) NOT NULL REFERENCES raw_materials(maNVL),
  quantity INT NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (maPhieuMuaNVL, maNVL)
);

-- Warehouse receipts
CREATE TABLE IF NOT EXISTS warehouse_receipts (
  maPhieuNhapNVL CHAR(20) PRIMARY KEY,
  maPhieuMuaNVL CHAR(20) NOT NULL,
  maNVL CHAR(20) NOT NULL,
  ngayNhap TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (maPhieuMuaNVL, maNVL)
      REFERENCES purchase_requests(maPhieuMuaNVL, maNVL)
);

-- Warehouse transactions
CREATE TABLE IF NOT EXISTS warehouse_transactions (
  id SERIAL PRIMARY KEY,
  transaction_type VARCHAR(20) NOT NULL,
  material_maNVL CHAR(20) REFERENCES raw_materials(maNVL),
  quantity INT NOT NULL,
  supplier VARCHAR(255),
  notes TEXT,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work assignments
CREATE TABLE IF NOT EXISTS work_assignments (
  id SERIAL PRIMARY KEY,
  production_plan_id INT REFERENCES production_plans(id),
  worker_id INT REFERENCES users(id),
  task_description TEXT,
  assigned_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  worker_id INT REFERENCES users(id),
  attendance_date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- QC defects
CREATE TABLE IF NOT EXISTS qc_defects (
  id SERIAL PRIMARY KEY,
  defect_type VARCHAR(50) NOT NULL,
  product_id INT,
  material_maNVL CHAR(20) REFERENCES raw_materials(maNVL),
  description TEXT,
  severity VARCHAR(20),
  qc_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample users
INSERT INTO users (email, password, name, role) VALUES
('manager@company.com', 'password123', 'Nguyễn Văn A', 'manager'),
('director@company.com', 'password123', 'Trần Văn B', 'director'),
('supervisor@company.com', 'password123', 'Lê Văn C', 'supervisor'),
('warehouse@company.com', 'password123', 'Phạm Văn D', 'warehouse_raw'),
('qc@company.com', 'password123', 'Hoàng Văn E', 'qc');

-- Create order list table
CREATE TABLE IF NOT EXISTS donhang (
    id SERIAL PRIMARY KEY,
    ma_don_hang VARCHAR(20) NOT NULL UNIQUE,
    ten_khach_hang VARCHAR(255) NOT NULL,
    san_pham VARCHAR(255) NOT NULL,
    so_luong INT NOT NULL,
    ngay_giao DATE NOT NULL,
    trang_thai VARCHAR(100) NOT NULL
);

INSERT INTO donhang (ma_don_hang, ten_khach_hang, san_pham, so_luong, ngay_giao, trang_thai)
VALUES
('DH001', 'Công ty Minh Tâm', 'Ghế gỗ cao cấp', 150, '2025-11-15', 'Đang lên kế hoạch'),
('DH002', 'Cửa hàng Nội thất Việt', 'Bàn gỗ sồi', 80, '2025-11-20', 'Chưa lên kế hoạch'),
('DH003', 'Doanh nghiệp Tân Phát', 'Tủ gỗ sồi', 40, '2025-12-05', 'Đang xử lý'),
('DH004', 'Công ty Đại Lộc', 'Bàn làm việc gỗ', 100, '2025-12-10', 'Chờ duyệt'),
('DH005', 'Showroom Phúc Gia', 'Tủ gỗ công nghiệp', 75, '2025-12-25', 'Đang lên kế hoạch');