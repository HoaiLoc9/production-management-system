-- ===============================
-- 0. XÓA TRIGGER TRƯỚC KHI XÓA BẢNG
-- ===============================

DROP TRIGGER IF EXISTS trg_suppliers_updated_at ON suppliers;
DROP TRIGGER IF EXISTS trg_raw_materials_updated_at ON raw_materials;
DROP TRIGGER IF EXISTS trg_workshops_updated_at ON workshops;
DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
DROP TRIGGER IF EXISTS trg_customers_updated_at ON customers;
DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS trg_order_details_updated_at ON order_details;
DROP TRIGGER IF EXISTS trg_production_plans_updated_at ON production_plans;
DROP TRIGGER IF EXISTS trg_delivery_notes_updated_at ON delivery_notes;
DROP TRIGGER IF EXISTS trg_work_assignments_updated_at ON work_assignments;

-- ===============================
-- 1. XÓA TABLES THEO THỨ TỰ CHILD → PARENT
-- ===============================
DROP TABLE IF EXISTS work_assignments CASCADE;
DROP TABLE IF EXISTS delivery_notes CASCADE;
DROP TABLE IF EXISTS production_plans CASCADE;
DROP TABLE IF EXISTS order_details CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS warehouse_receipts CASCADE;
DROP TABLE IF EXISTS purchase_request_details CASCADE;
DROP TABLE IF EXISTS purchase_requests CASCADE;
DROP TABLE IF EXISTS workshops CASCADE;
DROP TABLE IF EXISTS raw_materials CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;

-- ===============================
-- 2. XÓA FUNCTION
-- ===============================
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
