# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/worker/package.json ./apps/worker/
COPY packages/shared/package.json ./packages/shared/
COPY infra/prisma/package.json ./infra/prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm --filter @qa-playwright/prisma generate

# Build all packages
RUN pnpm run build

# Production stage for web
FROM node:18-alpine AS web
RUN npm install -g pnpm
WORKDIR /app

# Copy built web application
COPY --from=base /app/apps/web/.next ./apps/web/.next
COPY --from=base /app/apps/web/package.json ./apps/web/
COPY --from=base /app/apps/web/public ./apps/web/public
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-workspace.yaml ./

# Expose port
EXPOSE $PORT

# Start web application
CMD ["sh", "-c", "cd apps/web && next start -H 0.0.0.0 -p ${PORT:-3000}"]

# Production stage for worker
FROM node:18-alpine AS worker
RUN npm install -g pnpm
WORKDIR /app

# Copy built worker application
COPY --from=base /app/apps/worker/dist ./apps/worker/dist
COPY --from=base /app/apps/worker/package.json ./apps/worker/
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-workspace.yaml ./

# Start worker application
CMD ["pnpm", "--filter", "@qa-playwright/worker", "start"]