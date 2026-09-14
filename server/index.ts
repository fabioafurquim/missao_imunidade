import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { Pool } from 'pg'

const loadLocalEnvironment = () => {
  const file = join(process.cwd(), '.env.local')
  if (!existsSync(file)) return
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (!match || match[1] in process.env) continue
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '')
  }
}

loadLocalEnvironment()

type Progress = { playerId: string; xp: number; coins: number; completed: number[]; dailyClaimed: string; lastActiveDay: string; streak: number; bestScore: number }

const port = Number(process.env.PORT || 80)
const dist = join(process.cwd(), 'dist')
const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined }) : null
let databaseReady = false

const respondJson = (response: ServerResponse, status: number, value: unknown) => {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify(value))
}

const validProgress = (value: unknown): value is Progress => {
  if (!value || typeof value !== 'object') return false
  const item = value as Progress
  return /^[a-zA-Z0-9-]{16,80}$/.test(item.playerId) && Number.isInteger(item.xp) && item.xp >= 0 && Number.isInteger(item.coins) && item.coins >= 0 && Array.isArray(item.completed) && item.completed.every((id) => Number.isInteger(id) && id > 0 && id <= 99) && typeof item.dailyClaimed === 'string' && /^$|^\d{4}-\d{2}-\d{2}$/.test(item.dailyClaimed) && typeof item.lastActiveDay === 'string' && /^$|^\d{4}-\d{2}-\d{2}$/.test(item.lastActiveDay) && Number.isInteger(item.streak) && item.streak >= 0 && item.streak <= 9999 && Number.isInteger(item.bestScore) && item.bestScore >= 0
}

const readBody = async (request: IncomingMessage) => new Promise<unknown>((resolve, reject) => {
  let raw = ''
  request.on('data', (chunk: Buffer) => { raw += chunk; if (raw.length > 20_000) request.destroy() })
  request.on('end', () => { try { resolve(JSON.parse(raw || '{}')) } catch { reject(new Error('JSON inválido')) } })
  request.on('error', reject)
})

const initDatabase = async () => {
  if (!pool) return
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS game_profiles (
      player_id TEXT PRIMARY KEY,
      xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
      coins INTEGER NOT NULL DEFAULT 0 CHECK (coins >= 0),
      completed JSONB NOT NULL DEFAULT '[]'::jsonb,
      daily_claimed TEXT NOT NULL DEFAULT '',
      last_active_day TEXT NOT NULL DEFAULT '',
      streak INTEGER NOT NULL DEFAULT 0 CHECK (streak >= 0),
      best_score INTEGER NOT NULL DEFAULT 0 CHECK (best_score >= 0),
      plays INTEGER NOT NULL DEFAULT 0 CHECK (plays >= 0),
      display_name TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)
    await pool.query("ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS daily_claimed TEXT NOT NULL DEFAULT ''")
    await pool.query("ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS last_active_day TEXT NOT NULL DEFAULT ''")
    await pool.query('ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS streak INTEGER NOT NULL DEFAULT 0 CHECK (streak >= 0)')
    await pool.query('ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS best_score INTEGER NOT NULL DEFAULT 0 CHECK (best_score >= 0)')
    await pool.query('ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS plays INTEGER NOT NULL DEFAULT 0 CHECK (plays >= 0)')
    await pool.query("ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS display_name TEXT NOT NULL DEFAULT ''")
    databaseReady = true
    console.log('PostgreSQL conectado para progresso anônimo.')
  } catch (error) { console.error('PostgreSQL indisponível; o jogo continuará em modo local.', error) }
}

const serveStatic = async (request: IncomingMessage, response: ServerResponse) => {
  const requested = request.url?.split('?')[0] || '/'
  const safePath = normalize(requested).replace(/^([/\\])+/, '')
  const candidate = join(dist, safePath)
  const file = existsSync(candidate) && (await stat(candidate)).isFile() ? candidate : join(dist, 'index.html')
  const contentType: Record<string, string> = { '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.html': 'text/html' }
  response.writeHead(200, { 'Content-Type': `${contentType[extname(file)] || 'application/octet-stream'}; charset=utf-8` })
  createReadStream(file).pipe(response)
}

