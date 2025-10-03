# 1. Use Node.js LTS base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies (only prod deps for smaller image)
RUN npm install --production

# 5. Copy the rest of the backend code
COPY . .

# 6. Expose backend port (change if your server uses another port)
EXPOSE 5000

# 7. Start backend server
CMD ["node", "server.js"]
