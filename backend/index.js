const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const VERSION = '1.0.0';
const initializeDatabase = pool.initializeDatabase || (() => Promise.resolve());

app.use(cors());
app.use(express.json());
app.use(async (req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (err) {
    console.error('Database initialization failed:', err.message);
    res.status(503).json({ error: 'Database unavailable' });
  }
});

// GET /health — ตรวจสอบสถานะระบบ
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: VERSION });
});

// GET /api/computers — ดึงรายการทั้งหมด
app.get('/api/computers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM computers ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/computers/:id — ดึงข้อมูลตาม id
app.get('/api/computers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM computers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Computer not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/computers — เพิ่มข้อมูลใหม่
app.post('/api/computers', async (req, res) => {
  try {
    const {
      asset_code: assetCode,
      brand_model: brandModel,
      cpu,
      ram_gb: ramGb,
      room,
      status,
    } = req.body;

    if (!assetCode || !brandModel || !cpu || !ramGb || !room) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO computers (asset_code, brand_model, cpu, ram_gb, room, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [assetCode, brandModel, cpu, ramGb, room, status || 'ใช้งาน'],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'asset_code already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/computers/:id — แก้ไขข้อมูล
app.put('/api/computers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      asset_code: assetCode,
      brand_model: brandModel,
      cpu,
      ram_gb: ramGb,
      room,
      status,
    } = req.body;

    const existing = await pool.query('SELECT * FROM computers WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Computer not found' });
    }

    const result = await pool.query(
      `UPDATE computers SET
        asset_code = COALESCE($1, asset_code),
        brand_model = COALESCE($2, brand_model),
        cpu = COALESCE($3, cpu),
        ram_gb = COALESCE($4, ram_gb),
        room = COALESCE($5, room),
        status = COALESCE($6, status),
        updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [assetCode, brandModel, cpu, ramGb, room, status, id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/computers/:id — ลบข้อมูล
app.delete('/api/computers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM computers WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Computer not found' });
    }
    res.json({ message: 'Deleted successfully', deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// รัน server เฉพาะตอนถูกเรียกโดยตรง (ไม่ใช่ตอนถูก require ใน test)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`compuroom-api running on port ${PORT}`);
  });
}

module.exports = app;
