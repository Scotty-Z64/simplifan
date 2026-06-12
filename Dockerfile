FROM node:20-slim

WORKDIR /app

# Install build tools
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (including dev deps for tsx)
RUN npm ci

# Copy source code
COPY . .

# Build frontend only
RUN npx vite build

EXPOSE 3000

# Run API server directly with tsx (no bundling issues)
CMD ["npx", "tsx", "api/boot.ts"]
