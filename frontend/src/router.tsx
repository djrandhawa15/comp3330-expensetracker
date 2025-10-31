// frontend/src/router.tsx
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router'

import App from './App'
import ExpensesListPage from './routes/expenses.list'
import ExpenseDetailPage from './routes/expenses.detail'
import ExpenseNewPage from './routes/expenses.new' // ⬅ add this

// Root layout -> renders <App /> which contains <Outlet />
const rootRoute = createRootRoute({
  component: () => <App />,
  notFoundComponent: () => <p>Page not found</p>,
  errorComponent: ({ error }) => <p>Error: {(error as Error).message}</p>,
})

// /expenses parent
const expensesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'expenses',
})

// /expenses (index)
const expensesIndexRoute = createRoute({
  getParentRoute: () => expensesRoute,
  path: '/', // index child
  component: ExpensesListPage,
})

// /expenses/new  ✅ static route takes precedence over $id
const expensesNewRoute = createRoute({
  getParentRoute: () => expensesRoute,
  path: 'new',
  component: ExpenseNewPage,
})

// /expenses/$id  (detail)
const expensesDetailRoute = createRoute({
  getParentRoute: () => expensesRoute,
  path: '$id',
  component: ExpenseDetailPage,
})

// Build the tree
const routeTree = rootRoute.addChildren([
  expensesRoute.addChildren([
    expensesIndexRoute,
    expensesNewRoute,     // make sure this is present
    expensesDetailRoute,
  ]),
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
