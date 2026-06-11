FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy built files
COPY dist/boot.js ./dist/boot.js
COPY dist/public ./dist/public
COPY .env ./.env

EXPOSE 3000

CMD ["node", "dist/boot.js"]
