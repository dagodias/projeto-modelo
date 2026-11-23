# Projeto

Este projeto nasceu do projeto-modelo do padrão Dagoberto: a frente (Nuxt) e a API (Fastify) separadas, TypeScript
nos dois lados. O DOCUMENTACAO-DAGOBERTO.md troca este parágrafo pelo que o projeto é, em duas linhas.

## Onde mora cada coisa

| Assunto                                   | Leia                                                             |
| ----------------------------------------- | ---------------------------------------------------------------- |
| O padrão, as pastas e as regras de código | docs/arquitetura.md                                              |
| As rotas da API                           | http://localhost:3333/api/docs (o Swagger) e apps/api/src/routes |
| Os dados do negócio (até o banco entrar)  | apps/api/src/config/negocio.ts                                   |
| O contrato entre a frente e a API         | packages/shared/src/index.ts                                     |
| Publicar no servidor                      | docs/publicar.md                                                 |
| O que falta                               | docs/pendente.md                                                 |

## Como rodar

- `pnpm install`, na primeira vez.
- `pnpm dev`: a frente em http://localhost:3000 e a API em http://localhost:3333.
- `pnpm test`, `pnpm lint`, `pnpm typecheck` e `pnpm segredos`: o portão, um por um.

## As regras que não podem ser quebradas

- A frente nunca fala com o banco: quem decide preço, pedido e permissão é a API.
- Toda rota da API tem guard e schema Zod; o schema que a frente também usa mora no `packages/shared`.
- Dinheiro em centavos, número inteiro.
- Senha e chave só no `.env`: nunca no Git, nunca na conversa.
- Antes de mudar, o plano; depois, os testes passando, o que mudou e em quais arquivos.

## Os comandos do projeto

`/nova-funcionalidade` · `/imposto` · `/revisar` · `/ligar-banco` · `/ligar-login` · `/publicar`

## Como começar qualquer pedido

1. Ache o assunto na tabela acima e leia o "0. Estado" do documento dele.
2. Confira o estado real (o código, o que está rodando) antes de afirmar.
3. Em dúvida sobre o que a pessoa quer, pergunte.

## Ao terminar (o imposto da documentação)

- O estado novo vai para o "0. Estado" do documento do assunto, nunca para cá. Assunto novo ganha documento e uma
  linha na tabela acima.
- O que ficou faltando vai para o `docs/pendente.md`; o que foi resolvido é marcado lá.
- Apague o que deixou de ser verdade, e faça o commit.
