---
description: Cria uma funcionalidade nova no padrão do projeto, do contrato ao teste
argument-hint: o que a funcionalidade faz
---

Crie esta funcionalidade no padrão do projeto: $ARGUMENTS

Antes de escrever código, leia o CLAUDE.md e o docs/arquitetura.md e me mostre o plano: o que muda em cada camada e como vamos testar. Espere o meu sim.

Depois, nesta ordem:

1. O contrato: o schema Zod no `packages/shared`, se a frente também usa o dado.
2. A regra: o service em `apps/api/src/services`, com o teste dele.
3. A rota: em `apps/api/src/routes`, com o guard, o schema e o resumo em português (ele aparece em `/api/docs`).
4. A tela: a página em `apps/web/app/pages` e os componentes, chamando a API só pelo `$api`.
5. A prova: rode `pnpm test`, `pnpm lint` e `pnpm typecheck`, e conserte até passar.
6. O imposto: atualize a documentação (o estado no topo do documento do assunto, o CLAUDE.md se algo mudou de lugar, o `docs/pendente.md`).
7. Me diga o que mudou e em quais arquivos, e faça o commit.
