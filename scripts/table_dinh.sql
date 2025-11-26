-- ===============================
-- 1. NHÀ CUNG CẤP 
-- ===============================
CREATE TABLE suppliers (
  maNCC SERIAL PRIMARY KEY,
  tenNCC VARCHAR(255) NOT NULL,
  diaChi VARCHAR(255) NOT NULL,
  sdt VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 2. NGUYÊN VẬT LIỆU 
-- ===============================
CREATE TABLE raw_materials (
  maNVL SERIAL PRIMARY KEY,
  tenNVL VARCHAR(255) NOT NULL,
  donVi VARCHAR(20) NOT NULL,
  soLuong INT DEFAULT 0 CHECK (soLuong >= 0),
  donGia DECIMAL(15,2) NOT NULL,
  maNCC INT REFERENCES suppliers(maNCC) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function chung để cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger cho suppliers
CREATE TRIGGER trg_suppliers_updated_at
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger cho raw_materials
CREATE TRIGGER trg_raw_materials_updated_at
BEFORE UPDATE ON raw_materials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ===============================
-- 3. PHIẾU MUA
-- ===============================
CREATE TABLE purchase_requests (
  maPhieuMuaNVL SERIAL PRIMARY KEY,
  trangThai VARCHAR(20) DEFAULT 'pending' CHECK (trangThai IN ('pending','imported')),
  ngayLap TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ===============================
-- 3.1. CHI TIẾT PHIẾU MUA NVL
-- ===============================
CREATE TABLE purchase_request_details (
  id SERIAL PRIMARY KEY,
  maPhieuMuaNVL INT REFERENCES purchase_requests(maPhieuMuaNVL) ON DELETE CASCADE,
  soLuongYC INT NOT NULL CHECK (soLuongYC > 0),
  donGia DECIMAL(15,2),
  maNVL INT REFERENCES raw_materials(maNVL) ON DELETE CASCADE
);


-- ===============================
-- 4. PHIẾU NHẬP KHO 
-- ===============================
CREATE TABLE warehouse_receipts (
  maPhieuNhapNVL SERIAL PRIMARY KEY,
  maPhieuMuaNVL INT UNIQUE REFERENCES purchase_requests(maPhieuMuaNVL) ON DELETE CASCADE,
  ngayNhap TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 5. WORKSHOPS
-- ===============================
CREATE TABLE IF NOT EXISTS workshops (
  maXuong SERIAL PRIMARY KEY,
  tenXuong VARCHAR(255) NOT NULL,
  sdt VARCHAR(20),
  diaChi VARCHAR(255),
  maTruongXuong INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger cập nhật updated_at tự động khi UPDATE
CREATE TRIGGER trg_workshops_updated_at
BEFORE UPDATE ON workshops
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ===============================
-- 6. PRODUCTS
-- ===============================
CREATE TABLE IF NOT EXISTS products (
  maSP SERIAL PRIMARY KEY,
  tenSP VARCHAR(255) NOT NULL,
  moTa TEXT,
  gia DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ===============================
-- 7. CUSTOMERS
-- ===============================
CREATE TABLE IF NOT EXISTS customers (
  maKH SERIAL PRIMARY KEY,
  tenKH VARCHAR(255) NOT NULL,
  diaChi VARCHAR(255),
  sdt VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ===============================
-- 8. ORDERS
-- ===============================
CREATE TABLE IF NOT EXISTS orders (
  maDH SERIAL PRIMARY KEY,
  maKH INT REFERENCES customers(maKH) ON DELETE CASCADE,
  ngayDat DATE DEFAULT CURRENT_DATE,
  trangThai VARCHAR(50) DEFAULT 'pending'
            CHECK (trangThai IN ('pending','completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger cập nhật updated_at cho orders
CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ===============================
-- 8.1 ORDER_DETAILS
-- ===============================
CREATE TABLE IF NOT EXISTS order_details (
    id SERIAL PRIMARY KEY,
    maDH INT REFERENCES orders(maDH) ON DELETE CASCADE,
    maSP INT REFERENCES products(maSP) ON DELETE CASCADE,
    soLuong INT NOT NULL CHECK (soLuong > 0),
    donGia DECIMAL(15,2) NOT NULL CHECK (donGia > 0),
    tienCoc DECIMAL(15,2) DEFAULT 0 CHECK (tienCoc > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger cập nhật updated_at cho order_details
CREATE TRIGGER trg_order_details_updated_at
BEFORE UPDATE ON order_details
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();


-- ===============================
-- 9. PRODUCTION PLANS
-- ===============================
CREATE TABLE IF NOT EXISTS production_plans (
  plan_code SERIAL PRIMARY KEY,
  maDH INT REFERENCES orders(maDH) ON DELETE CASCADE,
  maNVL INT REFERENCES raw_materials(maNVL) ON DELETE CASCADE,
  maXuong INT REFERENCES workshops(maXuong) ON DELETE SET NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) CHECK (status IN ('pending','running','completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_production_plans_updated_at
BEFORE UPDATE ON production_plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ===============================
-- 10. PHIẾU GIAO THÀNH PHẨM 
-- ===============================
CREATE TABLE IF NOT EXISTS delivery_notes (
  maPhieuGiao SERIAL PRIMARY KEY,
  plan_code INT REFERENCES production_plans(plan_code) ON DELETE CASCADE,
  ngayGiao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger cập nhật updated_at
CREATE TRIGGER trg_delivery_notes_updated_at
BEFORE UPDATE ON delivery_notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ===============================
-- 11. Phân công công việc
-- ===============================
CREATE TABLE IF NOT EXISTS work_assignments (
  id SERIAL PRIMARY KEY,
  production_plan_id INT REFERENCES production_plans(plan_code),
  worker_id INT REFERENCES users(id),
  task_description TEXT,
  assigned_date DATE,
  work_shift VARCHAR(50) DEFAULT 'Ca 1 (07:00-15:00)',
  status VARCHAR(50) DEFAULT 'pending',
  progress INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger cập nhật updated_at cho work_assignments
CREATE TRIGGER trg_work_assignments_updated_at
BEFORE UPDATE ON work_assignments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
