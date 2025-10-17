// frontend/src/routes/expenses.list.tsx
import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

type Expense = {
  id: number
  title: string
  amount: number
  fileUrl?: string | null
}

export default function ExpensesListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const json = await api<{ expenses: Expense[] }>('/api/expenses')
      return json.expenses
    },
  })

  if (isLoading) return <p>Loading…</p>
  if (error) return <p className="text-red-600">Failed: {(error as Error).message}</p>

  const items = data || []

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Expenses</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">No expenses yet.</p>
      ) : (
        <ul className="divide-y">
          {items.map((e) => (
            <li key={e.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{e.title}</div>
                <div className="text-sm text-gray-500">${e.amount}</div>
              </div>
              <div className="flex items-center gap-3">
                {e.fileUrl ? (
                  <a className="text-blue-600 underline" href={e.fileUrl} target="_blank" rel="noreferrer">
                    Download
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">No receipt</span>
                )}
                <Link
                  to="/expenses/$id"
                  params={{ id: String(e.id) }}
                  className="rounded bg-black px-3 py-1 text-white"
                >
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
