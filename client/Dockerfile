FROM node:20-alpine AS builder
WORKDIR /app

# Install deps and build
COPY package.json package-lock.json* ./
COPY .npmrc* ./
RUN npm ci --silent || npm install --silent
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

RUN npm install --production --silent

EXPOSE 3000

CMD ["npm", "run", "start"]
