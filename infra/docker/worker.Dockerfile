FROM node:20-bookworm AS base

# Installa pnpm
RUN npm install -g pnpm@8.10.0

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di configurazione del monorepo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/worker/package.json ./apps/worker/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY infra/prisma/package.json ./infra/prisma/package.json

# Installa le dipendenze
RUN pnpm install --frozen-lockfile

# Copia il resto del codice
COPY . .

# Genera il client Prisma
RUN cd infra/prisma && pnpm prisma generate

# Build delle applicazioni
RUN pnpm build

# Fase di produzione
FROM mcr.microsoft.com/playwright:v1.40.0-jammy AS production

# Installa Node.js
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Installa pnpm
RUN npm install -g pnpm@8.10.0

WORKDIR /app

# Copia i file necessari dalla fase di build
COPY --from=base /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=base /app/apps/worker/package.json ./apps/worker/package.json
COPY --from=base /app/apps/worker/dist ./apps/worker/dist
COPY --from=base /app/apps/worker/src/templates ./apps/worker/src/templates
COPY --from=base /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=base /app/packages/shared/dist ./packages/shared/dist
COPY --from=base /app/infra/prisma/package.json ./infra/prisma/package.json
COPY --from=base /app/infra/prisma/schema.prisma ./infra/prisma/schema.prisma
COPY --from=base /app/node_modules/.pnpm/@prisma ./node_modules/.pnpm/@prisma
COPY --from=base /app/node_modules/.pnpm/prisma ./node_modules/.pnpm/prisma
COPY --from=base /app/node_modules/.pnpm/node_modules ./node_modules/.pnpm/node_modules
COPY --from=base /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=base /app/node_modules/prisma ./node_modules/prisma

# Installa solo le dipendenze di produzione
RUN pnpm install --prod --frozen-lockfile

# Imposta le variabili d'ambiente
ENV NODE_ENV=production

# Comando di avvio
CMD ["pnpm", "--filter", "worker", "start"]