#!/usr/bin/env bash
# Publica no servidor a versão que está no GitHub (o main). Quem chama é o pnpm publicar, do seu computador.
# Roda como root a cópia instalada pelo preparar.sh, nunca a da pasta do projeto:
#   sudo /usr/local/lib/<projeto>/atualizar.sh <projeto>
#
# Cada versão nasce numa pasta própria (/srv/<projeto>/versoes) e só entra no ar com o build pronto: se o build falhar,
# o site continua na versão de antes. Se a versão nova não responder, ele volta sozinho para a anterior.
# O root só reinicia os serviços; o git, a instalação, o build, o banco e a semente rodam como o usuário do projeto.
# Saída: 0 no ar; 1 parou antes de trocar (o site segue na versão de antes); 3 a nova não respondeu e voltou.
# shellcheck disable=SC2016 # os trechos entre aspas simples rodam noutro bash, com os valores em $1, $2...
set -euo pipefail

PROJETO="${1:?Falta o nome do projeto}"
[[ "$PROJETO" =~ ^[a-z][a-z0-9-]{1,30}$ ]] || { echo "O nome do projeto: só letras minúsculas, números e hífen."; exit 1; }
[ "$(id -u)" -eq 0 ] || { echo "Rode com sudo."; exit 1; }
id "$PROJETO" > /dev/null 2>&1 || { echo "O projeto $PROJETO não existe neste servidor: rode o preparar.sh."; exit 1; }

CASA="/srv/$PROJETO"
APP="$CASA/app"
VERSOES="$CASA/versoes"
ATUAL="$CASA/atual"
INSTALADOS="/usr/local/lib/$PROJETO"
GUARDAR=3 # quantas versões de antes ficam guardadas, para voltar

passo() { printf '\n== %s\n' "$*"; }
# Roda um trecho como o usuário do projeto. Os valores vão como argumentos ($1, $2...), nunca colados no comando.
comoProjeto() {
  local trecho="$1"
  shift
  sudo -u "$PROJETO" -H bash -lc "$trecho" bash "$@"
}
# Troca a versão no ar: o link /srv/<projeto>/atual passa a apontar para a pasta da versão, de uma vez só.
apontar() { comoProjeto 'ln -sfn "$1" "$2.novo" && mv -Tf "$2.novo" "$2"' "$1" "$ATUAL"; }
respondendo() {
  for _ in $(seq 1 40); do
    if curl -fsS -o /dev/null http://127.0.0.1:3333/api/saude && curl -fsS -o /dev/null http://127.0.0.1:3000/; then
      return 0
    fi
    sleep 1
  done
  return 1
}

# Uma publicação de cada vez (a trava fica no descritor 9, que os serviços não herdam: o 9>&- no systemctl).
exec 9> "/run/$PROJETO-atualizar.lock"
flock -n 9 || { echo "Já há uma publicação deste projeto rodando: espere ela terminar."; exit 1; }

passo "O código do GitHub"
if ! comoProjeto 'git -C "$1" fetch -q origin main && git -C "$1" merge -q --ff-only FETCH_HEAD' "$APP"; then
  echo "Não deu para trazer o código do GitHub (há mudança feita direto no servidor?). Nada mudou no ar."
  exit 1
fi
COMMIT="$(comoProjeto 'git -C "$1" rev-parse HEAD' "$APP")"
if [ "$COMMIT" != "$(comoProjeto 'git -C "$1" rev-parse FETCH_HEAD' "$APP")" ]; then
  echo "O código do servidor tem commit que não está no GitHub. Nada mudou no ar."
  exit 1
fi
CURTO="${COMMIT:0:7}"
echo "A versão: $CURTO"

passo "Os scripts do servidor"
DIFERENTES="$(comoProjeto 'for s in atualizar backup cadeado criar-banco; do cmp -s "$1/$s.sh" "$2/$s.sh" || printf "%s " "$s"; done' "$APP/infra/servidor" "$INSTALADOS")"
if [ -n "$DIFERENTES" ]; then
  echo "AVISO: os scripts do servidor mudaram no projeto (${DIFERENTES% }): rode o preparar.sh de novo."
else
  echo "Iguais aos instalados."
fi

passo "O build da versão nova (o site continua no ar com a de antes)"
NOVA="$VERSOES/$(date +%Y%m%d-%H%M%S)-$CURTO"
if ! comoProjeto '
  set -euo pipefail
  mkdir -p "$1"
  git -C "$2" archive HEAD | tar -x -C "$1"
  ln -s "$2/apps/api/.env" "$1/apps/api/.env"
  cd "$1"
  pnpm install --frozen-lockfile
  pnpm build
' "$NOVA" "$APP"; then
  comoProjeto 'rm -rf "$1"' "$NOVA"
  echo
  echo "O build falhou: o site continua no ar com a versão de antes. O erro está acima."
  exit 1
fi

if [ -d "$NOVA/apps/api/prisma" ]; then
  passo "As mudanças do banco e a semente"
  # A semente (o /ligar-banco cria) grava só com a tabela vazia: rodar a cada publicação é seguro.
  if ! comoProjeto '
    set -euo pipefail
    cd "$1/apps/api" && pnpm exec prisma migrate deploy
    if grep -q "\"db:semente\"" "$1/package.json"; then cd "$1" && pnpm db:semente; fi
  ' "$NOVA"; then
    echo
    echo "A mudança do banco falhou: o site continua no ar com a versão de antes. O erro está acima."
    exit 1
  fi
fi

passo "A versão nova no ar"
ANTES="$(readlink "$ATUAL" 2> /dev/null || true)"
[[ "$ANTES" =~ ^$VERSOES/[0-9]{8}-[0-9]{6}-[0-9a-f]{7}$ ]] && [ -d "$ANTES" ] || ANTES=""
apontar "$NOVA"
systemctl restart "$PROJETO-api" "$PROJETO-web" 9>&-
if ! respondendo; then
  echo "A versão nova não respondeu. O registro dos serviços:"
  journalctl -u "$PROJETO-api" -u "$PROJETO-web" -n 30 --no-pager 2> /dev/null || true
  if [ -z "$ANTES" ]; then
    echo "Não há versão anterior para voltar: conserte o erro acima e publique de novo."
    exit 1
  fi
  apontar "$ANTES"
  systemctl restart "$PROJETO-api" "$PROJETO-web" 9>&-
  comoProjeto 'rm -rf "$1"' "$NOVA"
  if respondendo; then
    echo "VOLTOU: o site está de novo na versão anterior ($(basename "$ANTES"))."
  else
    echo "VOLTOU para a versão anterior ($(basename "$ANTES")), mas ela também não respondeu: veja o registro acima."
  fi
  exit 3
fi
echo "A API e a página respondem: a versão $CURTO está no ar."

passo "As versões guardadas para voltar"
comoProjeto '
  cd "$1"
  ls -1 | grep -E "^[0-9]{8}-[0-9]{6}-[0-9a-f]{7}$" | grep -vx "$2" | sort -r | tail -n +"$(($3 + 1))" | while read -r velha; do
    rm -rf -- "$velha"
  done
  ls -1 | sort -r | sed "s/^/  /"
' "$VERSOES" "$(basename "$NOVA")" "$GUARDAR"
