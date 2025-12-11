FROM node:20-slim AS builder

WORKDIR /app

# Copy only API app (not UI packages it doesn't need)
COPY apps/api/package*.json ./apps/api/

# Install dependencies for API only
WORKDIR /app/apps/api
RUN npm install

# Copy API source and build
COPY apps/api/ ./
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