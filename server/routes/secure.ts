import { Hono } from 'hono'
import { requireAuth } from '../auth/requireAuth'

// 👇 Tell Hono this route has a "user" variable in the context
export const secureRoute = new Hono<{ Variables: { user: any } }>()
  .get('/profile', async (c) => {
    const err = await requireAuth(c)
    if (err) return err
    const user = c.get('user')  // ✅ now typed
    return c.json({ user })
  })
