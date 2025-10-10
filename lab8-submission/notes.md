# Lab 7 – Notes  

- **QueryClient Setup:** Wrapped the app in `QueryClientProvider` so TanStack Query manages server state globally.  
- **useQuery:** Replaced manual fetch with `useQuery`, which handles loading and error states automatically.  
- **useMutation:** Added `useMutation` for creating expenses; used `invalidateQueries` to refresh the list after add.  
- **Caching & Invalidation:** Learned that queries are cached by key and only re-fetched when invalidated.  
- **Learning:** TanStack Query removes the need for manual refresh patterns and gives built-in caching, retries, and error handling.  
