# Lab 11 – Notes

- **Optimistic Mutations (Add & Delete):**  
  - Implemented **optimistic add** in `AddExpenseForm.tsx` with `onMutate` to append a temp item (negative `id`), **rollback** on error, and `onSettled` → `invalidateQueries(['expenses'])`.  
  - Implemented **optimistic delete** in `ExpensesList.tsx`: remove the row immediately in `onMutate`, **restore** from snapshot in `onError`, and `invalidateQueries` in `onSettled`.

- **Cache Sync & API Helper:**  
  - All requests go through shared `api()` (adds `credentials: 'include'` and consistent error handling).  
  - Query key: `['expenses']` for list, `['expense', id]` for detail. Post-settle refetch guarantees UI matches server.

- **UX Polish (Required):**  
  - **Loading:** Spinner SVG for list and form; optional network throttling used to verify.  
  - **Disabled/Pending:** Buttons disabled during `isPending` / `isFetching`; visible text changes (e.g., “Adding…”, “Removing…”).  
  - **Empty State:** Friendly card (“No expenses yet”) on zero items.  
  - **Inline Errors:** Neutral copy near controls (e.g., “Could not add expense. Try again.”).  
  - **Form Reset:** Title/amount cleared in `onSettled` after successful add.

- **Routing & Guarding:**  
  - Added dedicated route **`/expenses/new`** (so it doesn’t hit `/expenses/$id` with `id="new"`).  
  - Detail page guards against invalid/NaN ids to prevent `/api/expenses/NaN` network spam.

- **Backend Routes:**  
  - **CRUD mounted at `/api/expenses`**.  
  - **DELETE** implemented once (removed duplicate), returns `{ success: true }`.  
  - Signed download URLs on reads; auth gate applied via router-level middleware.  
  - Fixed auth middleware so the chain always finalizes (no “Context is not finalized” errors).

- **Optional Polish (chosen):**  
  - **Inline validation**: Title ≥ 3 chars, **amount > 0** (integer), shows helper text.  
  - **Confirmation on delete**: `confirm('Delete this expense?')` to avoid accidental removal.  
  - (If applicable) **Skeleton rows** during list load (`animate-pulse`)—used when testing with throttled network.

- **Testing Evidence (what I verified):**  
  - **Add Optimistically:** New item renders immediately; after server 200 and page refresh, it persists. When backend is stopped, the optimistic row **rolls back** and error appears.  
  - **Delete Optimistically:** Row disappears instantly; when backend rejects, the row **reappears** (rollback).  
  - **Loading & Empty:** Spinner shows during fetch; empty-state card appears when table is cleared.  
  - **Errors:** With server down, list renders error panel with **Retry**.  
  - Screenshots captured: `optimistic_add.png`, `optimistic_delete.png`, `empty_state.png`, `polish_bonus.png`.

- **Challenges & Fixes:**  
  - **Duplicate DELETE route** in `expenses.ts` caused ambiguity → consolidated to a single handler.  
  - **Auth middleware** initially didn’t finalize → ensured router-level `use('*', async (c,next) => { const err = await requireAuth(c); if (err) return err; await next(); })`.  
  - **NaN detail fetches** from routing (“new” hitting `$id`) → added static `/expenses/new` route and guarded detail loader.  
  - Mixed raw `fetch` and `api()` caused cookie issues → standardized on `api()`.

- **Takeaways:**  
  - Optimistic UI requires **three pieces**: `onMutate` (UI-first), **context snapshot** for rollback, and **post-settle refetch** for truth.  
  - Clear loading/empty/error states make the app feel intentional.  
  - Router precedence (static vs dynamic) matters; guard against invalid params to avoid noisy requests.  
  - A single, shared API helper keeps **auth + headers** consistent and prevents subtle bugs.
