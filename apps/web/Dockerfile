# Use Bun for reliable builds (npm has known bugs in Docker)
FROM oven/bun:1-alpine AS deps
WORKDIR /app

# Copy package files from monorepo
COPY package.json bun.lock* ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Install dependencies with Bun
RUN bun install

# Build stage
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps ./apps
COPY --from=deps /app/package.json ./
COPY --from=deps /app/turbo.json ./

WORKDIR /app/apps/web
RUN bun run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 4201

ENV PORT=4201
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]