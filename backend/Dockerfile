# Use official Node.js image with necessary tools
FROM mcr.microsoft.com/playwright:v1.45.0-jammy

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/package*.json ./  
COPY backend/ ./

# Install backend dependencies
RUN npm install

# Copy frontend build files into backend/public (build your frontend beforehand)
COPY backend/public ./public

# Expose port
EXPOSE 5000

# Start the backend
CMD ["node", "server.js"]
