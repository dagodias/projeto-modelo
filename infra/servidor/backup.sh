#!/usr/bin/env bash
# O backup do banco: um arquivo por dia em /var/backups/<projeto>, guardando 14 dias.
# Quem chama é o timer do systemd, todo dia às 3h. Sem banco ligado, não faz nada.
# Uso: sudo bash backup.sh <projeto>
set -euo pipefail

PROJETO="${1:?Falta o nome do projeto}"
ENV_API="/srv/$PROJETO/app/apps/api/.env"
DESTINO="/var/backups/$PROJETO"

URL="$(grep -E '^DATABASE_URL=' "$ENV_API" 2> /dev/null | head -1 | cut -d= -f2- | tr -d '"' || true)"
if [ -z "$URL" ]; then
  echo "Sem banco ligado: nada para guardar."
  exit 0
fi

install -d -m 700 "$DESTINO"
ARQUIVO="$DESTINO/$(date +%F-%H%M).sql.gz"
pg_dump --no-owner "$URL" | gzip > "$ARQUIVO"
find "$DESTINO" -name '*.sql.gz' -mtime +14 -delete
echo "Backup: $ARQUIVO"
