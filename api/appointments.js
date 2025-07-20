import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Pool } = pkg;

// 配置dotenv
dotenv.config({ path: path.join(__dirname, '../.env') });

// 数据库连接配置
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' || process.env.SSL_MODE === 'require' ? { rejectUnauthorized: false } : false,
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pet_shop',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

export default async function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
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
      
      res.status(200).json({
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
  } else if (req.method === 'POST') {
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
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}