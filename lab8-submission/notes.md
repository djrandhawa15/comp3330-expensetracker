# Lab 8 – Notes  

- **TanStack Router Setup:** Installed and configured `@tanstack/react-router` to manage navigation in the Expenses app. Replaced single-page rendering with multi-page routing.  

- **Root & Nested Routes:** Created a root layout in `router.tsx` and defined nested routes for `/`, `/expenses`, `/expenses/:id`, and `/expenses/new`. Learned that child paths omit the leading slash and use `<Outlet />` for nested views.  

- **Shared Layout & Navbar:** Updated `App.tsx` to include a common header with `<Link>` navigation to Home, List, and New pages, providing consistent UI across routes.  

- **Dynamic Routing:** Used route parameters like `$id` to display specific expense details with `useQuery` fetching data from `/api/expenses/:id`.  

- **Integration with TanStack Query:** Combined routing and query management—each page (list, detail, new) interacts with the same API using caching and invalidation.  

- **Error and NotFound Boundaries:** Configured global defaults for unknown routes and runtime errors using `defaultNotFoundComponent` and `defaultErrorComponent`.  

- **Learning:** File-based routing keeps code organized, reduces prop-drilling for navigation, and makes multi-page apps feel seamless while maintaining SPA performance.  
