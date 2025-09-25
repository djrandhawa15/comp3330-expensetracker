# Lab 4 – Notes

- **Database Integration:** Replaced the in-memory array with a Neon Postgres database using Drizzle ORM. All CRUD routes now run queries against the database instead of local memory.  
- **Schema & Migrations:** Defined a Drizzle schema (`expenses` table with id, title, amount) and used `drizzle-kit` to generate/push migrations, which created the table on Neon.  
- **Environment Setup:** Added `.env` with `DATABASE_URL` and configured `drizzle.config.ts`. The connection required `?sslmode=require` to avoid TLS errors.  
- **Routes Rewrite:** Updated `server/routes/expenses.ts` to use `db.select`, `db.insert`, `db.update`, and `db.delete` with `.returning()`. This made the API persistent across restarts.  
- **Validation & Consistency:** Kept Zod validation from Lab 3 for POST/PUT/PATCH. Empty PATCH bodies are rejected, and responses remain consistent with `{ data }` / `{ error }` helpers.  
- **Learning:** I learned how to connect a backend API to a real database, manage migrations, and handle subtle connection gotchas—essential skills for production-ready applications.  
