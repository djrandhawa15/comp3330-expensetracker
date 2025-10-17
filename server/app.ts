// server/app.ts
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { expensesRoute } from './routes/expenses'
import { authRoute } from './auth/kinde'
import { secureRoute } from './routes/secure'
import { uploadRoute } from './routes/upload'
import type { AppBindings } from './types'

export const app = new Hono<AppBindings>()

app.use('*', logger())
app.use('*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.get('/', (c) => c.json({ message: 'OK' }))
app.get('/health', (c) => c.json({ status: 'healthy' }))

app.route('/api/auth', authRoute)
app.route('/api/secure', secureRoute)
app.route('/api/upload', uploadRoute)      // ⬅ presign route
app.route('/api/expenses', expensesRoute)

app.onError((err, c) => {
  console.error('🔥 Hono error:', err)
  return c.json({ error: 'Internal Server Error', detail: String(err?.message ?? err) }, 500)
})
