# Lab 10 – Notes

- **Provider & Setup:** Used AWS S3 (us-east-2) as the storage provider. Configured private bucket `dilraj-expenses-receipts` with a CORS policy allowing `http://localhost:5173` for PUT/GET/HEAD.

- **Presigned URLs:** Backend route `/api/upload/sign` (Hono + AWS SDK v3) generates time-limited presigned URLs. Browser uploads directly to S3 using `PUT` with matching `Content-Type`.

- **Database & API:** Added a `file_url` column to the `expenses` table. The backend stores only the S3 key, not a public URL. On every read, it returns a signed download URL (1-hour expiry).

- **Frontend Workflow:** The upload form calls `/api/upload/sign`, uploads to S3, then updates `/api/expenses/:id` with `{ fileKey }`. The detail page automatically refreshes and shows a **Download Receipt** link.

- **Challenges:**  
  - Fixed **CORS preflight** by using the correct region (`us-east-2`) and matching headers.  
  - Ensured **same-origin cookies** by using the Vite proxy (`/api`).  
  - Adjusted file naming to avoid spaces and signature mismatches.

- **Takeaways:** Learned secure file uploads using presigned URLs—keeping credentials off the client while keeping the bucket private. Also reinforced understanding of CORS, regions, and signed URL lifetimes.
