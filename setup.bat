@echo off
REM Setup script for "Một Ngày Đi Câu"
REM Run: setup.bat

echo.
echo 🎣 Một Ngày Đi Câu - Setup Script
echo ==================================
echo.

REM 1. Install dependencies
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 goto error
echo ✓ Dependencies installed
echo.

REM 2. Check environment
if not exist ".env.local" (
    echo ⚠️  .env.local not found!
    echo.
    echo Hướng dẫn tạo .env.local:
    echo 1. Vào https://vercel.com/dashboard
    echo 2. Chọn project ^> Storage ^> Postgres
    echo 3. Copy .env.local content từ Quickstart
    echo 4. Paste vào file .env.local
    echo.
    (
        echo # Vercel Postgres - copy từ Vercel Dashboard
        echo POSTGRES_URL="postgres://..."
        echo POSTGRES_PRISMA_URL="postgres://..."
        echo POSTGRES_URL_NO_SSL="postgres://..."
        echo POSTGRES_URL_NON_POOLING="postgres://..."
        echo POSTGRES_USER="..."
        echo POSTGRES_HOST="..."
        echo POSTGRES_PASSWORD="..."
        echo POSTGRES_DATABASE="..."
    ) > .env.local
    echo ✓ .env.local created ^(update với thông tin từ Vercel^)
) else (
    echo ✓ .env.local found
)
echo.

REM 3. Initialize database
echo 🗄️  Initializing database...
call npm run init-db
if errorlevel 1 goto error
echo ✓ Database initialized
echo.

echo ✅ Setup hoàn thành!
echo.
echo Chạy dev: npm run dev
echo Build: npm run build
echo Deploy: vercel deploy
goto end

:error
echo.
echo ❌ Lỗi trong setup!
exit /b 1

:end
