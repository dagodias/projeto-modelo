---
description: Liga o banco de dados (PostgreSQL com Prisma) quando o projeto precisar guardar dados
---

O projeto vai começar a guardar dados. Ligue o banco no padrão (`docs/arquitetura.md`, "As camadas que se ligam quando precisa"), um passo de cada vez, me mostrando o plano antes:

1. Confira se o PostgreSQL está instalado e ligado no computador; se não estiver, instale pelo instalador do sistema, com o meu pode. Crie o usuário do projeto com permissão de criar banco (`createuser -P --createdb`) e o banco dele. A senha, eu digito no meu Terminal.
2. Na API, o Prisma 7: o `prisma.config.ts`, o adaptador `@prisma/adapter-pg`, o cliente gerado numa pasta do projeto e o `DATABASE_URL` no `.env` (e o nome dele no `.env.example`). Confira tudo no guia oficial do Prisma, não de memória. Libere no `allowBuilds` do `pnpm-workspace.yaml` só o que o Prisma precisar.
3. O primeiro modelo no `schema.prisma` (com `createdAt` e `updatedAt`), a primeira migração e o `src/lib/prisma.ts`.
4. Os scripts na raiz: `db:migrate` e `db:studio` (para ver os dados).
5. O portão do GitHub: um PostgreSQL de teste no `.github/workflows/portao.yml`, para os testes rodarem lá também.
6. Rode os testes, atualize o `docs/arquitetura.md` (o banco ligado) e o CLAUDE.md (a linha dos dados), e faça o commit.
