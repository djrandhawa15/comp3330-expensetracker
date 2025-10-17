import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

type Expense = { id: number; title: string; amount: number; fileUrl?: string | null }

export function ExpensesList() {
  const qc = useQueryClient()

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => api<{ expenses: Expense[] }>('/api/expenses'),
  })

  const del = useMutation({
    mutationFn: async (id: number) => {
      if (!Number.isFinite(id)) throw new Error('Invalid id')
      await api(`/api/expenses/${id}`, { method: 'DELETE' })
      return id
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['expenses'] })
      const previous = qc.getQueryData<{ expenses: Expense[] }>(['expenses'])
      if (previous) {
        qc.setQueryData(['expenses'], {
          expenses: previous.expenses.filter((e) => e.id !== id),
        })
      }
      return { previous }
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(['expenses'], ctx.previous)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['expenses'] })
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-4 text-sm text-gray-500">
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        Loading expenses…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <p>Could not load expenses. Please try again.</p>
        <button
          className="mt-2 rounded border border-red-300 px-3 py-1 text-xs"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? 'Refreshing…' : 'Retry'}
        </button>
        <div className="mt-1 text-xs">{(error as Error)?.message}</div>
      </div>
    )
  }

  const items = data?.expenses ?? []
  if (items.length === 0) {
    return (
      <div className="rounded border bg-white p-6 text-center shadow-sm">
        <h3 className="text-lg font-semibold">No expenses yet</h3>
        <p className="mt-2 text-sm text-gray-500">Start by adding your first expense using the form above.</p>
      </div>
    )
  }

  return (
    <ul className="mt-4 space-y-2">
      {items.map((e) => {
        const isTemp = e.id < 0 // optimistic placeholder
        return (
          <li key={e.id} className="flex justify-between rounded border p-3 bg-white">
            <div className="flex flex-col">
              <span className="font-medium">{e.title}</span>
              <span className="text-sm text-gray-500">${e.amount}</span>
            </div>
            <div className="flex items-center gap-3">
              {e.fileUrl && (
                <a
                  href={e.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  Download
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this expense?')) del.mutate(e.id)
                }}
                disabled={del.isPending || isTemp}
                className="text-sm text-red-600 underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {del.isPending ? 'Removing…' : 'Delete'}
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
