FROM node:20-slim

WORKDIR /app

# Install Python and build tools (needed for some npm packages)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the project
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/boot.js"]
