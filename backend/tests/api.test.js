const request = require('supertest');
const app = require('../index');
const pool = require('../db');

// รอให้ตาราง computers ถูกสร้างเสร็จก่อนเริ่ม test
beforeAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
});

afterAll(async () => {
  await pool.end();
});

describe('GET /health', () => {
  it('ควรตอบ status ok พร้อม version', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('version');
  });
});

describe('POST /api/computers', () => {
  it('ควรปฏิเสธเมื่อขาดฟิลด์ที่จำเป็น (400)', async () => {
    const res = await request(app)
      .post('/api/computers')
      .send({ brand_model: 'Dell OptiPlex' });
    expect(res.statusCode).toBe(400);
  });

  it('ควรสร้างข้อมูลคอมพิวเตอร์ใหม่ได้สำเร็จ (201)', async () => {
    const res = await request(app)
      .post('/api/computers')
      .send({
        asset_code: `TEST-${Date.now()}`,
        brand_model: 'Dell OptiPlex 7090',
        cpu: 'Intel Core i5-11500',
        ram_gb: 16,
        room: 'IT-101',
        status: 'ใช้งาน',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.brand_model).toBe('Dell OptiPlex 7090');
  });
});

describe('GET /api/computers/:id', () => {
  it('ควรตอบ 404 เมื่อไม่พบ id ในระบบ', async () => {
    const res = await request(app).get('/api/computers/999999');
    expect(res.statusCode).toBe(404);
  });
});
