// frontend/src/lib/api.ts
export async function api<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, { credentials: 'include', ...init })
  if (res.status === 401) {
    // No valid session: go through server-side login
    window.location.href = '/api/auth/login'
    throw new Error('Unauthorized: redirecting to login')
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}
