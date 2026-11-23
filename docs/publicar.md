# Publicar

## 0. Estado

- O servidor ainda não foi preparado. O PUBLICACAO-DAGOBERTO.md prepara, e troca esta linha pelo estado de verdade
  (o provedor, a região, o domínio e a data).

## Como o servidor fica

| Peça                                     | Onde                                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------- |
| O código                                 | `/srv/<projeto>/app`, um clone do GitHub (o servidor só lê, com uma chave de leitura)             |
| A API                                    | o serviço `<projeto>-api`, na porta 3333, só dentro da máquina                                    |
| A frente                                 | o serviço `<projeto>-web`, na porta 3000, só dentro da máquina                                    |
| A porta de entrada                       | o nginx: `/api` vai para a API e o resto vai para a frente, com o cadeado do Let's Encrypt        |
| As senhas e as chaves                    | `/srv/<projeto>/app/apps/api/.env`, que só existe no servidor                                     |
| O banco (quando ligado)                  | o PostgreSQL do Ubuntu, só dentro da máquina                                                      |
| O backup (quando o banco estiver ligado) | `/var/backups/<projeto>`, todo dia às 3h, guardando 14 dias                                       |
| A segurança                              | firewall (só 22, 80 e 443), bloqueio de tentativas, atualização automática e entrada só por chave |

## Publicar

No seu computador, com tudo no GitHub e o portão verde:

```
pnpm publicar
```

Ele confere que não falta commit nem push, entra no servidor, baixa o que está no GitHub, instala, faz o build, roda
as mudanças do banco e a semente (quando ligado), religa os dois serviços e confere o endereço público.

## Voltar atrás

Deu errado depois de publicar? No seu computador:

1. `git revert <o commit que deu errado>`, que cria um commit desfazendo aquele;
2. `git push`;
3. `pnpm publicar`.

Voltar o código não desfaz mudança no banco: mudança de banco que apaga coisa precisa de um plano antes.

## Os scripts (pasta infra)

| Script                                                      | Onde roda         | Para quê                                                                                                               |
| ----------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `infra/servidor/preparar.sh <projeto> <repo-ssh> <dominio>` | no servidor       | Prepara um Ubuntu novo do zero; pode rodar de novo                                                                     |
| `infra/servidor/cadeado.sh <dominio> <email>`               | no servidor       | O cadeado do Let's Encrypt, depois que o domínio apontar; se o certificado já existe, instala o mesmo, sem pedir outro |
| `infra/servidor/criar-banco.sh <projeto>`                   | no servidor       | Cria o banco quando ele for ligado (`/ligar-banco`)                                                                    |
| `infra/servidor/atualizar.sh <projeto>`                     | no servidor       | O que o `pnpm publicar` chama                                                                                          |
| `infra/servidor/backup.sh <projeto>`                        | no servidor       | O backup diário (o timer chama)                                                                                        |
| `infra/publicar.sh`                                         | no seu computador | O `pnpm publicar`                                                                                                      |

## Ver o que está acontecendo

- Os registros da API: `ssh <apelido> "sudo journalctl -u <projeto>-api -n 50"`.
- Os da frente: o mesmo, com `<projeto>-web`.
- Restaurar um backup: `gunzip -c <arquivo>.sql.gz | psql "<DATABASE_URL>"`, num banco vazio, depois de testar
  numa cópia.

## Armadilhas

- O build precisa de memória: o preparar.sh cria 2 GB de swap. Servidor de 1 GB fica no limite.
- Na Amazon (Lightsail), o firewall do painel também precisa da porta 443 aberta, senão o cadeado não liga.
- O IP do Lightsail muda se a máquina for desligada e ligada de novo, a não ser que ela tenha um IP estático.
