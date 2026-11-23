# Arquitetura

## 0. Estado

- O projeto nasceu do projeto-modelo do padrão Dagoberto: a frente, a API e o contrato funcionando, com o portão
  ligado. O banco e o login ainda não estão ligados (eles se ligam quando o projeto precisar; veja abaixo).
- O ARQUITETURA-DAGOBERTO.md acrescenta aqui a data e as decisões do projeto.

## O padrão

| Peça        | O padrão                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------- |
| Linguagem   | TypeScript, nos dois lados                                                                        |
| A frente    | Nuxt 4 (Vue), Tailwind e os ícones Lucide                                                         |
| A API       | Fastify, com o Zod validando cada pedido e o Swagger em `/api/docs`                               |
| O contrato  | `packages/shared`: os schemas Zod que a frente e a API usam; e o cliente da frente, gerado da API |
| O banco     | PostgreSQL com Prisma, ligado com `/ligar-banco`                                                  |
| O login     | Better Auth, ligado com `/ligar-login`                                                            |
| Os testes   | Vitest (as regras e as rotas) e Playwright (a tela, num navegador de verdade)                     |
| A IA        | O MCP do Nuxt e o `llms.txt` de cada peça: a lista está no CLAUDE.md                              |
| A qualidade | TypeScript estrito, ESLint, Prettier e o portão (Husky no computador, GitHub Actions no GitHub)   |
| No ar       | Amazon Lightsail com Ubuntu LTS, nginx, systemd e o cadeado do Let's Encrypt (`docs/publicar.md`) |

## As pastas

```
apps/web/app/pages/          uma página por arquivo; o nome do arquivo é o endereço
apps/web/app/components/     os pedaços da tela, por assunto
apps/web/app/plugins/api.ts  o $api: o único jeito de a frente chamar a API
apps/web/app/types/api.d.ts  o contrato gerado da API (pnpm contrato; nunca à mão)
apps/web/app/utils/          funções da tela (o link do WhatsApp)
apps/api/src/routes/         um arquivo de rotas por assunto
apps/api/src/services/       as regras do negócio
apps/api/src/lib/guard.ts    quem pode chamar cada rota
apps/api/src/config/         os dados do negócio, até o banco entrar
apps/api/src/env.ts          as configurações, conferidas na subida
apps/api/scripts/openapi.ts  grava a especificação da API em apps/api/openapi.json
packages/shared/src/         o contrato
e2e/                         os testes de tela (Playwright)
infra/                       preparar o servidor e publicar
```

Arquivo novo copia o jeito de um irmão recente do mesmo tipo. Nunca inventa estrutura.

## O caminho de um pedido

```
O cliente abre a página
  → o Nuxt monta a página no servidor, que pede os dados com $api.GET('/api/negocio')
  → no servidor, o $api fala direto com a API; no navegador, chama /api, que o Nuxt
    (no computador) ou o nginx (no servidor) repassa
  → Fastify: o guard (quem pode) → o Zod (os dados vieram certos?) → a rota chama o service
  → o service decide (e, com o banco ligado, consulta o PostgreSQL pelo Prisma)
  → a API devolve JSON → a página mostra
```

## O contrato, de ponta a ponta

```
packages/shared (Zod)  → a rota da API usa o schema na entrada e na resposta
  → o Swagger descreve a rota em /api/docs
  → pnpm contrato grava apps/api/openapi.json e gera apps/web/app/types/api.d.ts
  → o $api da frente só aceita caminho e campo que a API tem: o pnpm typecheck confere
  → o portão confere que os dois arquivos gerados batem com a API
```

Mudou uma rota: `pnpm contrato` e o commit dos dois arquivos gerados. Se o `pnpm typecheck` acusar o `$api`, a frente
e a API discordam: conserte a causa, nunca o tipo.

## As camadas

| Camada     | Pode                                                                          | Não pode                                        |
| ---------- | ----------------------------------------------------------------------------- | ----------------------------------------------- |
| Página     | Mostrar, chamar a API pelo `$api`, usar componentes                           | Regra de negócio, guardar segredo               |
| Componente | Um pedaço da tela; recebe dados pelas props                                   | Chamar a API direto, decidir preço ou permissão |
| Rota (API) | Receber, validar com Zod, passar pelo guard, chamar o service, responder JSON | HTML, regra de negócio grande                   |
| Service    | As regras do negócio (e o banco, quando ligado)                               | Saber de HTTP                                   |

## As regras absolutas

**Nunca:** a frente falar com o banco; regra de negócio na página; rota sem guard; rota sem schema Zod; a API devolver
HTML; senha, token ou chave na resposta, no Git ou na conversa; `any` sem motivo escrito; o preço decidido no navegador.

**Sempre:** o `$api` para chamar a API; o guard em toda rota (até na pública); schema Zod na entrada e na resposta;
o `pnpm contrato` depois de mudar uma rota; dinheiro em centavos, número inteiro; a hora de Brasília para mostrar; o
teste junto com a funcionalidade (e o teste de tela, em `e2e/`, quando ela aparece na tela); a documentação oficial
da peça antes de usar o que o projeto ainda não usa; o imposto da documentação no fim de cada trabalho.

## As camadas que se ligam quando precisa

- **O banco** (`/ligar-banco`): quando o projeto precisar guardar dados (os pedidos, o cadastro). PostgreSQL com Prisma
  7; os dados do `config/negocio.ts` passam para o banco quando o painel do dono existir.
- **O login** (`/ligar-login`): quando nascer a área com senha (o painel do dono). Better Auth, com o banco já ligado.

## Fica para depois

- (O ARQUITETURA-DAGOBERTO.md preenche com o que o projeto deixou para depois.)
