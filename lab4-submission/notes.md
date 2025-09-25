# Lab 3 – Notes

- **PUT vs PATCH:** I learned that `PUT` is meant for replacing the entire resource, while `PATCH` is for updating only the fields provided. Using both helps clarify intent and enforces proper API design.  
- **Error Handling:** Standardizing errors with a common `{ "error": { "message": "..." } }` format makes debugging and client handling much easier. It also forces consistency across all endpoints.  
- **Validation:** Using Zod schemas for both creation and updates prevents invalid or empty requests from being processed (e.g., rejecting an empty PATCH body). This keeps data integrity strong.  
- **Response Helpers:** Abstracting success (`ok`) and error (`err`) responses into reusable helpers simplified code and ensured consistent shapes and status codes (200, 201, 400, 404).  
- **Learning:** I now better understand how small improvements in response design and validation lead to more reliable APIs, which is crucial for real-world full-stack applications.  
