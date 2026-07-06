# 💻 ระบบบันทึกข้อมูลเครื่องคอมพิวเตอร์ประจำห้อง (compuroom)

**ชื่อ-นามสกุล:** นาย ดุจคณิต ราชอักษร
**รหัสนักศึกษา:** 68319010019
**กลุ่มเรียน:** ปวส2/2
**วิชา:** DevOps 30901-2008 — สอบกลางภาคปฏิบัติ (Midterm DevOps Mini Project)

![CI](https://github.com/<GITHUB_USERNAME>/midterm-devops-compuroom-68319010019/actions/workflows/ci.yml/badge.svg)

> ⚠️ หลังจาก push repo ขึ้น GitHub แล้ว ให้แทนที่ `<GITHUB_USERNAME>` ด้านบนด้วย GitHub username จริงของคุณ เพื่อให้ badge แสดงผลถูกต้อง

## 📋 คำอธิบายระบบ

ระบบบันทึกข้อมูล (CRUD) เครื่องคอมพิวเตอร์ในห้องปฏิบัติการของแผนก รองรับการเพิ่ม แก้ไข ลบ และแสดงรายการเครื่องคอมพิวเตอร์ พร้อมข้อมูลสเปกเครื่องและสถานะการใช้งาน (ใช้งาน / ส่งซ่อม / จำหน่าย)

## 🧩 เทคโนโลยีที่ใช้

- **Backend:** Node.js + Express + PostgreSQL
- **Frontend:** HTML + Vanilla JS
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions (lint → test → build)

## 📡 API Endpoints

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| GET    | `/health` | ตรวจสอบสถานะระบบ → `{ status, version }` |
| GET    | `/api/computers` | ดึงรายการคอมพิวเตอร์ทั้งหมด |
| GET    | `/api/computers/:id` | ดึงข้อมูลคอมพิวเตอร์ตาม id (404 ถ้าไม่พบ) |
| POST   | `/api/computers` | เพิ่มข้อมูลคอมพิวเตอร์ใหม่ |
| PUT    | `/api/computers/:id` | แก้ไขข้อมูลคอมพิวเตอร์ (404 ถ้าไม่พบ) |
| DELETE | `/api/computers/:id` | ลบข้อมูลคอมพิวเตอร์ (404 ถ้าไม่พบ) |

### ตัวอย่าง Body สำหรับ POST / PUT

```json
{
  "asset_code": "PC-IT-001",
  "brand_model": "Dell OptiPlex 7090",
  "cpu": "Intel Core i5-11500",
  "ram_gb": 16,
  "room": "IT-101",
  "status": "ใช้งาน"
}
```

## 🚀 วิธีรันระบบ

### แบบที่ 1: Dev (build เอง จากซอร์สโค้ด)

```bash
cp .env.example .env
docker compose up -d --build
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000

### แบบที่ 2: Production (pull image จาก Docker Hub)

```bash
cp .env.example .env
docker compose -f docker-compose.prod.yml up -d
```

ใช้งานได้ทันทีโดยไม่ต้อง build เอง (pull image จาก Docker Hub มารันตรง ๆ)

## 🐳 Docker Hub Repository

- Backend: https://hub.docker.com/r/confirm123/compuroom-api
- Frontend: https://hub.docker.com/r/confirm123/compuroom-web

## 🧪 การรัน Unit Test

```bash
cd backend
npm install
npm test
```

## 🔧 ตัวแปรแวดล้อม (Environment Variables)

ดูตัวอย่างที่ `.env.example` — ห้าม hardcode รหัสผ่านฐานข้อมูลในโค้ดโดยเด็ดขาด

| ตัวแปร | คำอธิบาย |
|--------|----------|
| `DB_USER` | ชื่อผู้ใช้ฐานข้อมูล |
| `DB_PASSWORD` | รหัสผ่านฐานข้อมูล |
| `DB_NAME` | ชื่อฐานข้อมูล (`compuroom`) |

## 📁 โครงสร้างโปรเจกต์

```
midterm-devops-compuroom-68319010019/
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml
├── docker-compose.prod.yml
├── .github/workflows/ci.yml
├── backend/   (Express API + PostgreSQL)
└── frontend/  (HTML + Vanilla JS)
```
