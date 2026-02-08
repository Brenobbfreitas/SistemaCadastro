# Estágio 1: Instalação de dependências
FROM node:20-slim AS base_deps
WORKDIR /app

# Instala o OpenSSL necessário para o Prisma no Debian
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
# Instalamos as dependências
RUN npm install

# Estágio 2: Build do projeto
FROM node:20-slim AS builder
WORKDIR /app
# Copiamos as dependências do estágio anterior
COPY --from=base_deps /app/node_modules ./node_modules
COPY . .

# Gera o Prisma Client com as engines certas para o Debian
RUN npx prisma generate

# Faz o build do Next.js
RUN npm run build

# Estágio 3: Execução (Produção)
FROM node:20-slim AS runner
WORKDIR /app

# Variável para o Prisma não reclamar do OpenSSL
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]