# Publicar

## 0. Estado

- O servidor ainda não foi preparado. O PUBLICACAO-DAGOBERTO.md prepara, e troca esta linha pelo estado de verdade
  (o provedor, a região, o domínio e a data).

## Como o servidor fica

| Peça                    | Onde                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| O código                | `/srv/<projeto>/app`, um clone do GitHub (o servidor só lê, com uma chave de leitura)                                 |
| As versões              | `/srv/<projeto>/versoes/<data>-<commit>`: cada publicação monta uma pasta nova; ficam a do ar e as 3 de antes         |
| A versão no ar          | `/srv/<projeto>/atual`, um atalho para a pasta da versão: os serviços rodam dele                                      |
| Os scripts de operação  | `/usr/local/lib/<projeto>/` (atualizar, backup, cadeado e criar-banco), de root: o root nunca roda arquivo do projeto |
| A API                   | o serviço `<projeto>-api`, na porta 3333, só dentro da máquina                                                        |
| A frente                | o serviço `<projeto>-web`, na porta 3000, só dentro da máquina (ela não consegue ler o `.env` da API)                 |
| A porta de entrada      | o nginx: `/api/` vai para a API, `/fotos/` para a pasta das fotos e o resto para a frente, com o cadeado              |
| As fotos                | `/srv/<projeto>/fotos`, servidas pelo nginx em `/fotos/`, só para ler                                                 |
| As senhas e as chaves   | `/srv/<projeto>/app/apps/api/.env`, que só existe no servidor (permissão 600)                                         |
| O banco (quando ligado) | o PostgreSQL do Ubuntu, só dentro da máquina                                                                          |
| O backup                | `/var/backups/<projeto>`, todo dia às 3h, como o usuário postgres: o banco e as fotos, guardando 14 dias              |
| A segurança             | firewall (só 22, 80 e 443), bloqueio de tentativas, atualização automática, SSH só por chave e sem o root             |

## Publicar

No seu computador (Mac, Linux ou Windows), com tudo no GitHub e o portão verde:

```
pnpm publicar
```

Ele lê o `infra/servidor.conf`, confere que não falta commit nem push e chama no servidor o
`/usr/local/lib/<projeto>/atualizar.sh`, que:

1. traz do GitHub a versão nova e monta uma pasta só para ela (instala e faz o build ali). Se o build falhar, para: o
   site continua no ar com a versão de antes;
2. roda as mudanças do banco e a semente (quando o banco está ligado);
3. troca a versão no ar, religa os dois serviços e confere a API e a página. Se a versão nova não responder, volta
   sozinho para a anterior, e o `pnpm publicar` avisa.

No fim, o `pnpm publicar` confere a página inicial e a API pelo endereço público.

## Voltar atrás

- **A versão nova não respondeu:** o servidor já voltou sozinho para a anterior. Conserte o erro que o `pnpm
publicar` mostrou e publique de novo.
- **Ela respondeu, mas tem um erro:** no seu computador, `git revert <o commit que deu errado>` (um commit que desfaz
  aquele), `git push` e `pnpm publicar`.

Voltar o código não desfaz mudança no banco: mudança de banco que apaga coisa precisa de um plano antes.

## Os scripts (pasta infra)

O root do servidor só roda as cópias instaladas em `/usr/local/lib/<projeto>/`: o usuário do projeto escreve na pasta
dele, e um script de lá viraria uma porta para o root. Mudou um script desta pasta? Rode o `preparar.sh` de novo, que
ele instala a versão nova (o `pnpm publicar` avisa quando elas estão diferentes).

| Script                          | Como roda                                                                                                        | Para quê                                                                                        |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `infra/servidor/preparar.sh`    | do seu computador: `scp` para o `/tmp` do servidor e `sudo bash /tmp/preparar.sh <projeto> <repo-ssh> <dominio>` | Prepara um Ubuntu novo do zero e instala os outros scripts; pode rodar de novo                  |
| `infra/servidor/atualizar.sh`   | `sudo /usr/local/lib/<projeto>/atualizar.sh <projeto>`                                                           | O que o `pnpm publicar` chama                                                                   |
| `infra/servidor/cadeado.sh`     | `sudo /usr/local/lib/<projeto>/cadeado.sh <dominio> <email>`                                                     | O cadeado, depois que o domínio apontar; se o certificado já existe, instala o mesmo            |
| `infra/servidor/criar-banco.sh` | `sudo /usr/local/lib/<projeto>/criar-banco.sh <projeto>`                                                         | Cria o banco quando ele for ligado (`/ligar-banco`)                                             |
| `infra/servidor/backup.sh`      | o timer, às 3h, como o usuário postgres                                                                          | O backup do banco e das fotos                                                                   |
| `infra/publicar.mjs`            | no seu computador: `pnpm publicar`                                                                               | Publica e confere; lê o `infra/servidor.conf` (só `CHAVE=VALOR`) pelo `infra/servidor-conf.mjs` |

## Ver o que está acontecendo

- Os registros da API: `ssh <apelido> "sudo journalctl -u <projeto>-api -n 50"`.
- Os da frente: o mesmo, com `<projeto>-web`. Os do backup: `<projeto>-backup`.
- As versões guardadas: `ssh <apelido> "ls /srv/<projeto>/versoes"`; a do ar: `readlink /srv/<projeto>/atual`.
- O `/api/docs` (o Swagger) fica fechado no ar. Para abrir por um tempo: `DOCS_NO_AR=true` no `.env` da API e
  `sudo systemctl restart <projeto>-api`; depois, tire a linha e reinicie de novo.
- Restaurar o banco, num banco vazio e depois de testar numa cópia (as tabelas voltam com o dono certo):
  `(echo "SET ROLE <banco>;"; sudo gunzip -c /var/backups/<projeto>/banco-<data>.sql.gz) | sudo -u postgres psql -d <banco>`,
  em que `<banco>` é o nome do projeto com `_` no lugar do `-`.
- Restaurar as fotos: `sudo tar -xzf /var/backups/<projeto>/fotos-<data>.tar.gz -C /srv/<projeto>/fotos`.

## Armadilhas

- O build precisa de memória: o preparar.sh cria 2 GB de swap. Servidor de 1 GB fica no limite. Como o build acontece
  numa pasta nova, faltar memória no meio dele não derruba o site.
- Na Amazon (Lightsail), o firewall do painel também precisa da porta 443 aberta, senão o cadeado não liga.
- O IP do Lightsail muda se a máquina for desligada e ligada de novo, a não ser que ela tenha um IP estático.
- No SSH vale o primeiro valor lido, e a máquina criada com senha traz um `50-cloud-init.conf` que liga a senha. Por
  isso o preparar.sh grava o `00-projeto.conf` (lido antes de todos) e confere com o `sshd -T`: se algo lido antes
  ainda ligar a senha ou o root, ele para e diz como achar.
- Rodar o preparar.sh de novo reescreve o nginx; se o cadeado já existia, ele volta sozinho (o `certbot install`).
- Mudou o `.env` do servidor? A API só lê o `.env` quando sobe: `sudo systemctl restart <projeto>-api`.
- A chave do github.com só entra no servidor se for a oficial (a impressão digital fica no preparar.sh). Se o GitHub
  trocar a chave um dia, o preparar.sh para e avisa: atualize a impressão digital pela página oficial do GitHub.
