// db.js — เชื่อมต่อ PostgreSQL โดยอ่านค่าทั้งหมดจาก Environment Variables
// ห้าม hardcode รหัสผ่านหรือค่าเชื่อมต่อฐานข้อมูลในไฟล์นี้เด็ดขาด
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'compuroom',
});

const waitForDatabase = async (retries = 15, delayMs = 1000) => {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (err) {
      if (attempt === retries) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

// สร้างตาราง computers อัตโนมัติถ้ายังไม่มี (ทำให้ข้อมูล persist ผ่าน volume ของ db)
const initializeDatabase = async () => {
  await waitForDatabase();
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

let initializationPromise = null;

const startupDatabase = () => {
  if (!initializationPromise) {
    initializationPromise = initializeDatabase().catch((err) => {
      console.error('Failed to initialize computers table:', err.message);
      throw err;
    });
  }
  return initializationPromise;
};

startupDatabase();

module.exports = pool;
module.exports.initializeDatabase = startupDatabase;
