-- Financial Data Extractor Database Schema
-- SQLite version

-- Companies master table
CREATE TABLE IF NOT EXISTS companies (
    company_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticker_symbol TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    org_number TEXT UNIQUE,
    sector TEXT,
    industry TEXT,
    exchange TEXT DEFAULT 'Oslo Børs',
    listed_date DATE,
    website TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_ticker ON companies(ticker_symbol);
CREATE INDEX idx_companies_org_number ON companies(org_number);

-- Quarterly reports
CREATE TABLE IF NOT EXISTS quarterly_reports (
    report_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    quarter INTEGER NOT NULL CHECK(quarter BETWEEN 1 AND 4),
    report_date DATE,
    filing_date DATE,
    report_period TEXT,
    currency TEXT DEFAULT 'NOK',
    report_type TEXT,
    source_file_path TEXT NOT NULL,
    source_file_hash TEXT UNIQUE NOT NULL,
    extraction_status TEXT DEFAULT 'pending' CHECK(extraction_status IN ('pending', 'processing', 'completed', 'failed')),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id),
    UNIQUE(company_id, year, quarter)
);

CREATE INDEX idx_reports_company ON quarterly_reports(company_id);
CREATE INDEX idx_reports_period ON quarterly_reports(year, quarter);
CREATE INDEX idx_reports_hash ON quarterly_reports(source_file_hash);

-- Financial metrics
CREATE TABLE IF NOT EXISTS financial_metrics (
    metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL,
    revenue REAL,
    operating_revenue REAL,
    cost_of_goods_sold REAL,
    gross_profit REAL,
    operating_expenses REAL,
    ebitda REAL,
    ebit REAL,
    operating_profit REAL,
    financial_income REAL,
    financial_expenses REAL,
    profit_before_tax REAL,
    tax_expense REAL,
    net_income REAL,
    total_assets REAL,
    current_assets REAL,
    non_current_assets REAL,
    total_liabilities REAL,
    current_liabilities REAL,
    non_current_liabilities REAL,
    total_equity REAL,
    cash_and_equivalents REAL,
    operating_cash_flow REAL,
    investing_cash_flow REAL,
    financing_cash_flow REAL,
    free_cash_flow REAL,
    earnings_per_share REAL,
    book_value_per_share REAL,
    shares_outstanding INTEGER,
    extraction_confidence TEXT DEFAULT 'medium' CHECK(extraction_confidence IN ('high', 'medium', 'low')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES quarterly_reports(report_id) ON DELETE CASCADE,
    UNIQUE(report_id)
);

CREATE INDEX idx_metrics_report ON financial_metrics(report_id);

-- Operational metrics (flexible key-value)
CREATE TABLE IF NOT EXISTS operational_metrics (
    operational_id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value TEXT NOT NULL,
    metric_unit TEXT,
    metric_category TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES quarterly_reports(report_id) ON DELETE CASCADE
);

CREATE INDEX idx_operational_report ON operational_metrics(report_id);
CREATE INDEX idx_operational_name ON operational_metrics(metric_name);

-- Narrative data
CREATE TABLE IF NOT EXISTS narrative_data (
    narrative_id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL,
    executive_summary TEXT,
    key_developments TEXT,
    market_commentary TEXT,
    risk_factors TEXT,
    outlook TEXT,
    management_discussion TEXT,
    llm_generated_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES quarterly_reports(report_id) ON DELETE CASCADE,
    UNIQUE(report_id)
);

CREATE INDEX idx_narrative_report ON narrative_data(report_id);

-- Raw data storage
CREATE TABLE IF NOT EXISTS raw_data (
    raw_id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL,
    full_text_content TEXT,
    pdf_file BLOB,
    pdf_hash TEXT NOT NULL,
    page_count INTEGER,
    extraction_metadata TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES quarterly_reports(report_id) ON DELETE CASCADE,
    UNIQUE(report_id)
);

CREATE INDEX idx_raw_report ON raw_data(report_id);

-- Stock prices
CREATE TABLE IF NOT EXISTS stock_prices (
    price_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    price_date DATE NOT NULL,
    open_price REAL,
    high_price REAL,
    low_price REAL,
    close_price REAL,
    volume INTEGER,
    market_cap REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id),
    UNIQUE(company_id, price_date)
);

CREATE INDEX idx_prices_company ON stock_prices(company_id);
CREATE INDEX idx_prices_date ON stock_prices(price_date);

-- Extraction log
CREATE TABLE IF NOT EXISTS extraction_log (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER,
    extraction_step TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('started', 'success', 'failed', 'warning')),
    error_message TEXT,
    extraction_details TEXT,
    processing_time_seconds REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES quarterly_reports(report_id)
);

CREATE INDEX idx_log_report ON extraction_log(report_id);
CREATE INDEX idx_log_status ON extraction_log(status);
CREATE INDEX idx_log_created ON extraction_log(created_at);

-- Views for easier querying

-- Latest financial metrics per company
CREATE VIEW IF NOT EXISTS v_latest_financials AS
SELECT 
    c.company_name,
    c.ticker_symbol,
    qr.year,
    qr.quarter,
    qr.report_date,
    fm.*
FROM companies c
JOIN quarterly_reports qr ON c.company_id = qr.company_id
JOIN financial_metrics fm ON qr.report_id = fm.report_id
WHERE qr.extraction_status = 'completed'
ORDER BY c.company_id, qr.year DESC, qr.quarter DESC;

-- Company overview with latest data
CREATE VIEW IF NOT EXISTS v_company_overview AS
SELECT 
    c.*,
    COUNT(DISTINCT qr.report_id) as total_reports,
    MAX(qr.year || '-Q' || qr.quarter) as latest_quarter
FROM companies c
LEFT JOIN quarterly_reports qr ON c.company_id = qr.company_id
WHERE qr.extraction_status = 'completed'
GROUP BY c.company_id;

-- Extraction success rate
CREATE VIEW IF NOT EXISTS v_extraction_stats AS
SELECT 
    extraction_status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM quarterly_reports), 2) as percentage
FROM quarterly_reports
GROUP BY extraction_status;
