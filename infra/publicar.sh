#!/usr/bin/env bash
# Publica no servidor o que já está no GitHub. Roda no seu computador: pnpm publicar
set -euo pipefail

CONF="infra/servidor.conf"
if [ ! -f "$CONF" ]; then
  echo "Falta o $CONF, com o apelido do servidor, o projeto e o domínio (o PUBLICACAO-DAGOBERTO.md cria)."
  exit 1
fi
# shellcheck source=/dev/null
source "$CONF"
: "${APELIDO:?Falta APELIDO no $CONF}" "${PROJETO:?Falta PROJETO no $CONF}" "${DOMINIO:?Falta DOMINIO no $CONF}"

if [ -n "$(git status --porcelain)" ]; then
  echo "Há mudança sem commit. Faça o commit e o push antes de publicar."
  exit 1
fi
git fetch -q origin main
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
  echo "O main deste computador está diferente do GitHub. Envie com git push antes de publicar."
  exit 1
fi

echo "Publicando a versão $(git rev-parse --short HEAD) em $DOMINIO..."
ssh "$APELIDO" "sudo bash /srv/$PROJETO/app/infra/servidor/atualizar.sh $PROJETO"

if curl -fsS "https://$DOMINIO/api/saude" > /dev/null; then
  echo "No ar: https://$DOMINIO"
else
  echo "O site não respondeu pelo endereço público. Veja o docs/publicar.md, em Voltar atrás."
  exit 1
fi
