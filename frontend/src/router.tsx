// src/router.tsx
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from '@tanstack/react-router'
import App from './App'
import ExpensesListPage from './routes/expenses.list'
import ExpenseNewPage from './routes/expenses.new'
import ExpenseDetailPage from './routes/expenses.detail' // 👈

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

const ExpensesLayout = () => (
  <section className="p-4">
    <h2 className="text-xl font-semibold mb-4">Expenses</h2>
    <Outlet />
  </section>
)

const expensesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'expenses', // no leading slash
  component: ExpensesLayout,
})

const expensesIndexRoute = createRoute({
  getParentRoute: () => expensesRoute,
  path: '/',
  component: ExpensesListPage,
})

const expensesNewRoute = createRoute({
  getParentRoute: () => expensesRoute,
  path: 'new',
  component: ExpenseNewPage,
})

const expensesDetailRoute = createRoute({
  getParentRoute: () => expensesRoute,
  path: '$id', // /expenses/:id
  component: ExpenseDetailPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  expensesRoute.addChildren([
    expensesIndexRoute,
    expensesNewRoute,
    expensesDetailRoute, // 👈 include it
  ]),
])

export const router = createRouter({ routeTree })

export function AppRouter() {
  return <RouterProvider router={router} />
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
