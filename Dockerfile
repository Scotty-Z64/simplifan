FROM node:20-alpine

WORKDIR /app

# Copy package files first (for caching)
COPY package.json package-lock.json* ./

# Install ALL dependencies (including dev deps needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the project (creates dist/boot.js and dist/public)
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/boot.js"]
