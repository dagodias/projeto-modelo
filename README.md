# Projeto-modelo · padrão Dagoberto

A base para começar um projeto grande com IA: a frente e a API separadas, TypeScript nos dois lados e tudo
documentado desde o primeiro dia. É o padrão do Curso de Full Stack com IA, do Ensino Social.

## O que já vem pronto

| Parte                    | O que é                                                                                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web`               | A frente: Nuxt 4, Tailwind e os ícones Lucide. A página sai pronta do servidor (bom para o Google e para a prévia do link no WhatsApp)    |
| A cara do site           | Um site clean pronto para crescer: topo com logo e menu, rodapé, claro e escuro, as páginas de base e as peças da tela (`docs/visual.md`) |
| `apps/api`               | A API: Fastify com Zod e a documentação automática em `/api/docs`                                                                         |
| `packages/shared`        | O contrato: o formato dos dados, usado pelos dois lados                                                                                   |
| O contrato               | A frente só chama caminho e campo que a API tem: os tipos dela são gerados da API (`pnpm contrato`)                                       |
| O portão                 | Antes de cada commit e de cada envio, e a cada push no GitHub: segredos esquecidos, lint, tipos, contrato, testes, build e testes de tela |
| `.claude/` e `.mcp.json` | As regras da IA (o que ela não pode fazer), os comandos do projeto e a documentação oficial do Nuxt, ligada                               |
| `CLAUDE.md` e `docs/`    | A memória: o mapa do projeto e o estado de cada assunto                                                                                   |
| `infra/`                 | A conexão com o servidor: prepará-lo e publicar com um comando                                                                            |

## Começar

1. Crie o seu projeto a partir deste modelo, no botão **Use this template** do GitHub, ou pelo Terminal:

   ```
   gh repo create meu-projeto --template dagodias/projeto-modelo --private --clone
   ```

2. Na pasta do projeto: `pnpm install`. Para os testes de tela, baixe o navegador: `pnpm exec playwright install chromium`.
3. `pnpm dev`: a frente em http://localhost:3000 e a API em http://localhost:3333 (a documentação em `/api/docs`).

Precisa de: Git, Node.js 24.15 ou mais novo (a versão LTS) e pnpm.

## Deixe com a sua cara

| O que trocar                                                                 | Onde                                                                                 |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| O nome, a frase, o WhatsApp, o endereço, os horários, os produtos e as redes | `apps/api/src/config/negocio.ts`                                                     |
| A logo ("Sua logo")                                                          | `apps/web/public/logo.svg`: troque o arquivo, com o mesmo nome                       |
| A cor da marca, a fonte e o arredondado                                      | `apps/web/app/assets/css/main.css` (a cor: troque a palavra `emerald`)               |
| O menu e o endereço do site                                                  | `apps/web/app/app.config.ts`                                                         |
| O ícone da aba, o do celular e a imagem da prévia do link                    | `apps/web/public/`: `icone.svg`, `favicon.ico`, `apple-touch-icon.png`, `previa.png` |
| As seções de exemplo                                                         | as marcadas com o selo "Exemplo", em `apps/web/app/pages`                            |

Todas as peças da tela aparecem juntas em http://localhost:3000/guia-de-estilo (fora do menu e do Google). Quer o
estilo de um modelo pronto? Coloque o modelo em `docs/estilo/` e peça com o `/trocar-estilo`.

## Os comandos

| Comando                                        | O que faz                                                |
| ---------------------------------------------- | -------------------------------------------------------- |
| `pnpm dev`                                     | Liga a frente e a API                                    |
| `pnpm test`                                    | Roda os testes                                           |
| `pnpm e2e`                                     | Os testes de tela, num navegador de verdade              |
| `pnpm contrato`                                | Gera de novo o contrato, depois de mudar uma rota da API |
| `pnpm lint`, `pnpm typecheck`, `pnpm segredos` | O portão, um por um                                      |
| `pnpm build`                                   | O build de produção                                      |
| `pnpm publicar`                                | Publica no servidor (`docs/publicar.md`)                 |

## Com a IA

Abra a pasta no Claude Code: ela lê o `CLAUDE.md` sozinha. Na primeira conversa, ela pergunta se pode usar o servidor
do Nuxt (do `.mcp.json`): é a documentação oficial do Nuxt, só de leitura. Os comandos do projeto:
`/nova-funcionalidade`, `/imposto`, `/revisar`, `/ligar-banco`, `/ligar-login`, `/publicar` e `/trocar-estilo`.
