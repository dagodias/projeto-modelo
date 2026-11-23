#!/usr/bin/env bash
# O cadeado (HTTPS) do Let's Encrypt, com renovação automática.
# Rode só depois que o domínio apontar para este servidor. O e-mail recebe os avisos do Let's Encrypt.
# Já existe certificado para o domínio? Ele instala o mesmo no site do projeto, sem perguntar e sem pedir outro
# (o --keep-until-expiring); se faltar o www no que existe, ele pede um com os dois (o --expand).
# Uso: sudo bash cadeado.sh <dominio> <email>
set -euo pipefail

DOMINIO="${1:?Falta o domínio}"
EMAIL="${2:?Falta o e-mail}"

certbot --nginx -d "$DOMINIO" -d "www.$DOMINIO" --redirect --agree-tos -m "$EMAIL" -n \
  --keep-until-expiring --expand
certbot renew --dry-run
echo "Cadeado ligado: https://$DOMINIO"
