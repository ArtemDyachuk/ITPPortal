FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package.json and lockfile
COPY package*.json ./
COPY turbo.json ./

# Copy workspace configs
COPY packages/ ./packages/
COPY apps/api/package*.json ./apps/api/

# Install dependencies
RUN npm ci

# Copy source
COPY apps/api/ ./apps/api/

# Build
RUN npx turbo run build --filter=api

FROM node:18-alpine AS runner

WORKDIR /app

# Copy built app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/package*.json ./

EXPOSE 3001

CMD ["npm", "run", "start:prod"]