# 💼 SysManager - Finanças & CRM

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

> Um sistema completo de **gestão financeira + CRM** para profissionais independentes e freelancers separarem finanças pessoais da empresa.

---

## 🎯 O Que Já Foi Feito

### ✅ Funcionalidades Implementadas

- **💰 Gestão Financeira**
  - Criação de múltiplas carteiras (Banco, Corretora, etc)
  - Registro de transações (Entradas e Saídas)
  - Saldos atualizados em tempo real

- **🤝 Módulo CRM**
  - Cadastro de clientes
  - Criação de projetos/orçamentos
  - Vinculação de projetos com transações

- **📊 Dashboard Dinâmico**
  - Visão geral dos saldos
  - Últimos projetos ativos
  - Separação automática: Finanças Pessoais vs Faturamento da Empresa

---

## 🧠 A Lógica Genial do Sistema

A grande vantagem do **SysManager** é separar caixa na **mesma base de dados**:

```
✓ Transação COM projectId → Faturamento/Custo da Empresa
✓ Transação SEM projectId → Finanças Pessoais
```

Tudo filtrado e separado no Dashboard, sem necessidade de múltiplos bancos.

---

## 🛠️ Stack Tecnológico

| Categoria | Tecnologia |
|-----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Linguagem** | TypeScript |
| **Banco de Dados** | PostgreSQL |
| **ORM** | Prisma |
| **Autenticação** | NextAuth.js v5 |
| **Validação** | Zod |
| **UI** | Tailwind CSS + Lucide Icons |
| **Infraestrutura** | Docker & Docker Compose |
| **Notificações** | React Hot Toast |

---

## 🏗️ Arquitetura

```
next-app/
├── app/
│   ├── actions/          ← Server Actions (Backend seguro)
│   ├── (rotas)/          ← Client Components (Frontend)
│   └── components/       ← Componentes reutilizáveis (UI)
├── prisma/
│   └── schema.prisma     ← Modelo de dados
├── .env.example
├── Dockerfile
└── docker-compose.yml
```

### 🔐 Segurança
- Server Actions (`'use server'`) - Backend 100% protegido
- Validação **Zod** em todas as entradas
- Autenticação NextAuth.js com bcryptjs
- Nenhuma lógica de banco exposta ao frontend

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Docker e Docker Compose instalados
- Git

### Setup em 3 Passos

**1. Clone e entre na pasta:**
```bash
git clone https://github.com/Brenobbfreitas/SistemaCadastro.git
cd SistemaCadastro
```

**2. Crie o arquivo `.env` na raiz:**
```env
# Banco de Dados
POSTGRES_USER=postgres
POSTGRES_PASSWORD=root
POSTGRES_DB=sysmanager
DATABASE_URL="postgresql://postgres:root@db:5432/sysmanager?schema=public"

# Autenticação
AUTH_SECRET="sua_chave_secreta_aqui"
AUTH_URL="http://localhost:3000"
```

**3. Suba o Docker:**
```bash
docker compose up -d

# Gera cliente Prisma
docker compose exec app npx prisma generate

# Sincroniza banco
docker compose exec app npx prisma db push
```

**Acesse:** http://localhost:3000

---

## 🐛 Desafios Técnicos Já Resolvidos

✅ **Serialização Server-to-Client**
- Conversão do tipo `Decimal` (Prisma) para compatibilidade com Client Components

✅ **Docker + Linux/WSL**
- Correção de permissões (`EACCES`) para instalação de pacotes dentro do container

✅ **Prisma + Turbopack**
- Cache e regeneração correta do Prisma Client dentro do container

---

## 📋 Roadmap (V1.1)

- [ ] Conversão automática de projetos "COMPLETED" em transações
- [ ] Gráficos analíticos (Gastos Pessoais vs Faturamento)
- [ ] CRUD completo: editar e deletar transações/projetos
- [ ] Filtros avançados por data e categoria

---

## 📁 Estrutura de Arquivos

```
SistemaCadastro/
├── next-app/                 ← Aplicação Next.js
│   ├── app/
│   ├── prisma/
│   ├── public/
│   └── Dockerfile
├── docker-compose.yml        ← Orquestração
├── .env.example
└── README.md
```

---

## 🤝 Contribuições

Melhorias e sugestões são bem-vindas! Abra uma issue ou PR.

---

## 📄 Licença

Projeto de código aberto.

---

**Desenvolvido por:** [Breno Barreto](https://github.com/Brenobbfreitas)  
**Última atualização:** Maio 2026
