// server/app.ts
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { expensesRoute } from './routes/expenses'

// ⬇️ ADD
import { authRoute } from './auth/kinde'
import { secureRoute } from './routes/secure'

export const app = new Hono()

app.use('*', logger())
app.use('*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.get('/', (c) => c.json({ message: 'OK' }))
app.get('/health', (c) => c.json({ status: 'healthy' }))

// ⬇️ ADD: server-driven auth endpoints
app.route('/api/auth', authRoute)
app.route('/api/secure', secureRoute)

// Existing
app.route('/api/expenses', expensesRoute)
// server/app.ts (after routes)
app.onError((err, c) => {
  console.error('🔥 Hono error:', err)
  return c.json({ error: 'Internal Server Error', detail: String(err?.message ?? err) }, 500)
})
