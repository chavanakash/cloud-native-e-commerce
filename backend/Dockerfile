FROM node:20-alpine
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
# Only install production dependencies
RUN npm install --production

# Copy application source code
COPY . .

EXPOSE 5000
# The start script should run your main Express server file, 
# ensuring it listens on 0.0.0.0 and port 5000.
CMD [ "npm", "start" ]