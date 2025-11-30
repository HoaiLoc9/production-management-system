SET client_encoding = 'UTF8';

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- BẬT CRYPTO
-- ===============================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ===============================
-- TRIGGER HASH PASSWORD
-- ===============================
CREATE OR REPLACE FUNCTION hash_password()
RETURNS TRIGGER AS $$ 
BEGIN
  IF LENGTH(NEW.password) < 60 OR NEW.password NOT LIKE '$2a$%' THEN
    NEW.password := crypt(NEW.password, gen_salt('bf', 10));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_hash_password
BEFORE INSERT OR UPDATE OF password ON users
FOR EACH ROW
EXECUTE FUNCTION hash_password();

-- ===============================
-- TRIGGER UPDATE TIMESTAMP
-- ===============================
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- ===============================
-- DỮ LIỆU MẪU
-- Password sẽ tự động hash
-- ===============================
INSERT INTO users (email, password, role, name) VALUES
('admin@company.com', 'password123', 'admin', 'Trần Thị Mỹ Q'),
('director@company.com', 'password123', 'director', 'Trần Văn B'),
('manager@company.com', 'password123', 'manager', 'Nguyễn Văn A'),
('supervisorA@company.com', 'password123', 'supervisor', 'Nguyễn Văn X1'),
('supervisorB@company.com', 'password123', 'supervisor', 'Trần Thị X2'),
('supervisorC@company.com', 'password123', 'supervisor', 'Lê Văn X3'),
('supervisorD@company.com', 'password123', 'supervisor', 'Phạm Thị X4'),
('warehouse.raw@company.com', 'password123', 'warehouse_raw', 'Phạm Thị D'),
('warehouse.product@company.com', 'password123', 'warehouse_product', 'Hoàng Văn E'),
('qc@company.com', 'password123', 'qc', 'Vũ Thị F'),
('worker1@company.com', 'password123', 'worker', 'Đặng Văn G'),
('worker2@company.com', 'password123', 'worker', 'Lưu Quang T')

ON CONFLICT (email) DO NOTHING;
