---
description: Liga o login (Better Auth) quando o projeto ganhar o painel do dono
---

O projeto vai ganhar uma área com senha. Ligue o login no padrão, um passo de cada vez, me mostrando o plano antes. O banco precisa estar ligado (`/ligar-banco`).

1. Na API, o Better Auth com o adaptador do Prisma e a entrada por e-mail e senha, seguindo a documentação oficial dele com o Fastify, não de memória. As tabelas geradas pelo CLI dele no `schema.prisma`, e a migração.
2. A rota `/api/auth/*` montada no Fastify, marcada como pública no guard e fora do Swagger (`hide: true`: a frente fala com ela pelo cliente do Better Auth, não pelo `$api`); o guard passa a conferir a sessão nas rotas não públicas.
3. No `env.ts`: o segredo do login (gerado por um comando que eu rodo no Terminal), o endereço base e as origens confiáveis. Cookie protegido (HttpOnly, Secure no servidor e SameSite) e limite de tentativas na entrada.
4. Na frente: o cliente do Better Auth para Vue, a página `/entrar` e o middleware que protege as páginas do painel.
5. A primeira conta do dono, criada por um comando que eu rodo no meu Terminal, com a senha digitada lá, nunca na conversa.
6. O `pnpm contrato`, os testes (entrada certa, senha errada, rota protegida sem sessão), um teste de tela da página `/entrar` em `e2e/`, a documentação e o commit.
