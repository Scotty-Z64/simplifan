FROM node:20-slim

WORKDIR /app

# Install build tools
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (dev + prod)
RUN npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build

EXPOSE 3000

# Run TypeScript directly with tsx (use full path, not npx)
CMD ["./node_modules/.bin/tsx", "--tsconfig", "tsconfig.json", "api/boot.ts"]
