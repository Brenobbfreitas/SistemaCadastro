🚀 Sistema Next.js + Prisma
Este é um projeto Full-Stack containerizado para gerenciamento de usuários, utilizando Next.js 15, Prisma ORM e PostgreSQL. A arquitetura foi refinada para garantir compatibilidade total entre os binários do Prisma e as bibliotecas do sistema operacional, resolvendo gargalos comuns de ambientes virtuais (WSL2/Docker).
🛠️ Stack Tecnológica
Frontend/Backend: Next.js 15 (App Router)
Banco de Dados: PostgreSQL
ORM: Prisma
Segurança: Bcryptjs (Hash de senhas) e Server Actions.
Infraestrutura: Docker (Image: Node:20-slim)


🐋 Arquitetura e Estabilidade (Docker)
Diferente de configurações padrão, este projeto utiliza a imagem base Debian-Slim em vez de Alpine. Isso garante que as dependências do openssl 3.0.x necessárias para o motor do Prisma funcionem nativamente, eliminando erros de "Shared Library" ou "Symbol not found".

Configuração Crítica (schema.prisma)
O gerador está configurado para ser resiliente em múltiplos ambientes:generator client {

  provider        = "prisma-client-js"

  binaryTargets   = ["native", "debian-openssl-3.0.x"]

}

⚡ Como Rodar o Projeto
1. Pré-requisitos
Docker Desktop instalado e rodando.
Nota: Não é necessário instalar Node ou Postgres localmente.
2. Variáveis de Ambiente
Crie um arquivo .env na raiz:DATABASE_URL="postgresql://user:password@db:5432/mydatabase?schema=public"

NEXTAUTH_SECRET="<sua-chave>"

3. Inicialização
Execute o comando de inicialização no terminal:docker compose up -d

O sistema estará disponível em: http://localhost:3000

📝 Cheatsheet de Comandos
Aqui estão alguns comandos úteis para gerenciar o projeto containerizado:

Ação -
Comando -
Ver Logs em tempo real
docker compose logs -f app
Reiniciar servidor
docker compose restart app
Acessar Banco Visualmente
docker compose exec app npx prisma studio
Limpar tudo (Volumes e Containers)
docker compose down -v
Refazer Build Manual
docker compose exec app npm run build

🛠️ Server Actions Implementadas
A lógica de negócio está protegida no servidor, utilizando as novas Server Actions do Next.js:

addUser: Realiza hash da senha (12 rounds) e persiste no Postgres.
getUsers: Recupera usuários ordenados por data de criação.
deleteUser: Exclusão segura com validação de sessão ativa.
login / logout: Gestão de autenticação assíncrona.

⚠️ Solução de Problemas
Se o Prisma reportar erro de inicialização ou "Engine not found":

Verifique se o binaryTargets no schema.prisma inclui debian-openssl-3.0.x.
Rode docker compose exec app npx prisma generate novamente.
Reinicie o container com docker compose restart app.


