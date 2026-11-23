---
description: Liga o banco de dados (PostgreSQL com Prisma) quando o projeto precisar guardar dados
---

O projeto vai começar a guardar dados. Ligue o banco no padrão (`docs/arquitetura.md`, "As camadas que se ligam quando precisa"), um passo de cada vez, me mostrando o plano antes:

1. Confira se o PostgreSQL está instalado e ligado no computador; se não estiver, instale pelo instalador do sistema, com o meu pode. Crie o usuário do projeto com permissão de criar banco (`createuser -P --createdb`) e o banco dele. A senha, eu digito no meu Terminal.
2. Na API, o Prisma 7: o `prisma.config.ts`, o adaptador `@prisma/adapter-pg`, o cliente gerado numa pasta do projeto e o `DATABASE_URL` no `.env` (e o nome dele no `.env.example`). Confira tudo no guia oficial do Prisma, não de memória. Libere no `allowBuilds` do `pnpm-workspace.yaml` só o que o Prisma precisar.
3. O primeiro modelo é o `Negocio`, com os dados que hoje moram no `apps/api/src/config/negocio.ts`: o nome, a frase, o telefone, o `temWhatsapp`, o e-mail, o endereço, os horários e as redes (e o `createdAt` e o `updatedAt`). Os produtos continuam no arquivo por enquanto: eles vão para o banco junto com o catálogo. A primeira migração e o `src/lib/prisma.ts`.
4. A semente: um script que lê o `config/negocio.ts` e grava o negócio no banco só se a tabela estiver vazia, no jeito de semente do guia oficial do Prisma. Rodar de novo não apaga nem repete nada, e o que o dono mudar no banco fica como está.
5. O service do negócio passa a ler o negócio do banco (e os produtos, do arquivo). O contrato não muda: a rota, a frente e os testes de tela continuam iguais.
6. Os scripts na raiz: `db:migrate` (as migrações, com a semente no fim), `db:semente` e `db:studio` (para ver os dados). No servidor, o atualizar (a cópia instalada em `/usr/local/lib/<projeto>/`) já roda o `db:semente` depois das migrações, a cada publicação.
7. O portão do GitHub: um PostgreSQL de teste no `.github/workflows/portao.yml`, com as migrações e a semente antes dos testes, para eles rodarem lá também.
8. Rode os testes, atualize o `docs/arquitetura.md` (o banco ligado, com o `Negocio`) e o CLAUDE.md (a linha dos dados), e faça o commit. O banco do servidor é criado uma vez, antes da próxima publicação, por um comando que eu rodo: `ssh <apelido> "sudo /usr/local/lib/<projeto>/criar-banco.sh <projeto>"` (está no `docs/publicar.md`).
