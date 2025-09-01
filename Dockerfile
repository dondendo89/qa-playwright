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

# Copy everything from base stage
COPY --from=base /app ./

# Expose port
EXPOSE $PORT

# Set environment variable for Next.js
ENV HOSTNAME="0.0.0.0"
ENV PORT=${PORT:-3000}

# Start web application using pnpm
CMD ["sh", "-c", "PORT=${PORT:-3000} pnpm --filter @qa-playwright/web start -- -H 0.0.0.0 -p ${PORT:-3000}"]

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