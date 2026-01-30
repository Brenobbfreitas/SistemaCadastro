# ETAPA 1: Base (Dependências)
FROM node:20-alpine AS deps
# Instala OpenSSL aqui para baixar as dependências corretamente
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm install

# ETAPA 2: Builder (Construção)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- CORREÇÃO 1: Adicionar OpenSSL no Builder ---
# O 'prisma generate' pode precisar rodar binários que dependem do OpenSSL
RUN apk add --no-cache libc6-compat openssl

RUN npx prisma generate
RUN npm run build

# ETAPA 3: Runner (Produção)
FROM node:20-alpine AS development
WORKDIR /app

ENV NODE_ENV development

# --- CORREÇÃO 2: Adicionar OpenSSL no Runner (CRUCIAL) ---
# Sem isso, o site cai assim que tentar conectar no banco em produção
RUN apk add --no-cache libc6-compat openssl

COPY --from=builder --chown=node:node /app ./


EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

USER node

CMD ["npm", "run", "dev"]