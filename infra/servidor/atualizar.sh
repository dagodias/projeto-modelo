#!/usr/bin/env bash
# Atualiza o servidor com o que está no GitHub. Quem chama é o publicar.sh, do seu computador.
# Uso: sudo bash atualizar.sh <projeto>
set -euo pipefail

PROJETO="${1:?Falta o nome do projeto}"
APP="/srv/$PROJETO/app"
cd "$APP"

ANTES="$(sudo -u "$PROJETO" git rev-parse --short HEAD)"
sudo -u "$PROJETO" git pull -q --ff-only
DEPOIS="$(sudo -u "$PROJETO" git rev-parse --short HEAD)"
echo "Versão: $ANTES -> $DEPOIS"

sudo -u "$PROJETO" bash -lc "cd '$APP' && pnpm install --frozen-lockfile && pnpm build"
if [ -d apps/api/prisma ]; then
  sudo -u "$PROJETO" bash -lc "cd '$APP/apps/api' && pnpm exec prisma migrate deploy"
  # A semente (o /ligar-banco cria): grava o negócio só com a tabela vazia, então rodar a cada publicação é seguro.
  if grep -q '"db:semente"' package.json; then
    sudo -u "$PROJETO" bash -lc "cd '$APP' && pnpm db:semente"
  fi
fi

systemctl restart "$PROJETO-api" "$PROJETO-web"
for _ in $(seq 1 30); do curl -fsS http://127.0.0.1:3333/api/saude > /dev/null 2>&1 && break; sleep 1; done
if curl -fsS http://127.0.0.1:3333/api/saude > /dev/null; then
  echo "A API respondeu."
else
  echo "A API não respondeu depois de religar. O registro dela:"
  journalctl -u "$PROJETO-api" -n 30 --no-pager
  exit 1
fi
