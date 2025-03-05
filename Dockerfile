# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code (backend + worker)
COPY . .

# Expose the app on port 4000 (for backend API)
EXPOSE 4000

# Start the backend application (API server)
CMD ["npm", "run", "dev"]  