# Multi-stage Dockerfile for Full-Stack Leads Tracking App

# Stage 1: Build Server
FROM node:20-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
COPY server/prisma ./prisma/
RUN npm install
COPY server/ ./
RUN npx prisma generate
RUN npm run build

# Stage 2: Build Client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 3: Production Server with Static Client Frontend
FROM node:20-alpine AS production
WORKDIR /app

# Copy server build & dependencies
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma/
WORKDIR /app/server
RUN npm install --omit=dev
COPY --from=server-builder /app/server/dist ./dist
COPY --from=server-builder /app/server/generated ./generated

# Copy client dist into static serve directory or environment
WORKDIR /app

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL="file:./prisma/dev.db"

CMD ["sh", "-c", "cd server && npx prisma migrate deploy && npm run seed && node dist/server.js"]
