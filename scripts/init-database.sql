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

-- Create raw materials table
CREATE TABLE IF NOT EXISTS raw_materials (
  id SERIAL PRIMARY KEY,
  material_code VARCHAR(50) UNIQUE NOT NULL,
  material_name VARCHAR(255) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  quantity INT NOT NULL,
  reorder_level INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create warehouse transactions table
CREATE TABLE IF NOT EXISTS warehouse_transactions (
  id SERIAL PRIMARY KEY,
  transaction_type VARCHAR(20) NOT NULL,
  material_id INT REFERENCES raw_materials(id),
  quantity INT NOT NULL,
  supplier VARCHAR(255),
  notes TEXT,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