await initDatabase()
createServer(async (request, response) => {
  try {
    const path = request.url?.split('?')[0] || '/'
    if (path === '/api/health') return respondJson(response, 200, { ok: true, persistence: databaseReady ? 'postgres' : 'local' })
    const match = path.match(/^\/api\/progress\/([a-zA-Z0-9-]{16,80})$/)
    if (match && request.method === 'GET') {
      if (!databaseReady || !pool) return respondJson(response, 503, { error: 'Persistência ainda não configurada.' })
      const result = await pool.query('SELECT player_id AS "playerId", xp, coins, completed, daily_claimed AS "dailyClaimed", last_active_day AS "lastActiveDay", streak, best_score AS "bestScore" FROM game_profiles WHERE player_id = $1', [match[1]])
      return respondJson(response, 200, result.rows[0] || null)
    }
    if (path === '/api/progress' && request.method === 'PUT') {
      const progress = await readBody(request)
      if (!validProgress(progress)) return respondJson(response, 400, { error: 'Progresso inválido.' })
      if (!databaseReady || !pool) return respondJson(response, 503, { error: 'Persistência ainda não configurada.' })
      const result = await pool.query(`INSERT INTO game_profiles (player_id, xp, coins, completed, daily_claimed, last_active_day, streak, best_score)
        VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8)
        ON CONFLICT (player_id) DO UPDATE SET xp = GREATEST(game_profiles.xp, EXCLUDED.xp), coins = GREATEST(game_profiles.coins, EXCLUDED.coins), completed = EXCLUDED.completed, daily_claimed = EXCLUDED.daily_claimed, last_active_day = EXCLUDED.last_active_day, streak = GREATEST(game_profiles.streak, EXCLUDED.streak), best_score = GREATEST(game_profiles.best_score, EXCLUDED.best_score), updated_at = NOW()
        RETURNING player_id AS "playerId", xp, coins, completed, daily_claimed AS "dailyClaimed", last_active_day AS "lastActiveDay", streak, best_score AS "bestScore"`, [progress.playerId, progress.xp, progress.coins, JSON.stringify([...new Set(progress.completed)].sort()), progress.dailyClaimed, progress.lastActiveDay, progress.streak, progress.bestScore])
      return respondJson(response, 200, result.rows[0])
    }
    if (path === '/api/plays' && request.method === 'POST') {
      const value = await readBody(request)
      const playerId = value && typeof value === 'object' ? (value as { playerId?: unknown }).playerId : null
      if (typeof playerId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(playerId)) return respondJson(response, 400, { error: 'Identificador inválido.' })
      if (!databaseReady || !pool) return respondJson(response, 503, { error: 'Persistência ainda não configurada.' })
      await pool.query(`INSERT INTO game_profiles (player_id) VALUES ($1) ON CONFLICT (player_id) DO UPDATE SET plays = game_profiles.plays + 1, updated_at = NOW()`, [playerId])
      return respondJson(response, 204, null)
    }
    if (path === '/api/display-name' && request.method === 'PUT') {
      const value = await readBody(request)
      const playerId = value && typeof value === 'object' ? (value as { playerId?: unknown }).playerId : null
      const displayName = value && typeof value === 'object' ? (value as { displayName?: unknown }).displayName : null
      if (typeof playerId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(playerId) || typeof displayName !== 'string') return respondJson(response, 400, { error: 'Dados de exibição inválidos.' })
      const normalizedName = displayName.trim().replace(/\s+/g, ' ')
      if (normalizedName.length < 2 || normalizedName.length > 60) return respondJson(response, 400, { error: 'Nome de exibição inválido.' })
      if (!databaseReady || !pool) return respondJson(response, 503, { error: 'Persistência ainda não configurada.' })
      await pool.query(`INSERT INTO game_profiles (player_id, display_name) VALUES ($1, $2)
        ON CONFLICT (player_id) DO UPDATE SET display_name = EXCLUDED.display_name, updated_at = NOW()`, [playerId, normalizedName])
      return respondJson(response, 204, null)
    }
    if (path === '/api/records' && request.method === 'GET') {
      if (!databaseReady || !pool) return respondJson(response, 503, { error: 'Recordes ainda não configurados.' })
      const [summary, score, xp, plays] = await Promise.all([
        pool.query(`SELECT COUNT(*)::int AS players, COUNT(*) FILTER (WHERE updated_at > NOW() - INTERVAL '30 days')::int AS active_players, COALESCE(SUM(plays), 0)::int AS plays, COALESCE(SUM(jsonb_array_length(completed)), 0)::int AS completed FROM game_profiles`),
        pool.query(`SELECT player_id AS "playerId", display_name AS "displayName", best_score AS value FROM game_profiles WHERE best_score > 0 ORDER BY best_score DESC, updated_at ASC LIMIT 5`),
        pool.query(`SELECT player_id AS "playerId", display_name AS "displayName", xp AS value FROM game_profiles WHERE xp > 0 ORDER BY xp DESC, updated_at ASC LIMIT 5`),
        pool.query(`SELECT player_id AS "playerId", display_name AS "displayName", plays AS value FROM game_profiles WHERE plays > 0 ORDER BY plays DESC, updated_at ASC LIMIT 5`),
      ])
      return respondJson(response, 200, { summary: summary.rows[0], leaderboards: { score: score.rows, xp: xp.rows, plays: plays.rows } })
    }
    await serveStatic(request, response)
  } catch (error) { console.error(error); respondJson(response, 500, { error: 'Erro interno.' }) }
}).listen(port, () => console.log(`Missão Imunidade disponível na porta ${port}.`))
