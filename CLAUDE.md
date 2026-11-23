# Projeto

Este projeto nasceu do projeto-modelo do padrão Dagoberto: a frente (Nuxt) e a API (Fastify) separadas, TypeScript
nos dois lados. O DOCUMENTACAO-DAGOBERTO.md troca este parágrafo pelo que o projeto é, em duas linhas.

## Onde mora cada coisa

| Assunto                                                                                                            | Leia                                                                             |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| O padrão, as pastas, as regras, a segurança e o que se liga depois (o banco, o login, as IAs, os serviços de fora) | docs/arquitetura.md                                                              |
| As rotas da API                                                                                                    | http://localhost:3333/api/docs (o Swagger) e apps/api/src/routes                 |
| Os dados do negócio (até o banco entrar)                                                                           | apps/api/src/config/negocio.ts                                                   |
| A cara do site: logo, cores, fonte, menu, peças                                                                    | docs/visual.md (as peças juntas em http://localhost:3000/guia-de-estilo)         |
| O contrato entre a frente e a API                                                                                  | packages/shared/src/index.ts (os schemas Zod)                                    |
| O contrato gerado da API (nunca se edita à mão)                                                                    | apps/api/openapi.json e apps/web/app/types/api.d.ts, feitos pelo `pnpm contrato` |
| Os testes de tela (o navegador abre o site)                                                                        | e2e/                                                                             |
| Publicar no servidor                                                                                               | docs/publicar.md                                                                 |
| O que falta                                                                                                        | docs/pendente.md                                                                 |

## Como rodar

- `pnpm install`, na primeira vez. Para os testes de tela, baixe também o navegador:
  `pnpm exec playwright install chromium`.
- `pnpm dev`: a frente em http://localhost:3000 e a API em http://localhost:3333.
- `pnpm contrato`: mudou uma rota da API, gere de novo a especificação e os tipos da frente, e faça o commit dos dois.
- `pnpm test`, `pnpm lint`, `pnpm typecheck` e `pnpm segredos`: o portão, um por um.
- `pnpm e2e`: os testes de tela, no tamanho de um celular e de um computador.

## As regras que não podem ser quebradas

- A frente nunca fala com o banco: quem decide preço, pedido e permissão é a API.
- Toda rota da API tem guard e schema Zod; o schema que a frente também usa mora no `packages/shared`.
- A frente chama a API só pelo `$api`, com o caminho completo (`$api.GET('/api/negocio')`): o tipo vem do contrato
  gerado. Se o `pnpm typecheck` acusar o `$api`, a frente e a API discordam: conserte a causa, nunca o tipo.
- Dinheiro em centavos, número inteiro.
- Senha e chave só no `.env`: nunca no Git, nunca na conversa.
- Antes de mudar, o plano; depois, os testes passando, o que mudou e em quais arquivos.

## A documentação de cada peça (nunca de memória)

As bibliotecas mudam mais rápido do que a memória de qualquer IA. A versão instalada está no `package.json` de cada
app. Antes de usar uma função ou opção que o projeto ainda não usa, confira na fonte oficial; nunca escreva de memória.

| Peça                             | Onde conferir                                                            |
| -------------------------------- | ------------------------------------------------------------------------ |
| Nuxt                             | o servidor MCP oficial do Nuxt (`.mcp.json`) e https://nuxt.com/llms.txt |
| Vue                              | https://vuejs.org/llms.txt                                               |
| Fastify                          | https://fastify.dev/llms.txt                                             |
| Zod                              | https://zod.dev/llms.txt                                                 |
| Prisma                           | https://www.prisma.io/docs/llms.txt                                      |
| Better Auth                      | https://www.better-auth.com/llms.txt                                     |
| Vitest                           | https://vitest.dev/llms.txt                                              |
| Playwright                       | https://playwright.dev/docs/intro                                        |
| Tailwind                         | https://tailwindcss.com/docs                                             |
| O cliente da API (openapi-fetch) | https://openapi-ts.dev/openapi-fetch/                                    |
| pnpm                             | https://pnpm.io/motivation                                               |

O `llms.txt` é o índice que o próprio site escreve para a IA, com o endereço de cada página em texto.

## Os comandos do projeto

`/nova-funcionalidade` · `/imposto` · `/revisar` · `/ligar-banco` · `/ligar-login` · `/publicar` · `/trocar-estilo`

## Como começar qualquer tarefa

1. Ache o assunto na tabela acima e leia o "0. Estado" do documento dele.
2. Confira o estado real (o código, o que está rodando) antes de afirmar.
3. Em dúvida sobre o que a pessoa quer, pergunte.

## Ao terminar (o imposto da documentação)

- O estado novo vai para o "0. Estado" do documento do assunto, nunca para cá. Assunto novo ganha documento e uma
  linha na tabela acima.
- O que ficou faltando vai para o `docs/pendente.md`; o que foi resolvido é marcado lá.
- Apague o que deixou de ser verdade, e faça o commit.
