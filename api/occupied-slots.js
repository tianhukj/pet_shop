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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
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
      
      res.status(200).json({
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
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}