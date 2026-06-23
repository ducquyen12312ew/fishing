#!/bin/bash
# Setup script cho "Một Ngày Đi Câu"
# Chạy: bash setup.sh

set -e

echo "🎣 Một Ngày Đi Câu - Setup Script"
echo "=================================="
echo ""

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# 2. Check environment
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found!"
    echo ""
    echo "Hướng dẫn tạo .env.local:"
    echo "1. Vào https://vercel.com/dashboard"
    echo "2. Chọn project → Storage → Postgres"
    echo "3. Copy .env.local content từ Quickstart"
    echo "4. Paste vào file .env.local"
    echo ""
    echo "Hoặc tạo file trống:"
    cp .env.local.example .env.local 2>/dev/null || echo 'POSTGRES_URL="postgres://..."' > .env.local
    echo "✓ .env.local created (update với thông tin từ Vercel)"
else
    echo "✓ .env.local found"
fi
echo ""

# 3. Initialize database
echo "🗄️  Initializing database..."
npm run init-db
echo "✓ Database initialized"
echo ""

echo "✅ Setup hoàn thành!"
echo ""
echo "Chạy dev: npm run dev"
echo "Build: npm run build"
echo "Deploy: vercel deploy"
