FROM node:20-bookworm AS base

# Installa pnpm
RUN npm install -g pnpm@8.10.0

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di configurazione del monorepo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/web/package.json ./apps/web/package.json
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
FROM node:20-bookworm-slim AS production

WORKDIR /app

# Installa pnpm
RUN npm install -g pnpm@8.10.0

# Copia i file necessari dalla fase di build
COPY --from=base /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=base /app/apps/web/package.json ./apps/web/package.json
COPY --from=base /app/apps/web/.next ./apps/web/.next
COPY --from=base /app/apps/web/public ./apps/web/public
COPY --from=base /app/apps/web/next.config.js ./apps/web/next.config.js
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

# Esponi la porta
EXPOSE 3000

# Imposta le variabili d'ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Comando di avvio
CMD ["pnpm", "--filter", "web", "start"]