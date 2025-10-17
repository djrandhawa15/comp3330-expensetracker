// frontend/src/routes/expenses.detail.tsx
import * as React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { api } from '@/lib/api'
import UploadExpenseForm from '@/components/UploadExpenseForm'

type Expense = {
  id: number
  title: string
  amount: number
  fileUrl?: string | null
}

export default function ExpenseDetailPage() {
  const { id } = useParams({ from: '/expenses/$id' }) as { id?: string }
  const expenseId = Number(id)

  // Guard: if id missing or NaN, render nothing (prevents /api/expenses/NaN)
  if (!id || Number.isNaN(expenseId)) {
    return <p className="text-sm text-gray-500">No expense selected.</p>
  }

  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery({
    queryKey: ['expense', expenseId],
    queryFn: async () => {
      const json = await api<{ expense: Expense }>(`/api/expenses/${expenseId}`)
      return json.expense
    },
  })

  if (isLoading) return <p>Loading…</p>
  if (error) return <p className="text-red-600">Error: {(error as Error).message}</p>
  const expense = data!

  return (
    <section className="mx-auto max-w-3xl p-6">
      <h2 className="text-xl font-semibold">{expense.title}</h2>
      <p className="text-gray-600 mt-1">${expense.amount}</p>

      <div className="mt-4">
        <UploadExpenseForm
          expenseId={expense.id}
          onDone={() => qc.invalidateQueries({ queryKey: ['expense', expense.id] })}
        />
        {expense.fileUrl ? (
          <a
            href={expense.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline mt-2 inline-block"
          >
            Download Receipt
          </a>
        ) : (
          <p className="text-gray-500 mt-2">Receipt not uploaded</p>
        )}
      </div>
    </section>
  )
}
