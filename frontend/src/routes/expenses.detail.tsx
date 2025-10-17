// src/routes/expenses.detail.tsx
import * as React from 'react'
import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

type Expense = { id: number; title: string; amount: number }
type ExpenseResponse = { expense?: Expense; error?: string }

// In dev you can call API directly or via proxy:
const API = import.meta.env.DEV ? 'http://localhost:3000/api' : '/api'
// const API = '/api'

export default function ExpenseDetailPage() {
  const { id } = useParams({ from: '/expenses/$id' }) // param is a string
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<ExpenseResponse>({
    queryKey: ['expense', id],
    queryFn: async () => {
      const res = await fetch(`${API}/expenses/${id}`)
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status}: ${txt || res.statusText}`)
      }
      return res.json()
    },
    staleTime: 5_000,
    retry: 1,
  })

  if (isLoading) return <p className="p-6 text-sm text-muted-foreground">Loading…</p>
  if (isError)
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">Failed: {(error as Error).message}</p>
        <button className="mt-3 rounded border px-3 py-1" onClick={() => refetch()} disabled={isFetching}>
          Retry
        </button>
      </div>
    )

  const item = data?.expense
  if (!item) return <p className="p-6 text-sm text-muted-foreground">Expense not found.</p>

  return (
    <section className="mx-auto max-w-3xl p-6">
      <div className="rounded border bg-background text-foreground p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">{item.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">Amount</p>
        <p className="text-lg tabular-nums">#{item.amount}</p>
      </div>
    </section>
  )
}
