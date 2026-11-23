#!/usr/bin/env bash
# O cadeado (HTTPS) do Let's Encrypt, com renovação automática.
# Rode só depois que o domínio apontar para este servidor. O e-mail recebe os avisos do Let's Encrypt.
# Uso: sudo bash cadeado.sh <dominio> <email>
set -euo pipefail

DOMINIO="${1:?Falta o domínio}"
EMAIL="${2:?Falta o e-mail}"

certbot --nginx -d "$DOMINIO" -d "www.$DOMINIO" --redirect --agree-tos -m "$EMAIL" -n
certbot renew --dry-run
echo "Cadeado ligado: https://$DOMINIO"
