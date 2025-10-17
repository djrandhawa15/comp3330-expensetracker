// frontend/src/router.tsx
import * as React from 'react'
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router'
import App from './App'
import ExpensesListPage from './routes/expenses.list'
import ExpenseDetailPage from './routes/expenses.detail'

const rootRoute = createRootRoute({
  component: () => <App />,
  notFoundComponent: () => <p>Page not found</p>,
  errorComponent: ({ error }) => <p>Error: {(error as Error).message}</p>,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <p>Home Page</p>,
})

const expensesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/expenses',
  component: () => <div className="space-y-4"><h1 className="text-2xl font-bold">Expenses</h1><Outlet /></div>,
}).update({
  // need to import Outlet after the route is created
})
// ts helper to attach Outlet (avoids circular import warnings)
const { Outlet } = await import('@tanstack/react-router')

const expensesIndexRoute = createRoute({
  getParentRoute: () => expensesRoute,
  path: '/',
  component: () => <ExpensesListPage />,
})

const expensesDetailRoute = createRoute({
  getParentRoute: () => expensesRoute,
  path: '$id', // matches /expenses/123
  component: () => <ExpenseDetailPage />,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  expensesRoute.addChildren([expensesIndexRoute, expensesDetailRoute]),
])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function AppRouter() {
  return <RouterProvider router={router} />
}
