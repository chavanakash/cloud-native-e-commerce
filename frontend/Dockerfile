# -------------------------------------------------------------------------
# Stage 1: Builder - Installs ALL dependencies and runs the build.
# -------------------------------------------------------------------------
FROM node:20-alpine AS builder 
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build 

# -------------------------------------------------------------------------
# Stage 2: Dependencies Installer - ONLY installs production dependencies.
# -------------------------------------------------------------------------
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
# Install ONLY production dependencies here
RUN npm install --production

# -------------------------------------------------------------------------
# Stage 3: Runner - The final, minimal image.
# -------------------------------------------------------------------------
FROM node:20-alpine AS runner 
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

# Copy essentials from the relevant stage:
# 1. The built app from the 'builder' stage
COPY --from=builder /app/.next ./.next 
# 2. Production-only node_modules from the 'dependencies' stage
COPY --from=dependencies /app/node_modules ./node_modules
# 3. The package.json
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]