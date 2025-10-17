import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { UploadExpenseForm } from '@/components/UploadExpenseForm'
import { api } from '@/lib/api'

type Expense = {
  id: number
  title: string
  amount: number
  fileUrl?: string | null
}

export const Route = createFileRoute('/expenses/$id')({
  component: ExpenseDetailPage,
})

function ExpenseDetailPage() {
  const { id } = Route.useParams()
  const expenseId = Number(id)
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['expense', expenseId],
    queryFn: async () => {
      const json = await api<{ expense: Expense }>(`/api/expenses/${expenseId}`)
      return json.expense
    },
  })

  if (isLoading) return <p>Loading…</p>
  if (error || !data) return <p className="text-red-600">Failed to load expense.</p>

  const expense = data

  return (
    <section className="mx-auto max-w-3xl p-6">
      <div className="rounded border bg-background text-foreground p-6 shadow-sm space-y-2">
        <h2 className="text-2xl font-semibold">{expense.title}</h2>
        <p className="text-sm text-muted-foreground">Amount</p>
        <p className="text-lg tabular-nums">${expense.amount}</p>
      </div>

      <div className="mt-4">
        <UploadExpenseForm
          expenseId={expense.id}
          onDone={() => queryClient.invalidateQueries({ queryKey: ['expense', expense.id] })}
        />
      </div>

      <div className="mt-3">
        {expense.fileUrl ? (
          <a
            href={expense.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline inline-block"
          >
            Download Receipt
          </a>
        ) : (
          <p className="text-gray-500">Receipt not uploaded</p>
        )}
      </div>
    </section>
  )
}
