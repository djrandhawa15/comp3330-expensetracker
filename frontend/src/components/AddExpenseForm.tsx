import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '@/lib/api'

type Expense = { id: number; title: string; amount: number; fileUrl?: string | null }

export function AddExpenseForm() {
  const qc = useQueryClient()
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState<number | ''>('')
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async (payload: { title: string; amount: number }) => {
      return api<{ expense: Expense }>('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    },
    onMutate: async (newItem) => {
      setError(null)
      await qc.cancelQueries({ queryKey: ['expenses'] })
      const previous = qc.getQueryData<{ expenses: Expense[] }>(['expenses'])
      if (previous) {
        const optimistic: Expense = {
          id: -Date.now(), // negative temp id to avoid collisions
          title: newItem.title.trim(),
          amount: newItem.amount,
          fileUrl: null,
        }
        qc.setQueryData(['expenses'], { expenses: [...previous.expenses, optimistic] })
      }
      return { previous }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(['expenses'], ctx.previous)
      setError('Could not add expense. Try again.')
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['expenses'] })
      setTitle('')
      setAmount('')
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setError(null)
        const t = title.trim()
        const n = typeof amount === 'number' ? amount : Number(amount)
        if (t.length < 3) return setError('Title must be at least 3 characters')
        if (!Number.isFinite(n) || n <= 0) return setError('Amount must be greater than 0')
        mutation.mutate({ title: t, amount: n })
      }}
      className="flex gap-2 mt-4 flex-wrap items-start"
    >
      <input
        className="border p-2 rounded w-56"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        className="border p-2 rounded w-40"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder="Amount"
        min={1}
        step={1}
      />
      <button
        className="bg-black text-white px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Adding…' : 'Add Expense'}
      </button>
      <div className="basis-full" />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}
