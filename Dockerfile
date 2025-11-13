# ===============================
# Stage 1: Build Stage
# ===============================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files from Backend
COPY Backend/package*.json ./

RUN npm ci

# Copy backend source
COPY Backend/ ./

# Build Typescript
RUN npm run build

# Generate Prisma client
RUN npx prisma generate


# ===============================
# Stage 2: Production Stage
# ===============================
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy package.json
COPY --from=builder /app/package*.json ./

# Install ONLY production deps
RUN npm ci --omit=dev

# Copy built code
COPY --from=builder /app/dist ./dist

# Copy prisma folder + generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]
