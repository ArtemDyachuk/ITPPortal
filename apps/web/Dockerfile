FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package.json and lockfile
COPY package*.json ./
COPY turbo.json ./

# Copy workspace configs
COPY packages/ ./packages/
COPY apps/web/package*.json ./apps/web/

# Install dependencies
RUN npm ci

# Copy source
COPY apps/web/ ./apps/web/

# Build
RUN npx turbo run build --filter=web

FROM node:18-alpine AS runner

WORKDIR /app

# Copy built app
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/apps/web/public ./public

EXPOSE 4201

CMD ["node", "server.js"]