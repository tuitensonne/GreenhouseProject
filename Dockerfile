# ===============================
# Stage 1: Build Stage
# ===============================
FROM node:20-alpine AS builder

WORKDIR /app

COPY Backend/package*.json ./

RUN npm ci --unsafe-perm

COPY Backend/ ./

RUN npm run build

# ===============================
# Stage 2: Production Stage
# ===============================
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev --unsafe-perm && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]
