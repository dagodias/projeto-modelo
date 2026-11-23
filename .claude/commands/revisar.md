---
description: Revisa o projeto atrás de falha de segurança e de regra quebrada, sem mudar nada
---

Revise o projeto sem mudar nenhum arquivo. Confira:

1. A segurança: toda rota da API tem guard e schema Zod; nenhuma senha, chave ou token no código, nos registros ou no Git; o `.env` fora do Git; os cookies protegidos; nenhuma consulta ao banco montada à mão.
2. As regras do padrão (`docs/arquitetura.md`): a frente não decide preço nem permissão; dinheiro em centavos; o `$api` como o único jeito de chamar a API; o contrato gerado em dia (depois do `pnpm contrato`, nada muda no `git status`).
3. O portão: `pnpm segredos`, `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm e2e` passando.
4. A documentação: o estado de cada documento bate com o código.

Me entregue uma lista curta, do mais grave para o menos grave, com o arquivo e a linha de cada ponto. Não conserte nada antes do meu sim.
