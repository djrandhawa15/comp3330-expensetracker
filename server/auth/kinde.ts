// server/auth/kinde.ts
import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import type { SessionManager } from '@kinde-oss/kinde-typescript-sdk'
import { createKindeServerClient, GrantType } from '@kinde-oss/kinde-typescript-sdk'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_ISSUER_URL!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URI!,
  logoutRedirectURL: FRONTEND_URL,
})

// Minimal cookie-backed SessionManager for Hono
export function sessionFromHono(c: any): SessionManager {
  return {
    async getSessionItem(key: string) {
      return getCookie(c, key) ?? null
    },
    async setSessionItem(key: string, value: unknown) {
      setCookie(c, key, String(value), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      })
    },
    async removeSessionItem(key: string) {
      deleteCookie(c, key, { path: '/' })
    },
    async destroySession() {
      for (const k of ['access_token', 'id_token', 'refresh_token', 'session']) {
        deleteCookie(c, k, { path: '/' })
      }
    },
  }
}

export const authRoute = new Hono()
  // Start login
  .get('/login', async (c) => {
    try {
      const session = sessionFromHono(c)
      const url = await kindeClient.login(session)
      return c.redirect(url.toString())
    } catch (e: any) {
      console.error('Login error:', e)
      return c.json({ error: 'Login failed', detail: e?.message }, 500)
    }
  })
  // OAuth callback
  .get('/callback', async (c) => {
    try {
      const session = sessionFromHono(c)
      await kindeClient.handleRedirectToApp(session, new URL(c.req.url))
      return c.redirect(`${FRONTEND_URL}/expenses`)
    } catch (e: any) {
      console.error('Callback error:', e)
      return c.json({ error: 'Callback failed', detail: e?.message }, 500)
    }
  })
  // Logout
  .get('/logout', async (c) => {
    try {
      const session = sessionFromHono(c)
      await kindeClient.logout(session)
      return c.redirect(FRONTEND_URL)
    } catch (e: any) {
      console.error('Logout error:', e)
      return c.json({ error: 'Logout failed', detail: e?.message }, 500)
    }
  })
  // Current user
  .get('/me', async (c) => {
    try {
      const session = sessionFromHono(c)
      const profile = await kindeClient.getUserProfile(session)
      return c.json({ user: profile })
    } catch {
      return c.json({ user: null })
    }
  })
