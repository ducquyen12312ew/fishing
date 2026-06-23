# A Fishing Day 🎣

Personal bet tracking system with pixel art UI.

## Quick Start

```bash
npm install
```

### 1. Set up MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user with read/write access
3. Whitelist your IP (or `0.0.0.0/0` for Vercel)
4. Copy the connection string

### 2. Configure `.env.local`

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/fishing-day
```

> Collections are created automatically on first use — no init script needed.

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000

### 4. Deploy to Vercel

```bash
vercel deploy
```

Add `MONGODB_URI` to Vercel → Project Settings → Environment Variables.

## How to use

1. **Create a campaign** — click 💰 top right → "+ New" → enter name & initial coins
2. **Add a bet** — click "New Contract" → choose sport, name, bait cost, odds
3. **Confirm result** — click a bet card → "🎣 Caught!" or "💨 Missed..."
4. **View history** — click "Old Contracts"

## Tech stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB Atlas (Mongoose)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Font**: Silkscreen (Google Fonts)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | List campaigns |
| POST | `/api/campaigns` | Create campaign |
| PATCH | `/api/campaigns/[id]/activate` | Set active campaign |
| GET | `/api/bets?status=pending` | Pending bets |
| GET | `/api/bets?status=resolved` | Bet history |
| POST | `/api/bets` | Place new bet |
| PATCH | `/api/bets/[id]/resolve` | Resolve bet result |

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Run production build
```
