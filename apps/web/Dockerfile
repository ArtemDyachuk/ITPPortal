FROM node:20-slim AS builder

WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json package-lock.json ./
COPY turbo.json ./

# Copy workspace packages that web depends on
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Install all dependencies with legacy peer deps to avoid npm bugs
RUN npm install --legacy-peer-deps

# Build the web app
WORKDIR /app/apps/web
RUN npm run build

# Production stage
FROM node:20-slim AS runner

WORKDIR /app

# Copy standalone build output
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 4201

ENV PORT=4201
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]