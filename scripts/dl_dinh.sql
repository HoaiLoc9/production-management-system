SET client_encoding = 'UTF8';
-- ===============================
-- 1. NHÀ CUNG CẤP
-- ===============================
INSERT INTO suppliers (tenNCC, diaChi, sdt, email)
VALUES
  ('Công ty TNHH Vật Liệu A', '123 Đường A, TP.HCM', '0909123456', 'nccA@example.com'),
  ('Công ty TNHH Vật Liệu B', '456 Đường B, TP.HCM', '0912345678', 'nccB@example.com'),
  ('Công ty TNHH Vật Liệu C', '789 Đường C, Đà Nẵng', '0987654321', 'nccC@example.com');

-- ===============================
-- 2. NGUYÊN VẬT LIỆU
-- ===============================
INSERT INTO raw_materials (tenNVL, donVi, soLuong, donGia, maNCC)
VALUES
  ('Gỗ sồi', 'kg', 1000, 150000, (SELECT maNCC FROM suppliers WHERE tenNCC='Công ty TNHH Vật Liệu A')),
  ('Gỗ tự nhiên', 'kg', 800, 210000, (SELECT maNCC FROM suppliers WHERE tenNCC='Công ty TNHH Vật Liệu A')),
  ('Gỗ hương', 'kg', 600, 200000, (SELECT maNCC FROM suppliers WHERE tenNCC='Công ty TNHH Vật Liệu A')),
  ('Gỗ lim', 'kg', 400, 250000, (SELECT maNCC FROM suppliers WHERE tenNCC='Công ty TNHH Vật Liệu A')),
  ('Ốc vít', 'hộp', 500, 50000, (SELECT maNCC FROM suppliers WHERE tenNCC='Công ty TNHH Vật Liệu B')),
  ('Bu lông', 'hộp', 300, 60000, (SELECT maNCC FROM suppliers WHERE tenNCC='Công ty TNHH Vật Liệu B')),
  ('Keo dán gỗ', 'chai', 200, 120000, (SELECT maNCC FROM suppliers WHERE tenNCC='Công ty TNHH Vật Liệu B')),
  ('Vam kẹp', 'chai', 150, 90000, (SELECT maNCC FROM suppliers WHERE tenNCC='Công ty TNHH Vật Liệu B')),
  ('Sơn nước', 'lít', 100, 80000, (SELECT maNCC FROM suppliers WHERE tenNCC='Công ty TNHH Vật Liệu C')),
  ('Đệm ghế', 'cái', 300, 100000, (SELECT maNCC FROM suppliers WHERE tenNCC='Công ty TNHH Vật Liệu C'));

-- ===============================
-- 3. PHIẾU MUA
-- ===============================
INSERT INTO purchase_requests (trangThai)
VALUES
  ('pending'),
  ('pending'),
  ('pending');

-- ===============================
-- 3.1. CHI TIẾT PHIẾU MUA NVL
-- ===============================
-- Phiếu mua 1: Gỗ sồi, Ốc vít
INSERT INTO purchase_request_details (maPhieuMuaNVL, maNVL, soLuongYC, donGia)
VALUES
  ((SELECT maPhieuMuaNVL FROM purchase_requests ORDER BY ngayLap LIMIT 1),
   (SELECT maNVL FROM raw_materials WHERE tenNVL='Gỗ sồi' LIMIT 1), 50, 150000),
  ((SELECT maPhieuMuaNVL FROM purchase_requests ORDER BY ngayLap LIMIT 1),
   (SELECT maNVL FROM raw_materials WHERE tenNVL='Ốc vít' LIMIT 1), 20, 50000);

-- Phiếu mua 2: Gỗ tự nhiên
INSERT INTO purchase_request_details (maPhieuMuaNVL, maNVL, soLuongYC, donGia)
VALUES
  ((SELECT maPhieuMuaNVL FROM purchase_requests ORDER BY ngayLap OFFSET 1 LIMIT 1),
   (SELECT maNVL FROM raw_materials WHERE tenNVL='Gỗ tự nhiên' LIMIT 1), 50, 200000);

