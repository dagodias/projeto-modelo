#!/usr/bin/env bash
# Cria o banco do projeto no PostgreSQL do servidor e grava a conexão no .env da API.
# A senha do banco é gerada aqui e só existe no .env: ninguém precisa digitar nem saber. Ela nunca aparece na linha de
# comando (a lista de processos mostraria): o SQL entra pela entrada padrão do psql.
# Roda a cópia instalada pelo preparar.sh: sudo /usr/local/lib/<projeto>/criar-banco.sh <projeto>
set -euo pipefail
umask 077

PROJETO="${1:?Falta o nome do projeto}"
[[ "$PROJETO" =~ ^[a-z][a-z0-9-]{1,30}$ ]] || { echo "O nome do projeto: só letras minúsculas, números e hífen."; exit 1; }
[ "$(id -u)" -eq 0 ] || { echo "Rode com sudo."; exit 1; }
id "$PROJETO" > /dev/null 2>&1 || { echo "O projeto $PROJETO não existe neste servidor: rode o preparar.sh."; exit 1; }
NOME="${PROJETO//-/_}"
ENV_API="/srv/$PROJETO/app/apps/api/.env"

# O .env é lido e escrito pelo usuário do projeto, nunca pelo root (a pasta é dele).
if sudo -u "$PROJETO" grep -q '^DATABASE_URL=' "$ENV_API" 2> /dev/null; then
  echo "O banco já está ligado (DATABASE_URL no .env da API). Nada a fazer."
  exit 0
fi

SENHA="$(openssl rand -hex 24)"
# O printf é do próprio bash: a senha vai pela entrada padrão, sem passar pela linha de comando de nenhum programa.
printf 'CREATE ROLE %s LOGIN PASSWORD %s;\nCREATE DATABASE %s OWNER %s;\n' "$NOME" "'$SENHA'" "$NOME" "$NOME" |
  sudo -u postgres psql -X -q -v ON_ERROR_STOP=1 -d postgres
printf 'DATABASE_URL=postgresql://%s:%s@127.0.0.1:5432/%s\n' "$NOME" "$SENHA" "$NOME" |
  sudo -u "$PROJETO" bash -c 'umask 077; cat >> "$1"; chmod 600 "$1"' bash "$ENV_API"
echo "Banco $NOME criado, e a conexão gravada no .env da API (permissão 600)."
