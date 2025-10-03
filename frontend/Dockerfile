# 1. Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy rest of the frontend code
COPY . .

# Build Next.js app
RUN npm run build

# 2. Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Only copy required files from builder
COPY --from=builder /app/package*.json ./
RUN npm install --production

# Copy built Next.js output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose Next.js default port
EXPOSE 3000

# Start Next.js app
CMD ["npm", "start"]
