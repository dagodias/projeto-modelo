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
| O contrato  | `packages/shared`: os schemas Zod que a frente e a API usam                                       |
| O banco     | PostgreSQL com Prisma, ligado com `/ligar-banco`                                                  |
| O login     | Better Auth, ligado com `/ligar-login`                                                            |
| Os testes   | Vitest                                                                                            |
| A qualidade | TypeScript estrito, ESLint, Prettier e o portão (Husky no computador, GitHub Actions no GitHub)   |
| No ar       | Amazon Lightsail com Ubuntu LTS, nginx, systemd e o cadeado do Let's Encrypt (`docs/publicar.md`) |

## As pastas

```
apps/web/app/pages/          uma página por arquivo; o nome do arquivo é o endereço
apps/web/app/components/     os pedaços da tela, por assunto
apps/web/app/plugins/api.ts  o $api: o único jeito de a frente chamar a API
apps/web/app/utils/          funções da tela (o link do WhatsApp)
apps/api/src/routes/         um arquivo de rotas por assunto
apps/api/src/services/       as regras do negócio
apps/api/src/lib/guard.ts    quem pode chamar cada rota
apps/api/src/config/         os dados do negócio, até o banco entrar
apps/api/src/env.ts          as configurações, conferidas na subida
packages/shared/src/         o contrato
infra/                       preparar o servidor e publicar
```

Arquivo novo copia o jeito de um irmão recente do mesmo tipo. Nunca inventa estrutura.

## O caminho de um pedido

```
O cliente abre a página
  → o Nuxt monta a página no servidor, que pede os dados com $api('/negocio')
  → /api chega à API (no computador, o Nuxt repassa; no servidor, o nginx)
  → Fastify: o guard (quem pode) → o Zod (os dados vieram certos?) → a rota chama o service
  → o service decide (e, com o banco ligado, consulta o PostgreSQL pelo Prisma)
  → a API devolve JSON → a página mostra
```

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
dinheiro em centavos, número inteiro; a hora de Brasília para mostrar; o teste junto com a funcionalidade; o imposto da
documentação no fim de cada trabalho.

## As camadas que se ligam quando precisa

- **O banco** (`/ligar-banco`): quando o projeto precisar guardar dados (os pedidos, o cadastro). PostgreSQL com Prisma
  7; os dados do `config/negocio.ts` passam para o banco quando o painel do dono existir.
- **O login** (`/ligar-login`): quando nascer a área com senha (o painel do dono). Better Auth, com o banco já ligado.

## Fica para depois

- (O ARQUITETURA-DAGOBERTO.md preenche com o que o projeto deixou para depois.)
