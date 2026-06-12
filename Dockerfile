FROM node:20-slim

WORKDIR /app

# Install build tools
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (use npm install since lock file may be out of sync)
RUN npm install

# Copy source code
COPY . .

# Build frontend
RUN npm run build

EXPOSE 3000

# Run TypeScript directly with tsx
CMD ["./node_modules/.bin/tsx", "--tsconfig", "tsconfig.json", "api/boot.ts"]
