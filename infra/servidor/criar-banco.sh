#!/usr/bin/env bash
# Cria o banco do projeto no PostgreSQL do servidor e grava a conexão no .env da API.
# A senha do banco é gerada aqui e só existe no .env: ninguém precisa digitar nem saber.
# Uso: sudo bash criar-banco.sh <projeto>
set -euo pipefail

PROJETO="${1:?Falta o nome do projeto}"
NOME="${PROJETO//-/_}"
ENV_API="/srv/$PROJETO/app/apps/api/.env"

if grep -q '^DATABASE_URL=' "$ENV_API" 2> /dev/null; then
  echo "O banco já está ligado (DATABASE_URL no .env da API). Nada a fazer."
  exit 0
fi

SENHA="$(openssl rand -hex 24)"
sudo -u postgres psql -v ON_ERROR_STOP=1 -q -c "CREATE ROLE $NOME LOGIN PASSWORD '$SENHA'"
sudo -u postgres createdb -O "$NOME" "$NOME"
echo "DATABASE_URL=postgresql://$NOME:$SENHA@127.0.0.1:5432/$NOME" >> "$ENV_API"
chown "$PROJETO:$PROJETO" "$ENV_API" && chmod 600 "$ENV_API"
echo "Banco $NOME criado, e a conexão gravada no .env da API."
