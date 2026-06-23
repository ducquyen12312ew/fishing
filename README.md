# Một Ngày Đi Câu 🎣

Hệ thống theo dõi kèo cá cược cá nhân với giao diện pixel art cute.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Tạo Vercel Postgres database
1. Vào [Vercel Dashboard](https://vercel.com) → Storage → Create Database → Postgres
2. Connect to project (hoặc copy connection strings)
3. Vào tab "Quickstart" → copy tất cả env vars

### 3. Tạo file `.env.local`
Paste các env vars từ Vercel vào `.env.local` (file mẫu đã có sẵn).

### 4. Khởi tạo database
```bash
npm run init-db
```

### 5. Chạy dev
```bash
npm run dev
```
Mở http://localhost:3000

### 6. Deploy lên Vercel
```bash
vercel deploy
```
Vercel tự đọc env vars từ project settings.

## Cách dùng

1. **Tạo chiến dịch**: Click 💰 góc phải → tab "+ Mới" → nhập tên + số xu
2. **Thêm kèo**: Click "Thêm hợp đồng" → chọn môn, nhập tên, tiền mua mồi, tỉ lệ
3. **Confirm kết quả**: Click vào card kèo → "🎣 Bắt được!" hoặc "💨 Sổng mất"
4. **Xem lịch sử**: Click "Hợp đồng cũ"

## Tài nguyên (public/)
- `rabbit.png` — sprite sheet 5×3, 14 frames
- `background/bg1-3.png` — background scenes
- `fish/fish1-8.png` — pixel fish by bet size
- `coin2_20x20.png` — coin animation 8 frames
- `gift-box.png` — fish basket icon
