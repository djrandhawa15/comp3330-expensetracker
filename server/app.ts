// server/app.ts
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'        // <-- add this
import { expensesRoute } from './routes/expenses'

export const app = new Hono()

app.use('*', logger())
// allow the Vite origin during dev
app.use('*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.get('/', (c) => c.json({ message: 'OK' }))
app.get('/health', (c) => c.json({ status: 'healthy' }))

app.route('/api/expenses', expensesRoute)
