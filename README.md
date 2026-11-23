# Projeto-modelo · padrão Dagoberto

A base para começar um projeto grande com IA: a frente e a API separadas, TypeScript nos dois lados e tudo
documentado desde o primeiro dia. É o padrão do Curso de Full Stack com IA, do Ensino Social.

## O que já vem pronto

| Parte                 | O que é                                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web`            | A frente: Nuxt 4, Tailwind e os ícones Lucide. A página sai pronta do servidor (bom para o Google e para a prévia do link no WhatsApp) |
| `apps/api`            | A API: Fastify com Zod e a documentação automática em `/api/docs`                                                                      |
| `packages/shared`     | O contrato: o formato dos dados, usado pelos dois lados                                                                                |
| O portão              | Antes de cada commit e de cada envio, e a cada push no GitHub: segredos esquecidos, lint, tipos, testes e build                        |
| `.claude/`            | As regras da IA (o que ela não pode fazer) e os comandos do projeto                                                                    |
| `CLAUDE.md` e `docs/` | A memória: o mapa do projeto e o estado de cada assunto                                                                                |
| `infra/`              | A conexão com o servidor: prepará-lo e publicar com um comando                                                                         |

## Começar

1. Crie o seu projeto a partir deste modelo, no botão **Use this template** do GitHub, ou pelo Terminal:

   ```
   gh repo create meu-projeto --template dagodias/projeto-modelo --private --clone
   ```

2. Na pasta do projeto: `pnpm install`.
3. `pnpm dev`: a frente em http://localhost:3000 e a API em http://localhost:3333 (a documentação em `/api/docs`).

Precisa de: Git, Node.js 24.15 ou mais novo (a versão LTS) e pnpm.

## Os comandos

| Comando                                        | O que faz                                |
| ---------------------------------------------- | ---------------------------------------- |
| `pnpm dev`                                     | Liga a frente e a API                    |
| `pnpm test`                                    | Roda os testes                           |
| `pnpm lint`, `pnpm typecheck`, `pnpm segredos` | O portão, um por um                      |
| `pnpm build`                                   | O build de produção                      |
| `pnpm publicar`                                | Publica no servidor (`docs/publicar.md`) |

## Com a IA

Abra a pasta no Claude Code: ela lê o `CLAUDE.md` sozinha. Os comandos do projeto: `/nova-funcionalidade`, `/imposto`,
`/revisar`, `/ligar-banco`, `/ligar-login` e `/publicar`.
