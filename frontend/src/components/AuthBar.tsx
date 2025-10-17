import * as React from 'react'

export function AuthBar() {
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
  }, [])

  return (
    <div className="flex items-center gap-3 text-sm">
      {user ? (
        <>
          <span className="text-gray-500">
            {user.email ?? user.sub}
          </span>
          <a className="rounded bg-black px-3 py-1 text-white" href="/api/auth/logout">
            Logout
          </a>
        </>
      ) : (
        <a className="rounded bg-black px-3 py-1 text-white" href="/api/auth/login">
          Login
        </a>
      )}
    </div>
  )
}
