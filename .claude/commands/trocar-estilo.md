---
description: Traz para o site o estilo de um modelo baixado (cores, fontes, jeito das peças), sem mudar os dados
argument-hint: o que você quer no estilo (o modelo fica em docs/estilo)
---

Traga para o site o estilo do modelo que está em `docs/estilo/`. O que eu quero: $ARGUMENTS

Antes de mudar, leia o `docs/visual.md`, me mostre o plano e espere o meu sim.

1. Olhe o modelo sem rodar nada dele: as cores, as fontes, os tamanhos, os espaços, o arredondado, as sombras e o jeito dos botões, dos cartões, do topo e do rodapé. Diga em poucas linhas o que achou e qual é a licença (o arquivo de licença do modelo ou a página de onde ele veio). Se a licença não deixar usar num site, pare e me avise.
2. Traga o estilo, não o código: as cores e o arredondado vão para o `@theme` do `apps/web/app/assets/css/main.css`; a fonte vem para dentro do projeto (pelo Fontsource, ou o arquivo da fonte, se a licença deixar), nunca de um CDN; o jeito das peças vai para `components/base` e `components/site`. Sem Bootstrap, jQuery ou outro script do modelo, sem rastreador e sem nada carregado de fora.
3. O que não muda: os dados (vêm da API), as páginas e o que elas fazem, o claro e o escuro, o que cabe no celular e a acessibilidade (o contraste, o foco visível e o texto alternativo).
4. Imagem do modelo só entra se a licença deixar usar no site; foto da demonstração quase nunca deixa. Se a licença pedir crédito, ele vai no rodapé.
5. A prova: rode `pnpm dev`, confira o `/guia-de-estilo` e as páginas no tamanho do celular e do computador, no claro e no escuro, rode `pnpm test` e `pnpm e2e`, e me mostre como ficou antes do commit.
6. O imposto: o `docs/visual.md` com o estilo novo (de onde veio e a licença) e o commit, sem a pasta `docs/estilo/`, que fica fora do Git.
