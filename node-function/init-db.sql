-- 宠物店数据库初始化脚本

-- 创建套餐表
CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    features TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建预约表
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    pet_name VARCHAR(100) NOT NULL,
    package_id INTEGER REFERENCES packages(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    notes TEXT,
    contact_phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(DATE(start_time));
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_packages_category ON packages(category);
CREATE INDEX IF NOT EXISTS idx_packages_active ON packages(is_active);

-- 插入套餐数据
INSERT INTO packages (name, description, price, duration_minutes, category, features) VALUES
('基础洗护套餐', '包含基础洗澡、吹干、指甲修剪等服务', 88.00, 60, '洗护', ARRAY['基础洗澡', '吹干造型', '指甲修剪', '耳朵清洁']),
('精致美容套餐', '全面美容护理，让您的宠物焕然一新', 168.00, 90, '美容', ARRAY['深层清洁', '专业造型', '指甲修剪', '耳朵清洁', '香水喷洒', '拍照留念']),
('豪华SPA套餐', '顶级SPA体验，给宠物最贵族的享受', 288.00, 120, 'SPA', ARRAY['芳香SPA', '深层护理', '专业按摩', '造型设计', '指甲美容', '耳朵护理', '香水喷洒', '精美包装']);


SELECT '数据库初始化完成！' as message;