#!/usr/bin/env bash
# O cadeado (HTTPS) do Let's Encrypt, com renovação automática.
# Rode só depois que o domínio apontar para este servidor. O e-mail recebe os avisos do Let's Encrypt.
# Já existe certificado para o domínio? Ele instala o mesmo no site do projeto, sem perguntar e sem pedir outro
# (o --keep-until-expiring); se faltar o www no que existe, ele pede um com os dois (o --expand).
# Roda a cópia instalada pelo preparar.sh: sudo /usr/local/lib/<projeto>/cadeado.sh <dominio> <email>
set -euo pipefail

DOMINIO="${1:?Falta o domínio}"
EMAIL="${2:?Falta o e-mail}"
[[ "$DOMINIO" =~ ^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$ ]] || { echo "Domínio inválido: $DOMINIO (só letras minúsculas, sem https:// e sem barra)."; exit 1; }
[[ "$EMAIL" =~ ^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$ ]] || { echo "E-mail inválido: $EMAIL"; exit 1; }
[ "$(id -u)" -eq 0 ] || { echo "Rode com sudo."; exit 1; }

certbot --nginx -d "$DOMINIO" -d "www.$DOMINIO" --redirect --agree-tos -m "$EMAIL" -n \
  --keep-until-expiring --expand
certbot renew --dry-run
echo "Cadeado ligado: https://$DOMINIO"
