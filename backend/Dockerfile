# Build production docker image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency configs
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy remaining code
COPY . .

# Set environment
ENV NODE_ENV=production

# Cloud Run defaults to port 8080
ENV PORT=8080
EXPOSE 8080

# Run service
CMD ["node", "server.js"]
