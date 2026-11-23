#!/usr/bin/env bash
# O backup de cada dia: o banco e as fotos, em /var/backups/<projeto>, guardando 14 dias.
# Quem chama é o timer do systemd, todo dia às 3h, como o usuário postgres (nunca como root), rodando a cópia instalada
# pelo preparar.sh. O banco sai pelo pg_dump do próprio postgres: sem senha, nem no .env nem na linha de comando.
# Para testar na mão: sudo -u postgres /usr/local/lib/<projeto>/backup.sh <projeto>
# shellcheck disable=SC2016 # os trechos entre aspas simples rodam noutro bash, com os valores em $1, $2...
set -euo pipefail
umask 077

PROJETO="${1:?Falta o nome do projeto}"
[[ "$PROJETO" =~ ^[a-z][a-z0-9-]{1,30}$ ]] || { echo "O nome do projeto: só letras minúsculas, números e hífen."; exit 1; }
BANCO="${PROJETO//-/_}"
DESTINO="/var/backups/$PROJETO"
FOTOS="/srv/$PROJETO/fotos"
AGORA="$(date +%F-%H%M)"
[ -d "$DESTINO" ] || { echo "Falta a pasta $DESTINO (o preparar.sh cria)."; exit 1; }

# guardar <arquivo> <comando...>: escreve num .tmp e só dá o nome final se tudo deu certo (nunca um backup pela metade).
guardar() {
  local final="$1"
  shift
  if "$@" > "$final.tmp"; then
    mv -f "$final.tmp" "$final"
    echo "Backup: $final"
  else
    rm -f "$final.tmp"
    echo "O backup de $final falhou."
    return 1
  fi
}

EXISTE="$(psql -XAtq -d postgres -v banco="$BANCO" <<< "SELECT 1 FROM pg_database WHERE datname = :'banco'")"
if [ "$EXISTE" = 1 ]; then
  guardar "$DESTINO/banco-$AGORA.sql.gz" bash -c 'set -o pipefail; pg_dump --no-owner --no-privileges "$1" | gzip' bash "$BANCO"
else
  echo "Sem banco ligado: o banco fica de fora."
fi

if [ -d "$FOTOS" ] && [ -n "$(ls -A "$FOTOS")" ]; then
  guardar "$DESTINO/fotos-$AGORA.tar.gz" tar -czf - -C "$FOTOS" .
else
  echo "Sem fotos: elas ficam de fora."
fi

find "$DESTINO" -maxdepth 1 -type f \( -name '*.sql.gz' -o -name '*.tar.gz' \) -mtime +14 -delete
find "$DESTINO" -maxdepth 1 -type f -name '*.tmp' -delete
