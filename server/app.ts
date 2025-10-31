// server/app.ts
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { getMimeType } from 'hono/utils/mime' // ⬅ for content-type
// ❌ remove: import { serveStatic } from 'hono/serve-static'

import { expensesRoute } from './routes/expenses'
import { authRoute } from './auth/kinde'
import { secureRoute } from './routes/secure'
import { uploadRoute } from './routes/upload'

export const app = new Hono()

app.use('*', logger())
app.use('*', cors({
  origin: process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:5173',
  allowMethods: ['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
}))

// ---------- API routes FIRST ----------
app.route('/api/auth', authRoute)
app.route('/api/secure', secureRoute)
app.route('/api/upload', uploadRoute)
app.route('/api/expenses', expensesRoute)

// Health
app.get('/health', (c) => c.json({ status: 'healthy' }))

// ---------- Static files + SPA fallback (no serveStatic) ----------
app.use('*', async (c, next) => {
  const url = new URL(c.req.url)
  const p = url.pathname

  // never intercept API
  if (p.startsWith('/api')) return next()

  // map / → /index.html
  const relPath = p === '/' ? '/index.html' : p
  const filePath = `./server/public${relPath}`

  try {
    const file = Bun.file(filePath)
    if (await file.exists()) {
      const type = getMimeType(filePath) ?? 'application/octet-stream'
      return new Response(file, { headers: { 'Content-Type': type } })
    }
  } catch {
    // ignore and fall through to SPA fallback
  }

  // SPA fallback → serve index.html
  const index = Bun.file('./server/public/index.html')
  return c.html(await index.text())
})

// Error handler
app.onError((err, c) => {
  console.error('🔥 Hono error:', err)
  return c.json({ error: 'Internal Server Error', detail: String(err?.message ?? err) }, 500)
})
