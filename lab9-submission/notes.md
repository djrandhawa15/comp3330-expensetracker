# Lab 9 – Notes  

- **Server-Side Authentication with Kinde:** Moved authentication logic from the React frontend to the Hono backend using Kinde’s TypeScript SDK. This centralized the login, callback, logout, and user profile routes under `/api/auth`.  

- **Session Management via Cookies:** Implemented a custom `SessionManager` using Hono’s `getCookie`, `setCookie`, and `deleteCookie` helpers. Replaced frontend tokens with secure, `HttpOnly` cookies that store session data safely on the server.  

- **Protected API Routes:** Added a `requireAuth` middleware that verifies user sessions before allowing access to protected routes like `/api/secure/profile` and `/api/expenses`. This ensures only authenticated users can read or modify data.  

- **Simplified Frontend Auth:** Replaced the React SDK with a lightweight `<AuthBar />` component that calls `/api/auth/me` to display login/logout buttons and the user’s email, keeping the frontend clean and server-driven.  

- **OAuth 2.0 / OIDC Flow:** Configured Kinde redirect URLs and environment variables to handle login redirects, token validation, and logout callbacks automatically through the SDK, eliminating manual token parsing.  

- **Learning:** Moving authentication to the backend improved security by keeping tokens out of localStorage, simplified the frontend, and provided a consistent, scalable way to protect routes using server-side session validation.  
