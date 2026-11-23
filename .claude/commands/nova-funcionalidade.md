---
description: Cria uma funcionalidade nova no padrão do projeto, do contrato ao teste
argument-hint: o que a funcionalidade faz
---

Crie esta funcionalidade no padrão do projeto: $ARGUMENTS

Antes de escrever código, leia o CLAUDE.md e o docs/arquitetura.md e me mostre o plano: o que muda em cada camada e como vamos testar. Espere o meu sim. Antes de usar uma função ou opção que o projeto ainda não usa, confira na documentação oficial da peça (a lista está no CLAUDE.md).

Depois, nesta ordem:

1. O contrato: o schema Zod no `packages/shared`, se a frente também usa o dado.
2. A regra: o service em `apps/api/src/services`, com o teste dele.
3. A rota: em `apps/api/src/routes`, com o guard, o schema e o resumo em português (ele aparece em `/api/docs`).
4. O contrato gerado: rode `pnpm contrato` (a especificação da API e os tipos da frente).
5. A tela: a página em `apps/web/app/pages` e os componentes, chamando a API só pelo `$api`, com o caminho completo (`$api.GET('/api/...')`).
6. A prova: rode `pnpm test`, `pnpm lint` e `pnpm typecheck`; se a funcionalidade aparece na tela, um teste de tela novo em `e2e/` e `pnpm e2e`. Conserte até passar.
7. O imposto: atualize a documentação (o estado no topo do documento do assunto, o CLAUDE.md se algo mudou de lugar, o `docs/pendente.md`).
8. Me diga o que mudou e em quais arquivos, e faça o commit (com os dois arquivos do contrato gerado, se mudaram).