-- Phiếu mua 3: Gỗ sồi, Gỗ lim, Đệm ghế, Sơn nước
INSERT INTO purchase_request_details (maPhieuMuaNVL, maNVL, soLuongYC, donGia)
VALUES
  ((SELECT maPhieuMuaNVL FROM purchase_requests ORDER BY ngayLap OFFSET 2 LIMIT 1),
   (SELECT maNVL FROM raw_materials WHERE tenNVL='Gỗ sồi' LIMIT 1), 40, 150000),
  ((SELECT maPhieuMuaNVL FROM purchase_requests ORDER BY ngayLap OFFSET 2 LIMIT 1),
   (SELECT maNVL FROM raw_materials WHERE tenNVL='Gỗ lim' LIMIT 1), 25, 250000),
  ((SELECT maPhieuMuaNVL FROM purchase_requests ORDER BY ngayLap OFFSET 2 LIMIT 1),
   (SELECT maNVL FROM raw_materials WHERE tenNVL='Đệm ghế' LIMIT 1), 15, 100000),
  ((SELECT maPhieuMuaNVL FROM purchase_requests ORDER BY ngayLap OFFSET 2 LIMIT 1),
   (SELECT maNVL FROM raw_materials WHERE tenNVL='Sơn nước' LIMIT 1), 10, 80000);

-- ===============================
-- 5. WORKSHOPS
-- ===============================
INSERT INTO workshops (tenXuong, sdt, diaChi, matruongxuong)
VALUES
  ('Xưởng A', '0909111222', '123 Đường A, TP.HCM', (SELECT id FROM users WHERE email='supervisorA@company.com')),
  ('Xưởng B', '0909333444', '456 Đường B, TP.HCM', (SELECT id FROM users WHERE email='supervisorB@company.com')),
  ('Xưởng C', '0909555666', '789 Đường C, TP.HCM', (SELECT id FROM users WHERE email='supervisorC@company.com')),
  ('Xưởng D', '0909777888', '101 Đường D, TP.HCM', (SELECT id FROM users WHERE email='supervisorD@company.com'));

-- ===============================
-- 6. PRODUCTS
-- ===============================
INSERT INTO products (tenSP, moTa, gia)
VALUES
  ('Bàn Gỗ Sồi', 'Bàn làm từ gỗ sồi', 20000000),
  ('Ghế Gỗ Sồi', 'Ghế làm từ gỗ sồi cao cấp', 1000000),
  ('Bàn Gỗ Tự Nhiên', 'Bàn làm từ gỗ tự nhiên', 28000000),
  ('Ghế Gỗ Tự Nhiên', 'Ghế làm từ gỗ tự nhiên', 1300000),
  ('Bàn Gỗ Lim', 'Ghế gỗ lim cao cấp', 30000000),
  ('Ghế Gỗ Lim', 'Ghế làm từ gỗ lim cao cấp', 1800000),
  ('Bàn Gỗ Hương', 'Bàn làm từ gỗ hương cao cấp', 40000000),
  ('Ghế Gỗ Hương', 'Ghế làm từ gỗ hương cao cấp', 2600000);

-- ===============================
-- 7. CUSTOMERS
-- ===============================
INSERT INTO customers (tenKH, diaChi, sdt, email)
VALUES
  ('Phạm Minh X', '12 Đường X, TP.HCM', '0911222333', 'pmx@gmail.com'),
  ('Trần Thị Ngọc L', '34 Đường Y, TP.HCM', '0922333444', 'ttnl@gmail.com'),
  ('Lê Đức M', '56 Đường Z, TP.HCM', '0933444555', 'ldm@gmail.com'),
  ('Vũ Thị G', '78 Đường W, TP.HCM', '0944555666', 'vtg@gmail.com');

