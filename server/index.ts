import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { extname, join, normalize } from 'node:path'
import { OAuth2Client } from 'google-auth-library'
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
type ActiveGame = { missionId: number; variantId: string | null; routeOptionOrder?: string[]; cycle: number; actions: number; cases: number; care: number; resources: number; clueIds: string[]; interventionIds: string[]; logs: unknown[]; urgentCare: boolean; pendingLabId: string | null; phase: 'investigation' | 'containment'; dailyMission: boolean; pilotStage: string; insightEnergy: number; hintUses: string[]; tacticalChoiceId: string | null }
type RunSummary = { playerId: string; missionId: number; variantId?: string | null; outcome: 'won' | 'lost'; score: number; xpEarned: number; coinsEarned: number; cycle: number; cases: number; care: number; riskUsed: boolean; competencies: Record<string, number> }

const port = Number(process.env.PORT || 80)
const dist = join(process.cwd(), 'dist')
const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined }) : null
const googleClientId = process.env.GOOGLE_CLIENT_ID || ''
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null
const adminEmails = new Set((process.env.ADMIN_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean))
const adminSessionSecret = process.env.ADMIN_SESSION_SECRET || ''
const adminEnabled = Boolean(googleClient && adminEmails.size && adminSessionSecret.length >= 32)
let databaseReady = false

const respondJson = (response: ServerResponse, status: number, value: unknown) => {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify(value))
}

const parseCookies = (request: IncomingMessage) => Object.fromEntries((request.headers.cookie || '').split(';').map((part) => part.trim().split('=').map(decodeURIComponent)).filter((pair) => pair.length === 2))
const signAdminSession = (email: string, expires: number) => { const payload = Buffer.from(JSON.stringify({ email, expires })).toString('base64url'); const signature = createHmac('sha256', adminSessionSecret).update(payload).digest('base64url'); return `${payload}.${signature}` }
const readAdminSession = (request: IncomingMessage) => {
  if (!adminEnabled) return null
  const token = parseCookies(request).missao_admin
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  const expected = createHmac('sha256', adminSessionSecret).update(payload).digest('base64url')
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
  try { const value = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { email?: string; expires?: number }; return value.email && value.expires && value.expires > Date.now() && adminEmails.has(value.email) ? value.email : null } catch { return null }
}

const validProgress = (value: unknown): value is Progress => {
  if (!value || typeof value !== 'object') return false
  const item = value as Progress
  return /^[a-zA-Z0-9-]{16,80}$/.test(item.playerId) && Number.isInteger(item.xp) && item.xp >= 0 && Number.isInteger(item.coins) && item.coins >= 0 && Array.isArray(item.completed) && item.completed.every((id) => Number.isInteger(id) && id > 0 && id <= 99) && typeof item.dailyClaimed === 'string' && /^$|^\d{4}-\d{2}-\d{2}$/.test(item.dailyClaimed) && typeof item.lastActiveDay === 'string' && /^$|^\d{4}-\d{2}-\d{2}$/.test(item.lastActiveDay) && Number.isInteger(item.streak) && item.streak >= 0 && item.streak <= 9999 && Number.isInteger(item.bestScore) && item.bestScore >= 0 && Array.isArray(item.inventory) && item.inventory.every((id) => typeof id === 'string' && id in rewards) && typeof item.equippedStyle === 'string' && item.equippedStyle in rewards
}

