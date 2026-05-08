# 💼 SysManager - Finanças & CRM

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

O **SysManager** é uma aplicação Full-Stack desenvolvida para resolver um problema real de profissionais independentes e freelancers: a mistura do fluxo de caixa pessoal com as finanças do negócio. 

O sistema unifica a gestão financeira (carteiras e transações) com um módulo de CRM (clientes e orçamentos/projetos), permitindo rastrear exatamente de onde o dinheiro vem e para onde vai.

## ✨ Funcionalidades Principais

* **💰 Gestão Financeira:** Criação de múltiplas carteiras (ex: Banco X, Corretora Y) e registo de transações (Entradas e Saídas).
* **🤝 Módulo CRM:** Registo de Clientes e criação de Projetos/Orçamentos atrelados a eles.
* **📊 Dashboard Dinâmico:** Visão geral em tempo real dos saldos atualizados e últimos projetos ativos.

## 🧠 Regra de Negócio Central (O "Pulo do Gato")

A grande vantagem arquitetural do SysManager é a sua lógica de separação de caixa dentro da mesma base de dados:
* Transações **com** um `projectId` vinculado são classificadas automaticamente como *Faturamento ou Custo da Empresa*.
* Transações **sem** um `projectId` vinculado são classificadas como *Finanças Pessoais*.
Isto permite ter as finanças misturadas no mesmo banco de dados, mas perfeitamente separadas e filtráveis no Dashboard.

## 🛠️ Stack Tecnológica

O projeto foi construído com as tecnologias mais modernas do ecossistema React/Node:

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
* **Linguagem:** TypeScript
* **Banco de Dados & ORM:** PostgreSQL + [Prisma](https://www.prisma.io/)
* **Autenticação:** [NextAuth.js (v5)](https://authjs.dev/)
* **Validação:** [Zod](https://zod.dev/)
* **Estilização:** Tailwind CSS + UI Components
* **Infraestrutura:** Docker & Docker Compose (Ambiente 100% containerizado)

## 🏗️ Arquitetura do Projeto

A aplicação segue rigorosamente as melhores práticas de separação de responsabilidades introduzidas pelo Next.js App Router:

* **`/app/actions`**: O "Cérebro" (Backend). Aqui vivem as **Server Actions** (`'use server'`). Nenhuma lógica de banco de dados vaza para o front-end. Todas as entradas são validadas pelo Zod antes de tocarem no Prisma.
* **`/app/(rotas)`**: Os **Client Components** (`'use client'`). Formulários interativos e Dashboards que consomem as Server Actions de forma assíncrona.
* **Componentes Puros:** Componentes de UI (Inputs, Buttons) reutilizáveis.

## 🐛 Desafios Técnicos Superados 
Durante o desenvolvimento da V1.0, vários desafios complexos foram resolvidos, solidificando a estabilidade do sistema:
1. **Serialização Server-to-Client:** Resolução do conflito entre o tipo `Decimal` do Prisma e as restrições de props do Next.js Client Components, implementando conversores via JavaScript nativo (`Number()`).
2. **Gestão de Infraestrutura Docker:** Tratamento de permissões de utilizador (`EACCES: permission denied`) no Linux/WSL para garantir que instalações via NPM no host reflitam corretamente no container.
3. **Sincronização de Schema:** Mapeamento correto de cache e regeneração do Prisma Client por dentro do container Turbopack.

## 🚀 Próximos Passos (Roadmap V1.1)

- [ ] Conversão automática de projetos com status "COMPLETED" em transações financeiras reais.
- [ ] Gráficos analíticos cruzando gastos pessoais vs. faturamento de projetos.
- [ ] Operações completas de edição e exclusão (CRUD) para transações e projetos.
- [ ] Filtros avançados por data e categoria no Dashboard.

## 💻 Como rodar o projeto localmente

Como a aplicação é containerizada com Docker, subir o ambiente é extremamente simples.

### Pré-requisitos
* [Docker](https://www.docker.com/) e Docker Compose instalados.
* Node.js (opcional, recomendado para intellisense no editor).

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone [https://github.com/SeuUsuario/SistemaCadastro.git](https://github.com/SeuUsuario/SistemaCadastro.git)
cd SistemaCadastro

# Conexão interna do Docker (Aplicação -> Banco)
DATABASE_URL="postgresql://postgres:root@db:5432/sysmanager?schema=public"

# Configuração de Autenticação (NextAuth)
AUTH_SECRET="sua_chave_secreta_aqui_pode_ser_qualquer_texto"
AUTH_URL="http://localhost:3000"

3. **Inicialização do Projeto
docker compose up -d

# Gera o cliente de tradução do Prisma
docker compose exec app npx prisma generate

# Sincroniza as tabelas com o PostgreSQL
docker compose exec app npx prisma db push

Abra o seu navegador e acesse: http://localhost:3000