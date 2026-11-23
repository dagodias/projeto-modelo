---
description: Liga o login (Better Auth) quando o projeto ganhar o painel do dono
---

O projeto vai ganhar uma área com senha. Ligue o login no padrão, um passo de cada vez, me mostrando o plano antes. O banco precisa estar ligado (`/ligar-banco`).

1. Na API, o Better Auth com o adaptador do Prisma e a entrada por e-mail e senha, seguindo a documentação oficial dele com o Fastify, não de memória. As tabelas geradas pelo CLI dele no `schema.prisma`, e a migração.
2. A rota `/api/auth/*` montada no Fastify, marcada como pública no guard e fora do Swagger (`hide: true`: a frente fala com ela pelo cliente do Better Auth, não pelo `$api`); o guard passa a conferir a sessão nas rotas não públicas.
3. No `env.ts`: o segredo do login (gerado por um comando que eu rodo no Terminal), o endereço base e as origens confiáveis. Cookie protegido (HttpOnly, Secure no servidor e SameSite) e limite de tentativas na entrada.
4. Na frente: o cliente do Better Auth para Vue, a página `/entrar` e o middleware que protege as páginas do painel. Sem sessão, quem abre uma página do painel vai para o `/entrar`; quem entra vai para o `/painel`.
5. A página `/painel`, simples e protegida pelo middleware: o nome do dono e o botão Sair, que encerra a sessão e volta para o início. Ela fica fora do menu do site e fora do Google (`noindex`). É dela que o painel cresce depois.
6. A primeira conta do dono, criada por um comando que eu rodo no meu Terminal, com a senha digitada lá, nunca na conversa.
7. O `pnpm contrato` e os testes: os da API (entrada certa, senha errada, rota protegida sem sessão) e os de tela, em `e2e/` (a página `/entrar`; o `/painel` sem sessão leva para o `/entrar`; com a conta de teste, o `/painel` mostra o nome e o Sair encerra a sessão). A conta de teste existe só no banco dos testes, com uma senha de teste, nunca a do dono.
8. Atualize a documentação (o `docs/arquitetura.md` e o CLAUDE.md, com o `/painel`) e faça o commit.
