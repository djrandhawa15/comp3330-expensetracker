FROM oven/bun:1.2.21 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Build frontend
FROM base AS build-frontend
COPY --from=install /app/node_modules ./node_modules
COPY frontend ./frontend
WORKDIR /app/frontend
RUN bun install && bun run build

# Production image
FROM base AS release
COPY --from=install /app/node_modules ./node_modules
COPY --from=build-frontend /app/frontend/dist ./frontend/dist
COPY server ./server
COPY package.json ./
COPY drizzle.config.ts ./

# Create public directory and copy frontend build
RUN mkdir -p server/public && cp -r frontend/dist/* server/public/

# Expose port
EXPOSE 3000

# Start server
CMD ["bun", "run", "start"]
