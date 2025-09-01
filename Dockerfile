# Use Node.js 18 Debian slim as base image
FROM node:18-slim

# Install required dependencies for Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Enable Corepack for pnpm
RUN corepack enable

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

# Copy Prisma schema first
COPY infra/prisma/schema.prisma ./infra/prisma/

# Generate Prisma client
RUN cd infra/prisma && pnpm generate

# Copy rest of source code
COPY . .

# Build the Prisma package first
RUN pnpm --filter @qa-playwright/prisma build

# Build the web application
RUN pnpm --filter @qa-playwright/web build

# Expose port
EXPOSE $PORT

# Set environment variables
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

# Start the web application
CMD ["sh", "-c", "cd infra/prisma && npx prisma migrate deploy && cd ../../apps/web && PORT=${PORT:-3000} npx next start -H 0.0.0.0 -p ${PORT:-3000}"]