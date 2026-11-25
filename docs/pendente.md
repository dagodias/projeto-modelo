# Pendências

Próximo passo: P-001

O caminho do projeto até o sistema de pedidos, na ordem em que ele cresce. Veio pronto no kit do curso; daqui em
diante, a IA mantém em dia, no imposto do fim de cada trabalho (o CLAUDE.md).

## P-001 · A página principal do negócio

- **Assunto:** a página inicial (`apps/web/app/pages/index.vue`) e os dados do negócio (`apps/api/src/config/negocio.ts`)
- **O que falta:** a página que já existia (guardada em `docs/original/`, quando houver) vira a página principal: o
  nome, os produtos, o horário, onde fica e a cara do negócio, com os dados vindo da API.
- **Quem destrava:** a IA, com o pedido do `PROMPT-PAGINA-PRINCIPAL.txt` do kit; o que faltar sobre o negócio, a dona
  ou o dono responde.

## P-002 · O site no ar

- **Assunto:** `docs/publicar.md`
- **O que falta:** o site no servidor, com o domínio e o cadeado, e o `pnpm publicar` funcionando.
- **Quem destrava:** a IA, pelo `PUBLICACAO-DAGOBERTO.md` do kit; o servidor e o domínio são da dona ou do dono.

## P-003 · O banco e o login do dono

- **Assunto:** `docs/arquitetura.md` (as camadas que se ligam quando precisa)
- **O que falta:** guardar os dados no banco (PostgreSQL) e a entrada com senha do dono, o `/painel`, de onde o painel
  cresce.
- **Como resolver:** `/ligar-banco` e, depois, `/ligar-login`.

## P-004 · O catálogo

- **O que falta:** os produtos no banco, cuidados pelo dono no painel, e o site mostrando os produtos de verdade.
- **Como resolver:** `/nova-funcionalidade`, depois do P-003.

## P-005 · O pedido

- **O que falta:** o cliente faz o pedido no site, recebe um número e acompanha o andamento por um link (recebido,
  confirmado, em andamento, pronto, entregue); o dono confirma e muda o andamento no painel. Tudo guardado no banco.
- **Como resolver:** `/nova-funcionalidade`, depois do P-004.

## P-006 · A IA que lê a foto dos produtos

- **O que falta:** a IA cadastra os produtos pela foto da tabela de preços, e o dono confere antes de valer.
- **Como resolver:** `/nova-funcionalidade`, com a chave da IA no `.env` (nunca na conversa).

## P-007 · O tira-dúvidas

- **O que falta:** a IA responde as dúvidas no site com o texto do dono; o que ela não sabe vira pergunta no painel.
- **Como resolver:** `/nova-funcionalidade`, com a chave da IA no `.env`.

## P-008 · O banco de IAs

- **O que falta:** uma fila com reserva (se a primeira IA falhar, a próxima responde), com o custo de cada chamada
  registrado.
- **Como resolver:** `/nova-funcionalidade` (o desenho está no `docs/arquitetura.md`).

## P-009 · Os avisos

- **O que falta:** o e-mail que avisa o dono do pedido novo e o WhatsApp para chamar o cliente. O pedido nunca depende
  deles: ele é guardado primeiro.
- **Como resolver:** `/nova-funcionalidade`, com as chaves no `.env`.

<!--
O molde de cada pendência nova:

## P-010 · o que falta, em poucas palavras
- **Assunto:** o documento a que pertence
- **Data:** quando apareceu
- **O que falta:** uma ou duas frases
- **Quem destrava:** você (a dona ou o dono do projeto), a IA ou outra pessoa, com o nome
- **Como resolver:** o caminho, se já se sabe

Resolveu: acrescente **Resolvida em <data>:** e o que foi feito. Pendência resolvida antiga pode ser apagada.
-->
