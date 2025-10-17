// frontend/src/routes/expenses.list.tsx
import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { AddExpenseForm } from '@/components/AddExpenseForm'
import { ExpensesList } from '@/components/ExpensesList'

export default function ExpensesListPage() {
  return (
    <section className="mx-auto max-w-3xl p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Expenses</h1>
        <div className="flex items-center gap-2">
          <Link to="/expenses/new" className="rounded border px-3 py-1 text-sm">
            New
          </Link>
        </div>
      </header>

      {/* Add form (optional, remove if you don't have it) */}
      <AddExpenseForm />

      {/* This renders the list with Delete buttons */}
      <ExpensesList />
    </section>
  )
}
