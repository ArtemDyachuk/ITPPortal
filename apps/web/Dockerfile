FROM node:20-slim AS builder

WORKDIR /app

# Copy entire monorepo
COPY package*.json ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Install all dependencies
RUN npm install

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