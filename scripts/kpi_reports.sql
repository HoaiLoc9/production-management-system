-- ===============================================
-- Bảng lưu các phiếu KPI đã duyệt / draft
-- ===============================================
CREATE TABLE IF NOT EXISTS kpi_drafts (
    id SERIAL PRIMARY KEY,
    workshop_id VARCHAR(10),
    workshop_name VARCHAR(255),
    created_by VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft / approved / rejected
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    -- mảng JSON lưu thông tin các chỉ số KPI từng xưởng
    workshops JSONB
);

-- Trigger tự động cập nhật updated_at khi sửa
CREATE OR REPLACE FUNCTION update_kpi_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_kpi_drafts_updated_at
BEFORE UPDATE ON kpi_drafts
FOR EACH ROW
EXECUTE FUNCTION update_kpi_drafts_updated_at();


-- ===============================================
-- Bảng lưu báo cáo KPI cuối
-- ===============================================
CREATE TABLE IF NOT EXISTS kpi_reports (
    id SERIAL PRIMARY KEY,
    created_by VARCHAR(255) NOT NULL,
    report_name VARCHAR(255) NOT NULL,
    report_period_start DATE,
    report_period_end DATE,
    summary TEXT,
    recommendations TEXT,
    average_kpi NUMERIC(5,2),
    kpi_report_ids TEXT[], -- lưu mảng id các draft liên quan
    aggregated_workshops JSONB, -- lưu dữ liệu KPI từng xưởng
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger tự động cập nhật updated_at khi sửa
CREATE OR REPLACE FUNCTION update_kpi_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_kpi_reports_updated_at
BEFORE UPDATE ON kpi_reports
FOR EACH ROW
EXECUTE FUNCTION update_kpi_reports_updated_at();
