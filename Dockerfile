FROM node:20-alpine AS deps

WORKDIR /src/app
COPY package*.json ./
RUN npm install

FROM node:20-alpine AS builder

COPY . .
COPY --from=desp /node_modules ./node_modules
RUN npm run build

FROM node:20-alpine AS runner

COPY --from=builder /.next/standalone ./

EXPOSE 3000

ENV PORT 3000

CMD HOSTNAME="0.0.0.0" node server.js