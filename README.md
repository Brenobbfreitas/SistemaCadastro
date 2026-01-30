# 🚀 Sistema de Usuários (Next.js + Docker)

Este projeto é uma aplicação Full-Stack containerizada para gerenciamento de usuários. O ambiente de desenvolvimento foi projetado para ser **robusto e imutável**, garantindo que "funcione na minha máquina" signifique funcionar em qualquer lugar.

## 🛠 Tecnologias

* **Frontend/Backend:** [Next.js 15](https://nextjs.org/) (Node.js 20 Alpine)
* **Banco de Dados:** [PostgreSQL 15](https://www.postgresql.org/)
* **ORM:** [Prisma](https://www.prisma.io/) (v5.22)
* **Infraestrutura:** Docker & Docker Compose

---

## ⚡ Como Rodar o Projeto (Quick Start)

### 1. Pré-requisitos
Tenha apenas o [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando. Não é necessário ter Node.js ou PostgreSQL instalados na sua máquina local.

### 2. Configuração de Ambiente
Crie um arquivo `.env` na **raiz do projeto** (ao lado do `docker-compose.yml`) com as seguintes chaves:

```env
POSTGRES_USER=admin_sistema
POSTGRES_PASSWORD=SuaSenhaSegura123
POSTGRES_DB=sistema
DATABASE_URL="postgresql://admin_sistema:SuaSenhaSegura123@db:5432/sistema?schema=public"


Você tem total razão, Neilson. O anterior estava muito focado no "diário de bordo dos erros" que corrigimos, parecendo mais um relatório técnico do que um manual de uso real.

Um README bom deve ser direto: ele explica o que é o projeto, como rodar em 5 minutos e quais os comandos do dia a dia.

Aqui está uma versão profissional, limpa e direta ao ponto. Ele foca no uso prático.

Sugestão de Novo README.md
Copie o código abaixo e substitua no arquivo:

Markdown
# 🚀 Sistema de Usuários (Next.js + Docker)

Este projeto é uma aplicação Full-Stack containerizada para gerenciamento de usuários. O ambiente de desenvolvimento foi projetado para ser **robusto e imutável**, garantindo que "funcione na minha máquina" signifique funcionar em qualquer lugar.

## 🛠 Tecnologias

* **Frontend/Backend:** [Next.js 15](https://nextjs.org/) (Node.js 20 Alpine)
* **Banco de Dados:** [PostgreSQL 15](https://www.postgresql.org/)
* **ORM:** [Prisma](https://www.prisma.io/) (v5.22)
* **Infraestrutura:** Docker & Docker Compose

---

## ⚡ Como Rodar o Projeto (Quick Start)

### 1. Pré-requisitos
Tenha apenas o [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando. Não é necessário ter Node.js ou PostgreSQL instalados na sua máquina local.

### 2. Configuração de Ambiente
Crie um arquivo `.env` na **raiz do projeto** (ao lado do `docker-compose.yml`) com as seguintes chaves:

```env
POSTGRES_USER=admin_sistema
POSTGRES_PASSWORD=SuaSenhaSegura123
POSTGRES_DB=sistema
DATABASE_URL="postgresql://admin_sistema:SuaSenhaSegura123@db:5432/sistema?schema=public"

### 3. Iniciar os Containers
No terminal, na raiz do projeto, execute:

Bash
docker compose up -d --build
Aguarde alguns instantes até que os containers sistema_nextjs e sistema_postgres estejam com status "Running".

### 4. Criar as Tabelas (Migrate)
Com o sistema rodando, execute o comando abaixo para criar a estrutura do banco:

Bash
docker compose exec app npx prisma@5.22.0 migrate dev --name init

### 5. AcessarAbra o navegador em: http://localhost:3000

📝 Comandos Úteis (Cheatsheet)dia a dia. Todos os comandos devem ser rodados na raiz do projeto.

AçãoComandoVer Logs (Erros/Status)

docker compose logs -f appParar o Projeto
docker compose downReiniciar do Zero (Limpar Banco)
docker compose down -v e depois up -dAcessar Terminal do Container
docker compose exec app shAplicar Migração em Produção
docker compose exec app npx prisma@5.22.0 migrate deploy

### 6. ⚠️ Solução de Problemas Comuns
Erro de Versão do Prisma
Se você vir erros como Authentication failed ou schema validation, certifique-se de estar usando a versão fixada no comando.

❌ Não use: npx prisma migrate ... (Isso baixa a v7.0 incompatível)

✅ Use: npx prisma@5.22.0 migrate ...