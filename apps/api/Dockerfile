FROM node:20-slim AS builder

WORKDIR /app

# Copy entire monorepo
COPY package*.json ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install all dependencies including devDependencies
RUN npm install

# Build the API
WORKDIR /app/apps/api
RUN npm run build

# Production stage
FROM node:20-slim AS runner

WORKDIR /app

# Copy built output and production dependencies
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

EXPOSE 3001

CMD ["node", "dist/main"]