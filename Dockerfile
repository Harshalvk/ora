FROM node:20-alpine AS deps

WORKDIR /src/app
COPY package*.json ./
RUN npm install

FROM node:20-alpine AS builder

WORKDIR /src/app
COPY . .
COPY --from=deps /src/app/node_modules ./node_modules
RUN npm run build 

FROM node:20-alpine AS runner

WORKDIR /src/app
COPY --from=builder /src/app/.next/standalone ./
COPY --from=builder /src/app/.next/static ./.next/static
COPY --from=builder /src/app/public ./public

EXPOSE 3000
ENV PORT 3000

CMD ["node","server.js"]