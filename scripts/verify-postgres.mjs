import { Pool } from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL não foi definida.')
  process.exit(1)
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
})

try {
  const profile = await pool.query("SELECT to_regclass('public.game_profiles') AS table_name")
  const columns = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'game_profiles' ORDER BY ordinal_position")
  console.log(JSON.stringify({ connected: true, gameProfilesReady: Boolean(profile.rows[0].table_name), columns: columns.rows.map((row) => row.column_name) }))
} finally {
  await pool.end()
}
