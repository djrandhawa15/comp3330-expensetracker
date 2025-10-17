# Lab 10 – Notes  

- **S3 Setup and Configuration:** Created a private S3-compatible bucket with a CORS policy that allows uploads only from `http://localhost:5173`. Configured environment variables with region, endpoint, bucket name, and IAM credentials for secure backend access.  

- **Presigned URL Generation:** Built a backend route `/api/upload/sign` using AWS SDK and `getSignedUrl()` to generate time-limited upload URLs. This lets the browser upload directly to S3 while keeping credentials safe on the server.  

- **Database Integration:** Updated the `expenses` table schema to include a `fileUrl` column for storing uploaded file keys. Drizzle migrations (`bun run db:generate` and `bun run db:push`) applied these changes successfully.  

- **Secure File Access:** Implemented automatic signed download URLs for each expense so receipts remain private. When data is fetched, the backend attaches a fresh one-hour signed link for every file.  

- **Frontend Upload Flow:** Added a file upload form that (1) requests a signed URL, (2) uploads the file to S3, and (3) updates the expense with the new key. Displayed “Download Receipt” links dynamically using React Query refetching.  

- **Learning:** Gained hands-on experience with presigned URLs, private S3 buckets, and full-stack file upload security. Learned how to isolate uploads to the browser while the backend controls signing and ensures authenticated access.  
