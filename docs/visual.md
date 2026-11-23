# A cara do site

## 0. Estado

- O site nasceu com a casca clean do projeto-modelo: o topo com a logo e o menu (no celular, o menu abre num botão),
  o rodapé com os contatos, as redes e os links, as páginas de base (início, sobre, contato, privacidade e a de erro)
  e as peças da tela. O claro e o escuro seguem o aparelho de quem visita.
- Os contatos: o telefone sempre; o WhatsApp só se o número atende nele (o `temWhatsapp`); o e-mail só se o negócio
  tem. O contato e o rodapé mostram só o que existe (`apps/web/app/utils/contato.ts`).
- O que ainda é de exemplo está marcado: a logo "Sua logo", a foto "Sua foto aqui", o selo amarelo "Exemplo" nas
  seções, o telefone 5500000000000, o e-mail contato@meunegocio.example e os outros dados do `negocio.ts`, e a imagem
  da prévia do link. O `/publicar` avisa o que sobrou antes de pôr no ar.

## Onde mora cada coisa

| O quê                                                                     | Onde                                                                                               |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| O nome, a frase, o telefone, o e-mail, o endereço, os horários e as redes | `apps/api/src/config/negocio.ts` (a página recebe da API)                                          |
| Quais contatos aparecem (o telefone, o WhatsApp e o e-mail)               | `apps/web/app/utils/contato.ts`, usado pelo contato e pelo rodapé                                  |
| A logo                                                                    | `apps/web/public/logo.svg`: troque o arquivo, com o mesmo nome                                     |
| A fonte, a cor da marca e o arredondado                                   | `apps/web/app/assets/css/main.css`, no `@theme`                                                    |
| O menu e o endereço do site                                               | `apps/web/app/app.config.ts`                                                                       |
| Os ícones e a prévia do link                                              | `apps/web/public/`: `icone.svg`, `favicon.ico`, `apple-touch-icon.png` e `previa.png` (1200 x 630) |
| As peças da tela                                                          | `apps/web/app/components/base`, todas juntas em `/guia-de-estilo`                                  |
| O topo, o rodapé e a logo                                                 | `apps/web/app/components/site`                                                                     |

## As peças

| Peça             | Para quê                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| `BaseBotao`      | Uma ação. Com `para`, é link (página do site ou endereço de fora); sem, é botão. Um principal por tela |
| `BaseCartao`     | Um assunto num bloco com borda: um produto, um contato, um passo                                       |
| `BaseSecao`      | Um pedaço da página com título (h2), subtítulo e o conteúdo, na largura do site                        |
| `BaseCabecalho`  | O começo de uma página interna, com o título dela (h1)                                                 |
| `BaseSelo`       | Uma etiqueta curta: Aberto agora, Novo, Exemplo                                                        |
| `BaseAviso`      | Uma mensagem para quem está na página: informação, sucesso, atenção ou erro                            |
| `BaseVazio`      | O que aparece quando ainda não há nada para mostrar, com o próximo passo                               |
| `BaseCarregando` | O lugar do conteúdo enquanto ele não chega                                                             |

## As regras

- Na tela, use as peças e as cores do tema: `marca-*` para a marca e `stone-*` para os neutros. Peça nova nasce em
  `components/base` e entra no `/guia-de-estilo`.
- Primeiro o celular: letras legíveis, botões de pelo menos 44 de altura e nada saindo da tela para o lado (o teste de
  tela confere).
- Claro e escuro: toda cor de fundo e de texto tem a sua versão `dark:`.
- Acessível: um título (h1) por página, texto alternativo nas imagens, o foco do teclado visível e bom contraste.
- Nada carregado de fora: a fonte, os ícones e as imagens moram no projeto. Sem cookie e sem rastreador. Mudou isso, a
  página de privacidade muda junto.

## Como mexer

- **A cor da marca:** no `main.css`, troque `emerald` nas 11 linhas por outra cor do Tailwind (red, orange, amber,
  sky, blue, violet, rose...).
- **A fonte:** instale pelo Fontsource (`pnpm --filter @projeto/web add @fontsource-variable/<nome>`) e troque o
  `@import` e o `--font-sans` do `main.css`.
- **Uma página nova:** um arquivo em `apps/web/app/pages`, com o `useSeoMeta` (title, description, ogTitle e
  ogDescription) e o teste de tela dela; se for para o menu, uma linha no `app.config.ts`.
- **Os contatos:** o telefone, o `temWhatsapp` (o número também atende no WhatsApp?) e o e-mail (sem e-mail, apague a
  linha) moram no `negocio.ts`. Um jeito novo de falar com o negócio entra no `utils/contato.ts`, com o teste dele.
- **O endereço do site:** quando houver domínio, escreva no `enderecoDoSite` do `app.config.ts`. A prévia do link
  compartilhado e o endereço oficial de cada página dependem dele.
- **O estilo de um modelo baixado:** coloque o modelo, descompactado, em `docs/estilo/` e use o `/trocar-estilo`. Essa
  pasta fica fora do Git e do portão, por causa da licença e do peso do modelo.

## Armadilhas

- A classe de esconder passada para uma peça (`<BaseBotao class="hidden sm:inline-flex">`) perde para a classe da
  própria peça. Esconda numa caixa em volta: `<div class="hidden sm:block"><BaseBotao /></div>`.
- A logo em SVG, aberta como imagem, não usa a fonte do site nem as classes `dark:`. O `logo.svg` de exemplo tem o
  próprio estilo para o escuro; a logo nova com letras escuras precisa do mesmo cuidado.
- A prévia do link compartilhado (no WhatsApp, no Facebook) pede o endereço completo da imagem: sem o
  `enderecoDoSite`, ela não aparece.
- O e-mail comprido não cabe no celular e quebrava no meio do nome. Os `pedacos` do `utils/contato.ts`, com um `<wbr>`
  entre eles, fazem a linha quebrar depois do @; o `wrap-anywhere` fica só como rede, para nada sair da tela.

## Pendências

- nenhuma
