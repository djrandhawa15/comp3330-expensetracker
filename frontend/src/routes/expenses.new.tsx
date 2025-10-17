// /frontend/src/routes/expenses.new.tsx
import { useState, type FormEvent } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export default function ExpenseNewPage() {
  const router = useRouter()
  const qc = useQueryClient()

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState<number | ''>('')
  const [error, setError] = useState<string | null>(null)

  const createExpense = useMutation({
    mutationFn: async (payload: { title: string; amount: number }) => {
      return api<{ expense: { id: number; title: string; amount: number } }>('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expenses'] })
      router.navigate({ to: '/expenses' })
    },
    onError: (e: any) => {
      setError(e.message ?? 'Failed to create expense')
    },
  })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const t = title.trim()
    const n = typeof amount === 'number' ? amount : Number(amount)
    if (t.length < 3) return setError('Title must be at least 3 characters')
    if (!Number.isFinite(n) || n <= 0) return setError('Amount must be greater than 0')
    createExpense.mutate({ title: t, amount: n })
  }

  return (
    <section className="mx-auto max-w-3xl p-6">
      <form onSubmit={onSubmit} className="space-y-3 rounded border bg-background p-6">
        <h2 className="text-xl font-semibold">New Expense</h2>

        <label className="block">
          <span className="text-sm text-muted-foreground">Title</span>
          <input
            className="mt-1 w-full rounded-md border border-input bg-background p-2 text-sm"
            placeholder="Coffee"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm text-muted-foreground">Amount</span>
          <input
            className="mt-1 w-52 rounded-md border border-input bg-background p-2 text-sm"
            type="number"
            placeholder="4"
            value={amount}
            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
            min={1}
            step={1}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="pt-2 flex gap-3">
          <button
            type="submit"
            className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
            disabled={createExpense.isPending}
          >
            {createExpense.isPending ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            className="text-sm underline"
            onClick={() => router.navigate({ to: '/expenses' })}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}
