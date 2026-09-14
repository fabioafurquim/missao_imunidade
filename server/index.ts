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

const rewards = {
  central: { price: 0, level: 1 },
  vigilante: { price: 30, level: 2 },
  estrategista: { price: 60, level: 3 },
  campo: { price: 90, level: 4 },
  aurora: { price: 140, level: 5 },
} as const

type RewardId = keyof typeof rewards
type Progress = { playerId: string; xp: number; coins: number; completed: number[]; dailyClaimed: string; lastActiveDay: string; streak: number; bestScore: number; inventory: string[]; equippedStyle: string }

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
  return /^[a-zA-Z0-9-]{16,80}$/.test(item.playerId) && Number.isInteger(item.xp) && item.xp >= 0 && Number.isInteger(item.coins) && item.coins >= 0 && Array.isArray(item.completed) && item.completed.every((id) => Number.isInteger(id) && id > 0 && id <= 99) && typeof item.dailyClaimed === 'string' && /^$|^\d{4}-\d{2}-\d{2}$/.test(item.dailyClaimed) && typeof item.lastActiveDay === 'string' && /^$|^\d{4}-\d{2}-\d{2}$/.test(item.lastActiveDay) && Number.isInteger(item.streak) && item.streak >= 0 && item.streak <= 9999 && Number.isInteger(item.bestScore) && item.bestScore >= 0 && Array.isArray(item.inventory) && item.inventory.every((id) => typeof id === 'string' && id in rewards) && typeof item.equippedStyle === 'string' && item.equippedStyle in rewards
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
      inventory JSONB NOT NULL DEFAULT '["central"]'::jsonb,
      equipped_style TEXT NOT NULL DEFAULT 'central',
      completed JSONB NOT NULL DEFAULT '[]'::jsonb,
      daily_claimed TEXT NOT NULL DEFAULT '',
      last_active_day TEXT NOT NULL DEFAULT '',
      streak INTEGER NOT NULL DEFAULT 0 CHECK (streak >= 0),
      best_score INTEGER NOT NULL DEFAULT 0 CHECK (best_score >= 0),
      plays INTEGER NOT NULL DEFAULT 0 CHECK (plays >= 0),
      display_name TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_played_at TIMESTAMPTZ,
      last_mission_id INTEGER,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)
    await pool.query(`CREATE TABLE IF NOT EXISTS game_schema_migrations (
      key TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)
    await pool.query("ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS daily_claimed TEXT NOT NULL DEFAULT ''")
    await pool.query("ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS last_active_day TEXT NOT NULL DEFAULT ''")
    await pool.query('ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS streak INTEGER NOT NULL DEFAULT 0 CHECK (streak >= 0)')
    await pool.query('ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS best_score INTEGER NOT NULL DEFAULT 0 CHECK (best_score >= 0)')
    await pool.query('ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS plays INTEGER NOT NULL DEFAULT 0 CHECK (plays >= 0)')
    await pool.query("ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS display_name TEXT NOT NULL DEFAULT ''")
    await pool.query('ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()')
    await pool.query('ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS last_played_at TIMESTAMPTZ')
    await pool.query('ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS last_mission_id INTEGER')
    await pool.query("ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS inventory JSONB NOT NULL DEFAULT '[\"central\"]'::jsonb")
    await pool.query("ALTER TABLE game_profiles ADD COLUMN IF NOT EXISTS equipped_style TEXT NOT NULL DEFAULT 'central'")
    const identityReset = await pool.query("SELECT 1 FROM game_schema_migrations WHERE key = 'identity-v2-reset'")
    if (!identityReset.rowCount) {
      await pool.query('DELETE FROM game_profiles')
      await pool.query("INSERT INTO game_schema_migrations (key) VALUES ('identity-v2-reset')")
      console.log('Recordes anteriores removidos para iniciar a identidade v2.')
    }
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
      const result = await pool.query('SELECT player_id AS "playerId", xp, coins, completed, daily_claimed AS "dailyClaimed", last_active_day AS "lastActiveDay", streak, best_score AS "bestScore", inventory, equipped_style AS "equippedStyle" FROM game_profiles WHERE player_id = $1', [match[1]])
      return respondJson(response, 200, result.rows[0] || null)
    }
    if (path === '/api/progress' && request.method === 'PUT') {
      const progress = await readBody(request)
      if (!validProgress(progress)) return respondJson(response, 400, { error: 'Progresso inválido.' })
      if (!databaseReady || !pool) return respondJson(response, 503, { error: 'Persistência ainda não configurada.' })
      const result = await pool.query(`INSERT INTO game_profiles (player_id, xp, coins, completed, daily_claimed, last_active_day, streak, best_score, inventory, equipped_style)
        VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, $9::jsonb, $10)
        ON CONFLICT (player_id) DO UPDATE SET xp = GREATEST(game_profiles.xp, EXCLUDED.xp), coins = EXCLUDED.coins, completed = EXCLUDED.completed, daily_claimed = EXCLUDED.daily_claimed, last_active_day = EXCLUDED.last_active_day, streak = GREATEST(game_profiles.streak, EXCLUDED.streak), best_score = GREATEST(game_profiles.best_score, EXCLUDED.best_score), inventory = EXCLUDED.inventory, equipped_style = EXCLUDED.equipped_style, updated_at = NOW()
        RETURNING player_id AS "playerId", xp, coins, completed, daily_claimed AS "dailyClaimed", last_active_day AS "lastActiveDay", streak, best_score AS "bestScore", inventory, equipped_style AS "equippedStyle"`, [progress.playerId, progress.xp, progress.coins, JSON.stringify([...new Set(progress.completed)].sort()), progress.dailyClaimed, progress.lastActiveDay, progress.streak, progress.bestScore, JSON.stringify([...new Set(['central', ...progress.inventory])]), progress.inventory.includes(progress.equippedStyle) ? progress.equippedStyle : 'central'])
      return respondJson(response, 200, result.rows[0])
    }
    if (path === '/api/plays' && request.method === 'POST') {
      const value = await readBody(request)
      const playerId = value && typeof value === 'object' ? (value as { playerId?: unknown }).playerId : null
      const missionId = value && typeof value === 'object' ? (value as { missionId?: unknown }).missionId : null
      if (typeof playerId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(playerId) || typeof missionId !== 'number' || !Number.isInteger(missionId) || missionId < 1 || missionId > 99) return respondJson(response, 400, { error: 'Partida inválida.' })
      if (!databaseReady || !pool) return respondJson(response, 503, { error: 'Persistência ainda não configurada.' })
      await pool.query(`INSERT INTO game_profiles (player_id, plays, last_played_at, last_mission_id) VALUES ($1, 1, NOW(), $2)
        ON CONFLICT (player_id) DO UPDATE SET plays = game_profiles.plays + 1, last_played_at = NOW(), last_mission_id = EXCLUDED.last_mission_id, updated_at = NOW()`, [playerId, missionId])
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
    if ((path === '/api/rewards/purchase' || path === '/api/rewards/equip') && request.method === 'POST') {
      const value = await readBody(request)
      const playerId = value && typeof value === 'object' ? (value as { playerId?: unknown }).playerId : null
      const itemId = value && typeof value === 'object' ? (value as { itemId?: unknown }).itemId : null
      if (typeof playerId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(playerId) || typeof itemId !== 'string' || !(itemId in rewards)) return respondJson(response, 400, { error: 'Item de personalização inválido.' })
      if (!databaseReady || !pool) return respondJson(response, 503, { error: 'Persistência ainda não configurada.' })
      const rewardId = itemId as RewardId
      const profile = await pool.query('SELECT xp, coins, inventory FROM game_profiles WHERE player_id = $1', [playerId])
      if (!profile.rowCount) return respondJson(response, 404, { error: 'Perfil ainda não encontrado. Jogue uma missão e tente novamente.' })
      const current = profile.rows[0] as { xp: number; coins: number; inventory: string[] }
      const inventory = Array.isArray(current.inventory) ? current.inventory : ['central']
      if (path === '/api/rewards/purchase') {
        if (inventory.includes(rewardId)) return respondJson(response, 200, { coins: current.coins, inventory, equippedStyle: rewardId, message: 'Este emblema já pertence à sua central.' })
        const reward = rewards[rewardId]
        if (Math.floor(current.xp / 700) + 1 < reward.level) return respondJson(response, 409, { error: `Este emblema pede o nível ${reward.level}.` })
        if (current.coins < reward.price) return respondJson(response, 409, { error: 'Ainda faltam moedas para este emblema.' })
        const updated = await pool.query(`UPDATE game_profiles SET coins = coins - $2, inventory = inventory || jsonb_build_array($3::text), equipped_style = $3, updated_at = NOW()
          WHERE player_id = $1 AND coins >= $2 RETURNING coins, inventory, equipped_style AS "equippedStyle"`, [playerId, reward.price, rewardId])
        if (!updated.rowCount) return respondJson(response, 409, { error: 'As moedas mudaram. Atualize a central e tente novamente.' })
        return respondJson(response, 200, { ...updated.rows[0], message: `${rewardId === 'central' ? 'Emblema equipado.' : 'Novo emblema desbloqueado.'}` })
      }
      if (!inventory.includes(rewardId)) return respondJson(response, 409, { error: 'Este emblema ainda não foi desbloqueado.' })
      const updated = await pool.query('UPDATE game_profiles SET equipped_style = $2, updated_at = NOW() WHERE player_id = $1 RETURNING coins, inventory, equipped_style AS "equippedStyle"', [playerId, rewardId])
      return respondJson(response, 200, { ...updated.rows[0], message: 'Emblema equipado na central.' })
    }
    if (path === '/api/records' && request.method === 'GET') {
      if (!databaseReady || !pool) return respondJson(response, 503, { error: 'Recordes ainda não configurados.' })
      const [summary, score, xp, plays, participants] = await Promise.all([
        pool.query(`SELECT COUNT(*)::int AS players, COUNT(*) FILTER (WHERE last_played_at > NOW() - INTERVAL '30 days')::int AS active_players, COALESCE(SUM(plays), 0)::int AS plays, COALESCE(SUM(jsonb_array_length(completed)), 0)::int AS completed FROM game_profiles`),
        pool.query(`SELECT player_id AS "playerId", display_name AS "displayName", best_score AS value FROM game_profiles WHERE best_score > 0 ORDER BY best_score DESC, updated_at ASC LIMIT 5`),
        pool.query(`SELECT player_id AS "playerId", display_name AS "displayName", xp AS value FROM game_profiles WHERE xp > 0 ORDER BY xp DESC, updated_at ASC LIMIT 5`),
        pool.query(`SELECT player_id AS "playerId", display_name AS "displayName", plays AS value FROM game_profiles WHERE plays > 0 ORDER BY plays DESC, updated_at ASC LIMIT 5`),
        pool.query(`SELECT player_id AS "playerId", display_name AS "displayName", xp, best_score AS "bestScore", plays, jsonb_array_length(completed) AS completed, created_at AS "createdAt", last_played_at AS "lastPlayedAt", last_mission_id AS "lastMissionId" FROM game_profiles WHERE display_name <> '' ORDER BY xp DESC, last_played_at DESC NULLS LAST, created_at ASC LIMIT 30`),
      ])
      return respondJson(response, 200, { summary: summary.rows[0], leaderboards: { score: score.rows, xp: xp.rows, plays: plays.rows }, participants: participants.rows })
    }
    await serveStatic(request, response)
  } catch (error) { console.error(error); respondJson(response, 500, { error: 'Erro interno.' }) }
}).listen(port, () => console.log(`Missão Imunidade disponível na porta ${port}.`))