const validPlayerId = (value: unknown): value is string => typeof value === 'string' && /^[a-zA-Z0-9-]{16,80}$/.test(value)
const validActiveGame = (value: unknown): value is ActiveGame => {
  if (!value || typeof value !== 'object') return false
  const game = value as ActiveGame
  return Number.isInteger(game.missionId) && game.missionId > 0 && game.missionId <= 99 && (game.variantId === null || typeof game.variantId === 'string') && (game.routeOptionOrder === undefined || (Array.isArray(game.routeOptionOrder) && game.routeOptionOrder.length <= 3 && game.routeOptionOrder.every((item) => typeof item === 'string' && item.length <= 100) && new Set(game.routeOptionOrder).size === game.routeOptionOrder.length)) && Number.isInteger(game.cycle) && game.cycle >= 1 && game.cycle <= 99 && Number.isInteger(game.actions) && game.actions >= 0 && game.actions <= 3 && Number.isInteger(game.cases) && game.cases >= 0 && game.cases <= 1_000_000 && Number.isInteger(game.care) && game.care >= 0 && game.care <= 100 && Number.isInteger(game.resources) && game.resources >= 0 && game.resources <= 10 && Array.isArray(game.clueIds) && game.clueIds.every((item) => typeof item === 'string' && item.length <= 100) && Array.isArray(game.interventionIds) && game.interventionIds.every((item) => typeof item === 'string' && item.length <= 100) && Array.isArray(game.logs) && game.logs.length <= 100 && typeof game.urgentCare === 'boolean' && (game.pendingLabId === null || typeof game.pendingLabId === 'string') && (game.phase === 'investigation' || game.phase === 'containment') && typeof game.dailyMission === 'boolean' && typeof game.pilotStage === 'string' && game.pilotStage.length <= 40 && Number.isInteger(game.insightEnergy) && game.insightEnergy >= 0 && game.insightEnergy <= 4 && Array.isArray(game.hintUses) && game.hintUses.every((item) => typeof item === 'string' && item.length <= 100) && (game.tacticalChoiceId === null || typeof game.tacticalChoiceId === 'string')
}
const validRun = (value: unknown): value is RunSummary => {
  if (!value || typeof value !== 'object') return false
  const run = value as RunSummary
  return validPlayerId(run.playerId) && Number.isInteger(run.missionId) && run.missionId > 0 && run.missionId <= 99 && (run.variantId === undefined || run.variantId === null || typeof run.variantId === 'string') && (run.outcome === 'won' || run.outcome === 'lost') && Number.isInteger(run.score) && run.score >= 0 && run.score <= 100_000 && Number.isInteger(run.xpEarned) && run.xpEarned >= 0 && run.xpEarned <= 10_000 && Number.isInteger(run.coinsEarned) && run.coinsEarned >= 0 && run.coinsEarned <= 10_000 && Number.isInteger(run.cycle) && run.cycle >= 1 && run.cycle <= 99 && Number.isInteger(run.cases) && run.cases >= 0 && run.cases <= 1_000_000 && Number.isInteger(run.care) && run.care >= 0 && run.care <= 100 && typeof run.riskUsed === 'boolean' && !!run.competencies && typeof run.competencies === 'object'
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
    await pool.query(`CREATE TABLE IF NOT EXISTS active_games (
      player_id TEXT PRIMARY KEY REFERENCES game_profiles(player_id) ON DELETE CASCADE,
      state JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)
    await pool.query(`CREATE TABLE IF NOT EXISTS game_runs (
      id BIGSERIAL PRIMARY KEY,
      player_id TEXT NOT NULL REFERENCES game_profiles(player_id) ON DELETE CASCADE,
      mission_id INTEGER NOT NULL,
      variant_id TEXT,
      outcome TEXT NOT NULL CHECK (outcome IN ('won', 'lost')),
      score INTEGER NOT NULL DEFAULT 0,
      xp_earned INTEGER NOT NULL DEFAULT 0,
      coins_earned INTEGER NOT NULL DEFAULT 0,
      cycle INTEGER NOT NULL,
      cases INTEGER NOT NULL,
      care INTEGER NOT NULL,
      risk_used BOOLEAN NOT NULL DEFAULT FALSE,
      competencies JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)
    await pool.query('CREATE INDEX IF NOT EXISTS game_runs_player_created_idx ON game_runs (player_id, created_at DESC)')
    await pool.query(`CREATE TABLE IF NOT EXISTS auth_identities (
      provider TEXT NOT NULL,
      provider_subject TEXT NOT NULL,
      player_id TEXT NOT NULL REFERENCES game_profiles(player_id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_signed_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (provider, provider_subject),
      UNIQUE (player_id, provider)
    )`)
    await pool.query('ALTER TABLE auth_identities ADD COLUMN IF NOT EXISTS email TEXT')
    await pool.query('ALTER TABLE auth_identities ADD COLUMN IF NOT EXISTS email_consent_at TIMESTAMPTZ')
    await pool.query(`CREATE TABLE IF NOT EXISTS player_visits (
      id BIGSERIAL PRIMARY KEY,
      player_id TEXT REFERENCES game_profiles(player_id) ON DELETE SET NULL,
      session_id TEXT NOT NULL,
      visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      user_agent TEXT NOT NULL DEFAULT '',
      UNIQUE (session_id)
    )`)
    await pool.query('CREATE INDEX IF NOT EXISTS player_visits_player_time_idx ON player_visits (player_id, visited_at DESC)')
    await pool.query(`CREATE TABLE IF NOT EXISTS mission_events (
      id BIGSERIAL PRIMARY KEY,
      event_id TEXT NOT NULL UNIQUE,
      run_id TEXT NOT NULL,
      player_id TEXT REFERENCES game_profiles(player_id) ON DELETE SET NULL,
      mission_id INTEGER NOT NULL,
      event_type TEXT NOT NULL,
      stage TEXT NOT NULL DEFAULT '',
      detail JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)
    await pool.query('CREATE INDEX IF NOT EXISTS mission_events_mission_time_idx ON mission_events (mission_id, created_at DESC)')
    await pool.query('CREATE INDEX IF NOT EXISTS mission_events_run_idx ON mission_events (run_id, created_at)')
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
  const contentType: Record<string, string> = { '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.html': 'text/html' }
  response.writeHead(200, { 'Content-Type': `${contentType[extname(file)] || 'application/octet-stream'}; charset=utf-8` })
  createReadStream(file).pipe(response)
}

await initDatabase()
createServer(async (request, response) => {
  try {
    const path = request.url?.split('?')[0] || '/'
    if (path === '/api/health') return respondJson(response, 200, { ok: true, persistence: databaseReady ? 'postgres' : 'local' })
    if (path === '/api/auth/config' && request.method === 'GET') return respondJson(response, 200, { googleEnabled: Boolean(googleClient), googleClientId: googleClientId || null, adminEnabled })
    if (path === '/api/telemetry/visit' && request.method === 'POST') {
      if (!databaseReady || !pool) return respondJson(response, 204, null)
      const value = await readBody(request)
      const playerId = value && typeof value === 'object' ? (value as { playerId?: unknown }).playerId : null
      const sessionId = value && typeof value === 'object' ? (value as { sessionId?: unknown }).sessionId : null
      if (!validPlayerId(playerId) || typeof sessionId !== 'string' || !/^[a-zA-Z0-9-]{16,100}$/.test(sessionId)) return respondJson(response, 400, { error: 'Visita inválida.' })
      await pool.query(`INSERT INTO game_profiles (player_id) VALUES ($1) ON CONFLICT (player_id) DO NOTHING`, [playerId])
      await pool.query(`INSERT INTO player_visits (player_id, session_id, user_agent) VALUES ($1, $2, $3) ON CONFLICT (session_id) DO NOTHING`, [playerId, sessionId, String(request.headers['user-agent'] || '').slice(0, 300)])
      return respondJson(response, 204, null)
    }
    if (path === '/api/telemetry/event' && request.method === 'POST') {
      if (!databaseReady || !pool) return respondJson(response, 204, null)
      const value = await readBody(request)
      const body = value && typeof value === 'object' ? value as Record<string, unknown> : {}
      const { playerId, eventId, runId, eventType, stage, missionId, detail } = body
      const validToken = (item: unknown, max = 100) => typeof item === 'string' && /^[a-zA-Z0-9:_-]+$/.test(item) && item.length <= max
      const validStages = new Set(['called', 'field', 'map', 'board', 'tactical', 'response', 'diagnosis', 'result'])
      const validTypes = new Set(['stage', 'hint', 'tactical', 'diagnosis', 'exit'])
      if (!validPlayerId(playerId) || !validToken(eventId) || !validToken(runId) || !validTypes.has(String(eventType)) || !Number.isInteger(missionId) || Number(missionId) < 1 || Number(missionId) > 99 || (stage !== '' && !validStages.has(String(stage)))) return respondJson(response, 400, { error: 'Evento inválido.' })
      const safeDetail = detail && typeof detail === 'object' && JSON.stringify(detail).length <= 1000 ? detail : {}
      await pool.query('INSERT INTO game_profiles (player_id) VALUES ($1) ON CONFLICT (player_id) DO NOTHING', [playerId])
      await pool.query(`INSERT INTO mission_events (event_id, run_id, player_id, mission_id, event_type, stage, detail) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb) ON CONFLICT (event_id) DO NOTHING`, [eventId, runId, playerId, missionId, eventType, stage || '', JSON.stringify(safeDetail)])
      return respondJson(response, 204, null)
    }
    if (path === '/api/admin/google' && request.method === 'POST') {
      if (!adminEnabled || !googleClient) return respondJson(response, 404, { error: 'Painel administrativo não configurado.' })
      const value = await readBody(request)
      const credential = value && typeof value === 'object' ? (value as { credential?: unknown }).credential : null
      if (typeof credential !== 'string' || credential.length > 5000) return respondJson(response, 400, { error: 'Credencial inválida.' })
      const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: googleClientId })
      const payload = ticket.getPayload()
      const email = payload?.email?.toLowerCase()
      if (!email || !payload?.email_verified || !adminEmails.has(email)) return respondJson(response, 403, { error: 'Esta conta não possui acesso administrativo.' })
      const expires = Date.now() + 8 * 60 * 60 * 1000
      const token = signAdminSession(email, expires)
      const secure = request.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production' ? '; Secure' : ''
      response.setHeader('Set-Cookie', `missao_admin=${encodeURIComponent(token)}; HttpOnly${secure}; SameSite=Strict; Path=/; Max-Age=28800`)
      return respondJson(response, 200, { ok: true })
    }
    if (path === '/api/admin/session' && request.method === 'GET') return respondJson(response, 200, { authenticated: Boolean(readAdminSession(request)) })
    if (path === '/api/admin/stats' && request.method === 'GET') {
      const admin = readAdminSession(request)
      if (!admin || !databaseReady || !pool) return respondJson(response, 401, { error: 'Acesso administrativo necessário.' })
      const [overview, players, missions, funnel] = await Promise.all([
        pool.query(`SELECT
          (SELECT COUNT(*)::int FROM player_visits) AS visits,
          (SELECT COUNT(*)::int FROM player_visits WHERE visited_at > NOW() - INTERVAL '24 hours') AS visits_24h,
          (SELECT COUNT(DISTINCT player_id)::int FROM player_visits WHERE visited_at > NOW() - INTERVAL '30 days') AS active_30d,
          (SELECT COUNT(*)::int FROM game_profiles) AS players,
          (SELECT COUNT(*)::int FROM auth_identities WHERE provider = 'google') AS google_links,
          (SELECT COUNT(*)::int FROM game_runs) AS runs`),
        pool.query(`SELECT p.display_name AS "displayName", a.email, p.xp, p.coins, p.plays, p.best_score AS "bestScore", jsonb_array_length(p.completed) AS completed, p.created_at AS "createdAt", p.last_played_at AS "lastPlayedAt", p.last_mission_id AS "lastMissionId", COUNT(v.id)::int AS visits
          FROM game_profiles p LEFT JOIN auth_identities a ON a.player_id = p.player_id AND a.provider = 'google' LEFT JOIN player_visits v ON v.player_id = p.player_id
          GROUP BY p.player_id, a.email ORDER BY p.last_played_at DESC NULLS LAST, p.created_at DESC LIMIT 200`),
        pool.query(`SELECT mission_id AS "missionId", COUNT(*)::int AS runs, COUNT(*) FILTER (WHERE outcome = 'won')::int AS wins, ROUND(AVG(score))::int AS "averageScore" FROM game_runs GROUP BY mission_id ORDER BY mission_id`),
        pool.query(`SELECT mission_id AS "missionId",
          COUNT(DISTINCT run_id) FILTER (WHERE event_type = 'stage' AND stage = 'called')::int AS starts,
          COUNT(DISTINCT run_id) FILTER (WHERE event_type = 'stage' AND stage = 'result')::int AS finishes,
          COUNT(DISTINCT run_id) FILTER (WHERE event_type = 'hint')::int AS "hintRuns",
          COUNT(DISTINCT run_id) FILTER (WHERE event_type = 'tactical')::int AS "tacticalRuns",
          COUNT(DISTINCT run_id) FILTER (WHERE event_type = 'diagnosis')::int AS "diagnosisRuns"
          FROM mission_events GROUP BY mission_id ORDER BY mission_id`),
      ])
      return respondJson(response, 200, { admin, overview: overview.rows[0], players: players.rows, missions: missions.rows, funnel: funnel.rows })
    }
    const authStatusMatch = path.match(/^\/api\/auth\/status\/([a-zA-Z0-9-]{16,80})$/)
    if (authStatusMatch && request.method === 'GET') {
      if (!databaseReady || !pool || !googleClient) return respondJson(response, 200, { googleLinked: false })
      const playerId = authStatusMatch[1]
      if (!validPlayerId(playerId)) return respondJson(response, 400, { error: 'Identidade de jogador inválida.' })
      const linked = await pool.query('SELECT email FROM auth_identities WHERE provider = $1 AND player_id = $2 LIMIT 1', ['google', playerId])
      return respondJson(response, 200, { googleLinked: Boolean(linked.rowCount), emailRecorded: Boolean(linked.rows[0]?.email) })
    }
    if (path === '/api/auth/google' && request.method === 'POST') {
      if (!databaseReady || !pool) return respondJson(response, 503, { error: 'A persistência precisa estar ativa para vincular uma conta.' })
      if (!googleClient) return respondJson(response, 503, { error: 'O acesso com Google ainda não foi configurado nesta central.' })
      const value = await readBody(request)
      const credential = value && typeof value === 'object' ? (value as { credential?: unknown }).credential : null
      const requestedPlayerId = value && typeof value === 'object' ? (value as { playerId?: unknown }).playerId : null
      const displayName = value && typeof value === 'object' ? (value as { displayName?: unknown }).displayName : ''
      const emailConsent = value && typeof value === 'object' ? (value as { emailConsent?: unknown }).emailConsent : false
      if (typeof credential !== 'string' || credential.length > 5000 || !validPlayerId(requestedPlayerId) || typeof displayName !== 'string' || emailConsent !== true) return respondJson(response, 400, { error: 'Confirme o uso do e-mail para vincular a jornada.' })
      const normalizedName = displayName.trim().replace(/\s+/g, ' ')
      if (normalizedName.length > 60) return respondJson(response, 400, { error: 'Nome de exibição inválido.' })
      const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: googleClientId })
      const googlePayload = ticket.getPayload()
      const subject = googlePayload?.sub
      const email = googlePayload?.email?.toLowerCase()
      if (!subject || !email || !googlePayload?.email_verified) return respondJson(response, 401, { error: 'Não foi possível confirmar a identidade Google.' })
      const existing = await pool.query('SELECT player_id FROM auth_identities WHERE provider = $1 AND provider_subject = $2', ['google', subject])
      const playerId = existing.rowCount ? existing.rows[0].player_id as string : requestedPlayerId
      const currentLink = !existing.rowCount ? await pool.query('SELECT provider_subject FROM auth_identities WHERE provider = $1 AND player_id = $2', ['google', playerId]) : null
      if (currentLink?.rowCount && currentLink.rows[0].provider_subject !== subject) return respondJson(response, 409, { error: 'Esta jornada já está vinculada a outra conta Google. Use essa conta para entrar.' })
      await pool.query(`INSERT INTO game_profiles (player_id, display_name) VALUES ($1, $2)
        ON CONFLICT (player_id) DO UPDATE SET display_name = CASE WHEN game_profiles.display_name = '' AND EXCLUDED.display_name <> '' THEN EXCLUDED.display_name ELSE game_profiles.display_name END, updated_at = NOW()`, [playerId, normalizedName])
      if (existing.rowCount) await pool.query('UPDATE auth_identities SET last_signed_in_at = NOW(), email = $3, email_consent_at = COALESCE(email_consent_at, NOW()) WHERE provider = $1 AND provider_subject = $2', ['google', subject, email])
      else await pool.query('INSERT INTO auth_identities (provider, provider_subject, player_id, email, email_consent_at) VALUES ($1, $2, $3, $4, NOW())', ['google', subject, playerId, email])
      const profile = await pool.query('SELECT player_id AS "playerId", xp, coins, completed, daily_claimed AS "dailyClaimed", last_active_day AS "lastActiveDay", streak, best_score AS "bestScore", inventory, equipped_style AS "equippedStyle", display_name AS "displayName" FROM game_profiles WHERE player_id = $1', [playerId])
      return respondJson(response, 200, { profile: profile.rows[0], linked: !existing.rowCount })
    }
    const activeMatch = path.match(/^\/api\/active-game\/([a-zA-Z0-9-]{16,80})$/)
    if (activeMatch && request.method === 'GET') {
      if (!databaseReady || !pool) return respondJson(response, 503, { error: 'Persistência ainda não configurada.' })
      const result = await pool.query('SELECT state, updated_at AS "updatedAt" FROM active_games WHERE player_id = $1', [activeMatch[1]])
      return respondJson(response, 200, result.rows[0] || null)
    }
    if (path === '/api/active-game' && request.method === 'PUT') {
      if (!databaseReady || !pool) return respondJson(response, 503, { error: 'Persistência ainda não configurada.' })
      const value = await readBody(request)
      const playerId = value && typeof value === 'object' ? (value as { playerId?: unknown }).playerId : null
      const state = value && typeof value === 'object' ? (value as { state?: unknown }).state : null
      if (!validPlayerId(playerId) || !validActiveGame(state)) return respondJson(response, 400, { error: 'Partida em andamento inválida.' })
      await pool.query('INSERT INTO game_profiles (player_id) VALUES ($1) ON CONFLICT (player_id) DO NOTHING', [playerId])
      await pool.query(`INSERT INTO active_games (player_id, state) VALUES ($1, $2::jsonb)
        ON CONFLICT (player_id) DO UPDATE SET state = EXCLUDED.state, updated_at = NOW()`, [playerId, JSON.stringify(state)])
      return respondJson(response, 204, null)
    }
    if (activeMatch && request.method === 'DELETE') {
      if (!databaseReady || !pool) return respondJson(response, 503, { error: 'Persistência ainda não configurada.' })
      await pool.query('DELETE FROM active_games WHERE player_id = $1', [activeMatch[1]])
      return respondJson(response, 204, null)
    }
    if (path === '/api/runs' && request.method === 'POST') {
      if (!databaseReady || !pool) return respondJson(response, 503, { error: 'Persistência ainda não configurada.' })
      const run = await readBody(request)
      if (!validRun(run)) return respondJson(response, 400, { error: 'Resumo de partida inválido.' })
      await pool.query('INSERT INTO game_profiles (player_id) VALUES ($1) ON CONFLICT (player_id) DO NOTHING', [run.playerId])
      await pool.query(`INSERT INTO game_runs (player_id, mission_id, variant_id, outcome, score, xp_earned, coins_earned, cycle, cases, care, risk_used, competencies)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb)`, [run.playerId, run.missionId, run.variantId || null, run.outcome, run.score, run.xpEarned, run.coinsEarned, run.cycle, run.cases, run.care, run.riskUsed, JSON.stringify(run.competencies)])
      await pool.query('DELETE FROM active_games WHERE player_id = $1', [run.playerId])
      return respondJson(response, 204, null)
    }
    const journeyMatch = path.match(/^\/api\/journey\/([a-zA-Z0-9-]{16,80})$/)
    if (journeyMatch && request.method === 'GET') {
      if (!databaseReady || !pool) return respondJson(response, 503, { error: 'Persistência ainda não configurada.' })
      const [profile, runs, summary] = await Promise.all([
        pool.query('SELECT display_name AS "displayName", xp, coins, completed, streak, best_score AS "bestScore", created_at AS "createdAt", last_played_at AS "lastPlayedAt" FROM game_profiles WHERE player_id = $1', [journeyMatch[1]]),
        pool.query('SELECT mission_id AS "missionId", variant_id AS "variantId", outcome, score, xp_earned AS "xpEarned", coins_earned AS "coinsEarned", cycle, cases, care, risk_used AS "riskUsed", competencies, created_at AS "createdAt" FROM game_runs WHERE player_id = $1 ORDER BY created_at DESC LIMIT 12', [journeyMatch[1]]),
        pool.query(`SELECT COUNT(*)::int AS total_runs, COUNT(*) FILTER (WHERE outcome = 'won')::int AS wins, COALESCE(AVG(score), 0)::int AS average_score, COALESCE(SUM(xp_earned), 0)::int AS earned_xp, COALESCE(SUM(coins_earned), 0)::int AS earned_coins FROM game_runs WHERE player_id = $1`, [journeyMatch[1]]),
      ])
      return respondJson(response, 200, { profile: profile.rows[0] || null, summary: summary.rows[0], runs: runs.rows })
    }
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
        pool.query(`SELECT display_name AS "displayName", best_score AS value FROM game_profiles WHERE best_score > 0 ORDER BY best_score DESC, updated_at ASC LIMIT 5`),
        pool.query(`SELECT display_name AS "displayName", xp AS value FROM game_profiles WHERE xp > 0 ORDER BY xp DESC, updated_at ASC LIMIT 5`),
        pool.query(`SELECT display_name AS "displayName", plays AS value FROM game_profiles WHERE plays > 0 ORDER BY plays DESC, updated_at ASC LIMIT 5`),
        pool.query(`SELECT display_name AS "displayName", xp, best_score AS "bestScore", plays, jsonb_array_length(completed) AS completed, created_at AS "createdAt", last_played_at AS "lastPlayedAt", last_mission_id AS "lastMissionId" FROM game_profiles WHERE display_name <> '' ORDER BY xp DESC, last_played_at DESC NULLS LAST, created_at ASC LIMIT 30`),
      ])
      return respondJson(response, 200, { summary: summary.rows[0], leaderboards: { score: score.rows, xp: xp.rows, plays: plays.rows }, participants: participants.rows })
    }
    await serveStatic(request, response)
  } catch (error) { console.error(error); respondJson(response, 500, { error: 'Erro interno.' }) }
}).listen(port, () => console.log(`Missão Imunidade disponível na porta ${port}.`))
