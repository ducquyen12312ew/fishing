const { sql } = require('@vercel/postgres')
require('dotenv').config({ path: '.env.local' })

async function initDB() {
  console.log('Initializing database...')

  await sql`
    CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      initial_coins INTEGER NOT NULL,
      current_coins INTEGER NOT NULL,
      total_win INTEGER DEFAULT 0,
      total_lose INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('✓ campaigns table')

  await sql`
    CREATE TABLE IF NOT EXISTS bets (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER REFERENCES campaigns(id),
      sport_emoji VARCHAR(10) NOT NULL,
      name VARCHAR(255) NOT NULL,
      amount INTEGER NOT NULL,
      odds DECIMAL(5,2) NOT NULL,
      fish_image VARCHAR(50) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW(),
      resolved_at TIMESTAMP
    )
  `
  console.log('✓ bets table')

  await sql`
    CREATE TABLE IF NOT EXISTS coin_history (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER REFERENCES campaigns(id),
      type VARCHAR(20) NOT NULL,
      amount INTEGER NOT NULL,
      note VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('✓ coin_history table')

  console.log('Database initialized successfully!')
  process.exit(0)
}

initDB().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
