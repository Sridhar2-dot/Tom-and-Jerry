FROM node:18-alpine

# Install Python3 to execute the Code Runner challenges
RUN apk add --no-cache python3

# Set working directory
WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy application code
COPY backend/ .

# Expose API port
EXPOSE 3001

# Start the server
CMD ["node", "server.js"]
