import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES模块中获取__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pkg;
// 配置dotenv从项目根目录读取.env文件
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// 数据库连接配置
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' || process.env.SSL_MODE === 'require' ? { rejectUnauthorized: false } : false,
  // 备用配置（如果没有 DATABASE_URL）
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pet_shop',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// 中间件
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务（用于生产环境）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
}

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 获取套餐列表
app.get('/api/packages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM packages ORDER BY price ASC');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('获取套餐列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取套餐列表失败',
      error: error.message
    });
  }
});

// 创建预约
app.post('/api/appointments', async (req, res) => {
  const { petName, packageId, startTime, endTime, notes, contactPhone } = req.body;
  
  // 验证必填字段
  if (!petName || !packageId || !startTime || !endTime || !contactPhone) {
    return res.status(400).json({
      success: false,
      message: '请填写所有必填信息'
    });
  }
  
  try {
    // 检查时间冲突
    const conflictCheck = await pool.query(
      `SELECT id FROM appointments 
       WHERE (start_time < $1 AND end_time > $2) 
       OR (start_time < $3 AND end_time > $1)
       OR (start_time >= $2 AND start_time < $1)
       OR (end_time > $2 AND end_time <= $1)`,
      [endTime, startTime, startTime]
    );
    
    if (conflictCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: '选择的时间段已被预约，请选择其他时间'
      });
    }
    
    // 创建预约
    const result = await pool.query(
      `INSERT INTO appointments (pet_name, package_id, start_time, end_time, notes, contact_phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [petName, packageId, startTime, endTime, notes, contactPhone]
    );
    
    res.status(201).json({
      success: true,
      message: '预约创建成功',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('创建预约失败:', error);
    res.status(500).json({
      success: false,
      message: '创建预约失败',
      error: error.message
    });
  }
});

// 获取预约列表
app.get('/api/appointments', async (req, res) => {
  const { date } = req.query;
  
  try {
    let query = `
      SELECT a.*, p.name as package_name, p.duration_minutes
      FROM appointments a
      JOIN packages p ON a.package_id = p.id
    `;
    let params = [];
    
    if (date) {
      query += ' WHERE DATE(a.start_time) = $1';
      params.push(date);
    }
    
    query += ' ORDER BY a.start_time ASC';
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('获取预约列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取预约列表失败',
      error: error.message
    });
  }
});

// 获取已占用的时间段
app.get('/api/appointments/occupied-slots', async (req, res) => {
  const { date } = req.query;
  
  if (!date) {
    return res.status(400).json({
      success: false,
      message: '请提供日期参数'
    });
  }
  
  try {
    const result = await pool.query(
      `SELECT start_time, end_time 
       FROM appointments 
       WHERE DATE(start_time) = $1 
       AND status != 'cancelled'
       ORDER BY start_time ASC`,
      [date]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('获取已占用时间段失败:', error);
    res.status(500).json({
      success: false,
      message: '获取已占用时间段失败',
      error: error.message
    });
  }
});

// 更新预约状态
app.patch('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({
      success: false,
      message: '请提供状态参数'
    });
  }
  
  try {
    const result = await pool.query(
      'UPDATE appointments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '预约不存在'
      });
    }
    
    res.json({
      success: true,
      message: '预约状态更新成功',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('更新预约状态失败:', error);
    res.status(500).json({
      success: false,
      message: '更新预约状态失败',
      error: error.message
    });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : '服务器错误'
  });
});

// 404 处理
app.use('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(404).json({
      success: false,
      message: 'API 路径不存在'
    });
  } else if (process.env.NODE_ENV === 'production') {
    // 生产环境下，非API路径返回前端应用
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    res.status(404).json({
      success: false,
      message: '页面不存在'
    });
  }
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在端口 ${PORT}`);
    console.log(`📱 API 地址: http://localhost:${PORT}/api/hello`);
    console.log(`🏥 健康检查: http://localhost:${PORT}/api/health`);
  });
}

// ❗无论 Vercel 还是本地都要导出 app（Vercel 会用这个）
module.exports = app;
