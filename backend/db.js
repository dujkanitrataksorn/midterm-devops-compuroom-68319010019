// db.js — เชื่อมต่อ PostgreSQL โดยอ่านค่าทั้งหมดจาก Environment Variables
// ห้าม hardcode รหัสผ่านหรือค่าเชื่อมต่อฐานข้อมูลในไฟล์นี้เด็ดขาด
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'compuroom',
});

// สร้างตาราง computers อัตโนมัติถ้ายังไม่มี (ทำให้ข้อมูล persist ผ่าน volume ของ db)
const initTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS computers (
      id SERIAL PRIMARY KEY,
      asset_code VARCHAR(50) UNIQUE NOT NULL,
      brand_model VARCHAR(100) NOT NULL,
      cpu VARCHAR(100) NOT NULL,
      ram_gb INTEGER NOT NULL,
      room VARCHAR(50) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'ใช้งาน',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

initTable().catch((err) => {
  console.error('Failed to initialize computers table:', err.message);
});

module.exports = pool;
