
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

-- Bảng NHÀ CUNG CẤP (NCC)
CREATE TABLE IF NOT EXISTS suppliers (
  maNCC CHAR(20) PRIMARY KEY DEFAULT CONCAT('NCC', SUBSTRING(MD5(RANDOM()::text), 1, 7)),
  tenNCC VARCHAR(255) NOT NULL,
  diaChi VARCHAR(255),
  sdt VARCHAR(20)
);

-- Bảng NGUYÊN VẬT LIỆU (NVL)
CREATE TABLE IF NOT EXISTS raw_materials (
  maNVL CHAR(20) PRIMARY KEY DEFAULT CONCAT('NVL', SUBSTRING(MD5(RANDOM()::text), 1, 7)),
  tenNVL VARCHAR(255) NOT NULL,
  soLuong INT DEFAULT 0,
  donGia DECIMAL(15, 2) NOT NULL,
  ngayNhap TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  maNCC CHAR(20) REFERENCES suppliers(maNCC)
);

CREATE TABLE IF NOT EXISTS purchase_requests (
  maPhieuMuaNVL CHAR(20),
  maNVL CHAR(20) NOT NULL REFERENCES raw_materials(maNVL),
  quantity INT NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (maPhieuMuaNVL, maNVL)
);

-- Bảng PHIẾU NHẬP KHO NVL (warehouse_receipts)
CREATE TABLE IF NOT EXISTS warehouse_receipts (
  maPhieuNhapNVL CHAR(20) PRIMARY KEY,
  maPhieuMuaNVL CHAR(20) NOT NULL,
  maNVL CHAR(20) NOT NULL,
  ngayNhap TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (maPhieuMuaNVL, maNVL)
      REFERENCES purchase_requests(maPhieuMuaNVL, maNVL)
);


-- Create work assignments table
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

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  worker_id INT REFERENCES users(id),
  attendance_date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create QC defects table
CREATE TABLE IF NOT EXISTS qc_defects (
  id SERIAL PRIMARY KEY,
  defect_type VARCHAR(50) NOT NULL,
  product_id INT,
  material_id INT REFERENCES raw_materials(id),
  description TEXT,
  severity VARCHAR(20),
  qc_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (email, password, name, role) VALUES
('manager@company.com', 'password123', 'Nguyễn Văn A', 'manager'),
('director@company.com', 'password123', 'Trần Văn B', 'director'),
('supervisor@company.com', 'password123', 'Lê Văn C', 'supervisor'),
('warehouse@company.com', 'password123', 'Phạm Văn D', 'warehouse_raw'),
('qc@company.com', 'password123', 'Hoàng Văn E', 'qc');
