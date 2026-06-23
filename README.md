# Một Ngày Đi Câu 🎣

Hệ thống theo dõi kèo cá cược cá nhân với giao diện pixel art cute.

## Cài đặt nhanh

### Windows
```bash
setup.bat
```

### macOS / Linux
```bash
bash setup.sh
```

## Setup từng bước

### 1. Clone repo
```bash
git clone https://github.com/ducquyen12312ew/fishing.git
cd fishing
```

### 2. Install dependencies
```bash
npm install
```

### 3. Tạo Vercel Postgres Database

1. Vào [Vercel Dashboard](https://vercel.com)
2. Chọn project hoặc tạo mới
3. **Storage** → **Create Database** → **Postgres**
4. Chọn region → **Create**

### 4. Copy env vars

**Cách 1 (Dễ nhất):**
- Tab **Quickstart** → copy toàn bộ codeblock

**Cách 2:**
- Tab **.env.local** → copy tất cả

### 5. Tạo `.env.local`
```bash
# Paste env vars từ Vercel vào file này
cp .env.local.example .env.local
# Edit .env.local với thông tin từ Vercel
```

### 6. Khởi tạo database
```bash
npm run init-db
```

### 7. Chạy dev
```bash
npm run dev
```
Mở http://localhost:3000

### 8. Deploy lên Vercel (optional)
```bash
npm install -g vercel
vercel login
vercel deploy
```

## Cách dùng app

1. **Tạo chiến dịch**: Click 💰 góc phải → "+ Mới" → nhập tên + số xu
2. **Thêm kèo**: Click "Thêm hợp đồng" → chọn môn, nhập chi tiết
3. **Confirm kết quả**: Click card kèo → "🎣 Bắt được!" hoặc "💨 Sổng mất"
4. **Xem lịch sử**: Click "Hợp đồng cũ"

## Project structure

```
.
├── app/
│   ├── page.tsx                 # Hero page
│   ├── history/page.tsx         # History page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── api/                     # API endpoints
├── components/                  # React components
│   ├── RabbitCanvas.tsx         # Animated rabbit sprite
│   ├── BackgroundSlider.tsx     # Background rotation
│   ├── AddBetModal.tsx          # Add bet form
│   ├── CampaignModal.tsx        # Campaign management
│   └── ...                      # Other components
├── lib/db.ts                    # Database helpers
├── public/                      # Assets
│   ├── rabbit.png               # Sprite sheet
│   ├── background/              # BG images
│   ├── fish/                    # Fish sprites
│   ├── coin2_20x20.png          # Coin animation
│   └── gift-box.png             # Basket icon
└── scripts/init-db.js           # Database init script
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Vercel Postgres (Neon)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Fonts**: Press Start 2P (Google Fonts)

## Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm start         # Run production build
npm run init-db   # Initialize database
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | Lấy danh sách chiến dịch |
| POST | `/api/campaigns` | Tạo chiến dịch mới |
| PATCH | `/api/campaigns/[id]/activate` | Kích hoạt chiến dịch |
| GET | `/api/bets` | Lấy kèo |
| POST | `/api/bets` | Thêm kèo mới |
| PATCH | `/api/bets/[id]/resolve` | Confirm kết quả kèo |

## Database Schema

- **campaigns**: Chiến dịch đặt cược
- **bets**: Các kèo đã đặt
- **coin_history**: Lịch sử thay đổi xu

## Features

- 🎨 Pixel art UI với sprite animation
- 🐰 Con thỏ câu cá animate
- 🐟 8 loại cá theo mức tiền
- 💰 Hệ thống xu & chiến dịch
- 📊 Lịch sử kèo & thống kê ROI
- 🏆 16 môn thể thao (với search)
- 📱 Responsive design
- ⚡ Real-time updates

## Troubleshooting

### `npm run init-db` bị lỗi
- Kiểm tra `.env.local` có `POSTGRES_URL`?
- Kiểm tra kết nối Vercel Postgres chưa?
- Chạy lại từ đầu: `rm -rf .next node_modules && npm install`

### Build failed
- Xóa `.next` folder: `rm -rf .next`
- Chạy lại: `npm run build`

### Dev server không chạy được
- Port 3000 bị dùng? Chạy với port khác: `npm run dev -- -p 3001`

## Deploy Vercel

```bash
# 1. Login
vercel login

# 2. Link project
vercel link

# 3. Deploy
vercel deploy --prod
```

Vercel sẽ tự inject env vars từ project settings.

---

**GitHub**: https://github.com/ducquyen12312ew/fishing  
**Author**: Fishing Betting Tracker 🎣

