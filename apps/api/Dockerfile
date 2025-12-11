FROM node:20-slim AS builder

WORKDIR /app

# Copy API package files
COPY apps/api/package*.json ./

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Copy API source
COPY apps/api/ ./

# Build
RUN npm run build

# Production stage
FROM node:20-slim AS runner

WORKDIR /app

# Copy built output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3001

CMD ["node", "dist/main"]