---
description: Publica no servidor o que já está no GitHub
---

Publique o projeto no servidor seguindo o `docs/publicar.md`:

1. Procure o que ainda é de exemplo e me mostre a lista: a logo "Sua logo" (`apps/web/public/logo.svg`), a foto "Sua foto aqui", o selo "Exemplo" nas páginas, o telefone `5500000000000`, o e-mail `contato@meunegocio.example` e os outros dados de exemplo do `apps/api/src/config/negocio.ts`, a `previa.png` e os ícones de exemplo, e o `enderecoDoSite` vazio no `apps/web/app/app.config.ts` com o site já tendo domínio. Se sobrou algo, pergunte se publico assim.
2. Confira que não há mudança sem commit e que o `main` está no GitHub, com o portão verde.
3. Rode `pnpm publicar` e acompanhe a saída.
4. Confira no fim: o endereço do site abre com o cadeado, `/api/saude` responde e o `/api/docs` está fechado (no ar, ele só abre com `DOCS_NO_AR=true` no `.env` do servidor).
5. Se algo der errado, pare e me mostre o erro. Se o build falhar, o site continua na versão de antes; se a versão nova não responder, o servidor volta sozinho para a anterior. Depois, proponha o conserto ("Voltar atrás", no `docs/publicar.md`).
