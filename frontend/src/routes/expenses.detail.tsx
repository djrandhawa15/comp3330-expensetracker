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
  const { id } = useParams({ from: '/expenses/$id' }) as { id: string }
  const expenseId = Number(id)
  const qc = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['expense', expenseId],
    queryFn: async () => {
      const json = await api<{ expense: Expense }>(`/api/expenses/${expenseId}`)
      return json.expense
    },
  })

  if (isLoading) return <p>Loading…</p>
  if (error || !data) return <p className="text-red-600">Failed: {(error as Error).message}</p>

  const expense = data

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Expense #{expense.id}</h2>
      <div className="space-y-1">
        <p><span className="font-medium">Title:</span> {expense.title}</p>
        <p><span className="font-medium">Amount:</span> ${expense.amount}</p>
      </div>

      <UploadExpenseForm
        expenseId={expense.id}
        onDone={() => qc.invalidateQueries({ queryKey: ['expense', expense.id] })}
      />

      <div>
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