-- ===============================
-- 8. ORDERS
-- ===============================
INSERT INTO orders (maKH, ngayDat, trangThai)
VALUES
  ((SELECT maKH FROM customers WHERE tenKH='Trần Thị Ngọc L'), '2025-11-20', 'pending'),
  ((SELECT maKH FROM customers WHERE tenKH='Lê Đức M'), '2025-10-25', 'completed'),
  ((SELECT maKH FROM customers WHERE tenKH='Vũ Thị G'), '2025-11-01', 'completed'),
  ((SELECT maKH FROM customers WHERE tenKH='Phạm Minh X'), '2025-10-29', 'completed'),
  ((SELECT maKH FROM customers WHERE tenKH='Trần Thị Ngọc L'), '2025-10-21', 'completed');

-- ===============================
-- 8.1. ORDER_DETAILS
-- ===============================
-- Order 1: Phạm Minh X
INSERT INTO order_details (maDH, maSP, soLuong, donGia, tienCoc)
VALUES
(
  (SELECT maDH FROM orders WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Phạm Minh X') AND ngayDat='2025-10-29'),
  (SELECT maSP FROM products WHERE tenSP='Ghế Gỗ Sồi'),
  10,
  (SELECT gia FROM products WHERE tenSP='Ghế Gỗ Sồi'),
  (SELECT gia * 10 * 0.5 FROM products WHERE tenSP='Ghế Gỗ Sồi')
),
(
  (SELECT maDH FROM orders WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Phạm Minh X') AND ngayDat='2025-10-29'),
  (SELECT maSP FROM products WHERE tenSP='Bàn Gỗ Sồi'),
  2,
  (SELECT gia FROM products WHERE tenSP='Bàn Gỗ Sồi'),
  (SELECT gia * 2 * 0.5 FROM products WHERE tenSP='Bàn Gỗ Sồi')
);

-- Order 2: Trần Thị Ngọc L
INSERT INTO order_details (maDH, maSP, soLuong, donGia, tienCoc)
VALUES
(
  (SELECT maDH FROM orders WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Trần Thị Ngọc L') AND ngayDat='2025-11-20'),
  (SELECT maSP FROM products WHERE tenSP='Bàn Gỗ Tự Nhiên'),
  5,
  (SELECT gia FROM products WHERE tenSP='Bàn Gỗ Tự Nhiên'),
  (SELECT gia * 5 * 0.5 FROM products WHERE tenSP='Bàn Gỗ Tự Nhiên')
),
(
  (SELECT maDH FROM orders WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Trần Thị Ngọc L') AND ngayDat='2025-11-20'),
  (SELECT maSP FROM products WHERE tenSP='Ghế Gỗ Tự Nhiên'),
  3,
  (SELECT gia FROM products WHERE tenSP='Ghế Gỗ Tự Nhiên'),
  (SELECT gia * 3 * 0.5 FROM products WHERE tenSP='Ghế Gỗ Tự Nhiên')
);

-- Order 3: Lê Đức M
INSERT INTO order_details (maDH, maSP, soLuong, donGia, tienCoc)
VALUES
(
  (SELECT maDH FROM orders WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Lê Đức M') AND ngayDat='2025-10-25'),
  (SELECT maSP FROM products WHERE tenSP='Ghế Gỗ Lim'),
  15,
  (SELECT gia FROM products WHERE tenSP='Ghế Gỗ Lim'),
  (SELECT gia * 15 * 0.5 FROM products WHERE tenSP='Ghế Gỗ Lim')
),
(
  (SELECT maDH FROM orders WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Lê Đức M') AND ngayDat='2025-10-25'),
  (SELECT maSP FROM products WHERE tenSP='Bàn Gỗ Lim'),
  5,
  (SELECT gia FROM products WHERE tenSP='Bàn Gỗ Lim'),
  (SELECT gia * 5 * 0.5 FROM products WHERE tenSP='Bàn Gỗ Lim')
);

-- Order 4: Vũ Thị G
INSERT INTO order_details (maDH, maSP, soLuong, donGia, tienCoc)
VALUES
(
  (SELECT maDH FROM orders WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Vũ Thị G') AND ngayDat='2025-11-01'),
  (SELECT maSP FROM products WHERE tenSP='Bàn Gỗ Hương'),
  7,
  (SELECT gia FROM products WHERE tenSP='Bàn Gỗ Hương'),
  (SELECT gia * 7 * 0.5 FROM products WHERE tenSP='Bàn Gỗ Hương')
),
(
  (SELECT maDH FROM orders WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Vũ Thị G') AND ngayDat='2025-11-01'),
  (SELECT maSP FROM products WHERE tenSP='Ghế Gỗ Hương'),
  2,
  (SELECT gia FROM products WHERE tenSP='Ghế Gỗ Hương'),
  (SELECT gia * 2 * 0.5 FROM products WHERE tenSP='Ghế Gỗ Hương')
);

-- ===============================
-- 9. PRODUCTION PLANS 
-- ===============================
-- Order 1: Phạm Minh X → Xưởng A
INSERT INTO production_plans (maDH, maNVL, maXuong, quantity, start_date, end_date, status)
VALUES
(
  (SELECT maDH FROM orders 
   WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Phạm Minh X') 
     AND ngayDat='2025-10-29'),
  (SELECT maNVL FROM raw_materials WHERE tenNVL='Gỗ sồi' LIMIT 1),
  (SELECT maXuong FROM workshops WHERE tenXuong='Xưởng A' LIMIT 1),
  COALESCE((SELECT SUM(soLuong) 
   FROM order_details 
   WHERE maDH=(SELECT maDH FROM orders 
               WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Phạm Minh X') 
                 AND ngayDat='2025-10-29')), 0),
  '2025-11-03',
  '2026-01-20',
  'running'
);

-- Order 2: Trần Thị Ngọc L → Xưởng B
INSERT INTO production_plans (maDH, maNVL, maXuong, quantity, start_date, end_date, status)
VALUES
(
  (SELECT maDH FROM orders 
   WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Trần Thị Ngọc L') 
     AND ngayDat='2025-11-20'),
  (SELECT maNVL FROM raw_materials WHERE tenNVL='Gỗ tự nhiên' LIMIT 1),
  (SELECT maXuong FROM workshops WHERE tenXuong='Xưởng B' LIMIT 1),
  COALESCE((SELECT SUM(soLuong) 
   FROM order_details 
   WHERE maDH=(SELECT maDH FROM orders 
               WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Trần Thị Ngọc L') 
                 AND ngayDat='2025-11-20')), 0),
  '2025-11-25',
  '2026-01-08',
  'running'
);

-- Order 3: Lê Đức M → Xưởng C
INSERT INTO production_plans (maDH, maNVL, maXuong, quantity, start_date, end_date, status)
VALUES
(
  (SELECT maDH FROM orders 
   WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Lê Đức M') 
     AND ngayDat='2025-10-25'),
  (SELECT maNVL FROM raw_materials WHERE tenNVL='Gỗ lim' LIMIT 1),
  (SELECT maXuong FROM workshops WHERE tenXuong='Xưởng C' LIMIT 1),
  COALESCE((SELECT SUM(soLuong) 
   FROM order_details 
   WHERE maDH=(SELECT maDH FROM orders 
               WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Lê Đức M') 
                 AND ngayDat='2025-10-25')), 0),
  '2025-11-01',
  '2026-02-15',
  'running'
);

-- Order 4: Vũ Thị G → Xưởng D
INSERT INTO production_plans (maDH, maNVL, maXuong, quantity, start_date, end_date, status)
VALUES
(
  (SELECT maDH FROM orders 
   WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Vũ Thị G') 
     AND ngayDat='2025-11-01'),
  (SELECT maNVL FROM raw_materials WHERE tenNVL='Gỗ hương' LIMIT 1),
  (SELECT maXuong FROM workshops WHERE tenXuong='Xưởng D' LIMIT 1),
  COALESCE((SELECT SUM(soLuong) 
   FROM order_details 
   WHERE maDH=(SELECT maDH FROM orders 
               WHERE maKH=(SELECT maKH FROM customers WHERE tenKH='Vũ Thị G') 
                 AND ngayDat='2025-11-01')), 0),
  '2025-11-06',
  '2025-12-26',
  'running'
);

-- ===============================
-- 11. WORK_ASSIGNMENTS
-- ===============================
-- Plan 1: Xưởng A → Worker 1
INSERT INTO work_assignments (production_plan_id, worker_id, task_description, assigned_date, work_shift, status, progress)
VALUES
(
  (SELECT plan_code FROM production_plans ORDER BY plan_code LIMIT 1),
  (SELECT id FROM users WHERE email='worker1@company.com'),
  'Chuẩn bị nguyên vật liệu để sản xuất 10 cái ghế và 2 cái tủ từ gỗ sồi',
  (SELECT start_date FROM production_plans ORDER BY plan_code LIMIT 1),
  'Ca 1 (07:00-15:00)',
  'completed',
  100
),
(
  (SELECT plan_code FROM production_plans ORDER BY plan_code LIMIT 1),
  (SELECT id FROM users WHERE email='worker1@company.com'),
  'Cắt và gia công gỗ',
  (SELECT start_date + INTERVAL '1 day' FROM production_plans ORDER BY plan_code LIMIT 1),
  'Ca 1 (07:00-15:00)',
  'in_progress',
  95
),
(
  (SELECT plan_code FROM production_plans ORDER BY plan_code LIMIT 1),
  (SELECT id FROM users WHERE email='worker1@company.com'),
  'Lắp ráp',
  (SELECT start_date + INTERVAL '25 day' FROM production_plans ORDER BY plan_code LIMIT 1),
  'Ca 2 (15:00-23:00)',
  'pending',
  0
),
(
  (SELECT plan_code FROM production_plans ORDER BY plan_code LIMIT 1),
  (SELECT id FROM users WHERE email='worker1@company.com'),
  'Hoàn thiện bề mặt',
  (SELECT start_date + INTERVAL '50 day' FROM production_plans ORDER BY plan_code LIMIT 1),
  'Ca 3 (23:00-07:00)',
  'pending',
  0
);

-- Plan 2: Xưởng B → Worker 2
INSERT INTO work_assignments (production_plan_id, worker_id, task_description, assigned_date, work_shift, status, progress)
VALUES
(
  (SELECT plan_code FROM production_plans ORDER BY plan_code OFFSET 1 LIMIT 1),
  (SELECT id FROM users WHERE email='worker2@company.com'),
  'Chuẩn bị nguyên vật liệu để sản xuất 5 cái bàn và 3 ghế từ gỗ tự nhiên',
  (SELECT start_date FROM production_plans ORDER BY plan_code OFFSET 1 LIMIT 1),
  'Ca 1 (07:00-15:00)',
  'completed',
  100
),
(
  (SELECT plan_code FROM production_plans ORDER BY plan_code OFFSET 1 LIMIT 1),
  (SELECT id FROM users WHERE email='worker2@company.com'),
  'Cắt và gia công gỗ',
  (SELECT start_date + INTERVAL '1 day' FROM production_plans ORDER BY plan_code OFFSET 1 LIMIT 1),
  'Ca 1 (07:00-15:00)',
  'in_progress',
  10
),
(
  (SELECT plan_code FROM production_plans ORDER BY plan_code OFFSET 1 LIMIT 1),
  (SELECT id FROM users WHERE email='worker2@company.com'),
  'Lắp ráp',
  (SELECT start_date + INTERVAL '18 day' FROM production_plans ORDER BY plan_code OFFSET 1 LIMIT 1),
  'Ca 2 (15:00-23:00)',
  'pending',
  0
),
(
  (SELECT plan_code FROM production_plans ORDER BY plan_code OFFSET 1 LIMIT 1),
  (SELECT id FROM users WHERE email='worker2@company.com'),
  'Hoàn thiện bề mặt',
  (SELECT start_date + INTERVAL '35 day' FROM production_plans ORDER BY plan_code OFFSET 1 LIMIT 1),
  'Ca 3 (23:00-07:00)',
  'pending',
  0
);