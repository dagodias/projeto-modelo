#!/usr/bin/env bash
# Prepara um servidor Ubuntu LTS novo para o projeto. Roda no servidor, como root (sudo), a partir de uma cópia que veio
# do seu computador (nunca da pasta do projeto no servidor):
#
# Uso:   scp infra/servidor/preparar.sh <apelido>:/tmp/
#        ssh <apelido> "sudo bash /tmp/preparar.sh <projeto> <repositorio-ssh> <dominio>"
# Ex.:   sudo bash /tmp/preparar.sh meu-negocio git@github.com:fulana/meu-negocio.git meunegocio.com.br
#
# Pode rodar de novo quantas vezes precisar: o que já está feito, ele pula ou refaz igual (o cadeado continua).
# Rodar de novo também instala a versão nova dos scripts de operação, quando eles mudam no projeto.
# shellcheck disable=SC2016 # os trechos entre aspas simples rodam noutro bash, com os valores em $1, $2...
set -euo pipefail

PROJETO="${1:?Falta o nome do projeto}"
REPO="${2:?Falta o endereço SSH do repositório no GitHub}"
DOMINIO="${3:?Falta o domínio}"
NODE_MAJOR="${NODE_MAJOR:-24}"
NODE_MINIMO="24.15.0" # o Nuxt do projeto pede o Node 24.15 ou mais novo
CASA="/srv/$PROJETO"
APP="$CASA/app"
INSTALADOS="/usr/local/lib/$PROJETO"
SEM_SYSTEMD="${SEM_SYSTEMD:-}" # só para testar em contêiner, onde não há systemd
# A impressão digital oficial da chave Ed25519 do github.com (docs.github.com, "GitHub's SSH key fingerprints").
GITHUB_ED25519="SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU"

passo() { printf '\n== %s\n' "$*"; }
servico() { if [ -z "$SEM_SYSTEMD" ]; then systemctl "$@"; else echo "(teste) systemctl $*"; fi; }
# Roda um trecho como o usuário do projeto. Os valores vão como argumentos ($1, $2...), nunca colados no comando.
comoProjeto() {
  local trecho="$1"
  shift
  sudo -u "$PROJETO" -H bash -lc "$trecho" bash "$@"
}
versaoMinima() { [ "$(printf '%s\n%s\n' "$NODE_MINIMO" "$1" | sort -V | head -1)" = "$NODE_MINIMO" ]; }

[ "$(id -u)" -eq 0 ] || { echo "Rode com sudo."; exit 1; }
[[ "$PROJETO" =~ ^[a-z][a-z0-9-]{1,30}$ ]] || { echo "O nome do projeto: só letras minúsculas, números e hífen."; exit 1; }
[[ "$DOMINIO" =~ ^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$ ]] || { echo "Domínio inválido: $DOMINIO (só letras minúsculas, sem https:// e sem barra)."; exit 1; }
[[ "$REPO" != -* ]] || { echo "Endereço do repositório inválido: $REPO"; exit 1; }

passo "O sistema em dia e as peças do servidor"
export DEBIAN_FRONTEND=noninteractive
apt-get update -q
apt-get upgrade -yq
apt-get install -yq ca-certificates curl gnupg git sudo openssl openssh-client nginx certbot python3-certbot-nginx \
  postgresql ufw fail2ban unattended-upgrades

passo "A hora de Brasília"
[ -n "$SEM_SYSTEMD" ] || timedatectl set-timezone America/Sao_Paulo

passo "Memória extra (swap), para o build não faltar memória"
if [ -z "$SEM_SYSTEMD" ] && ! swapon --show | grep -q .; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

passo "Node.js $NODE_MINIMO ou mais novo (a LTS $NODE_MAJOR), pelo repositório oficial da NodeSource"
if ! command -v node > /dev/null || ! versaoMinima "$(node -p process.versions.node)"; then
  install -d -m 0755 /etc/apt/keyrings
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor --yes -o /etc/apt/keyrings/nodesource.gpg
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
    > /etc/apt/sources.list.d/nodesource.list
  apt-get update -q && apt-get install -yq nodejs
fi
versaoMinima "$(node -p process.versions.node)" || { echo "O Node ficou na $(node --version): o projeto pede a $NODE_MINIMO ou mais nova."; exit 1; }
node --version

passo "A segurança: firewall, bloqueio de tentativas e atualização automática"
if [ -z "$SEM_SYSTEMD" ]; then
  ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw --force enable
  servico enable --now fail2ban
  dpkg-reconfigure -f noninteractive unattended-upgrades
fi

passo "A entrada só por chave: sem senha e sem o root"
# No sshd vale o PRIMEIRO valor lido, e os arquivos do sshd_config.d entram em ordem alfabética. Por isso o 00-: ele
# é lido antes do 50-cloud-init.conf, que a imagem do provedor grava ligando a senha quando a máquina nasce com uma.
# No fim, quem confere é o sshd -T (o que o sshd vai usar de verdade), e não o arquivo escrito.
if [ -n "$SEM_SYSTEMD" ] && ! command -v sshd > /dev/null; then
  echo "(teste) este contêiner não tem o servidor de SSH: o passo fica de fora"
else
  CONF_SSH=/etc/ssh/sshd_config.d
  printf 'PasswordAuthentication no\nKbdInteractiveAuthentication no\nPermitRootLogin no\n' > "$CONF_SSH/00-projeto.conf"
  rm -f "$CONF_SSH/90-projeto.conf" # o nome que as versões anteriores deste script usavam
  sshd -t
  servico reload ssh
  VALENDO="$(sshd -T)"
  for REGRA in 'passwordauthentication no' 'kbdinteractiveauthentication no' 'permitrootlogin no'; do
    if ! grep -qx "$REGRA" <<< "$VALENDO"; then
      echo
      echo "PAROU: o sshd não ficou com \"$REGRA\". A entrada por senha (ou a do root) continua ligada."
      echo "Algum arquivo lido antes do $CONF_SSH/00-projeto.conf liga de novo. Para achar:"
      echo "  sudo grep -ri -E 'passwordauthentication|kbdinteractiveauthentication|permitrootlogin' /etc/ssh/sshd_config /etc/ssh/sshd_config.d/"
      echo "Desligue lá (ou apague o arquivo) e rode este script de novo."
      exit 1
    fi
  done
  echo "Conferido pelo sshd -T: sem senha, sem a entrada por teclado e sem o root."
fi

passo "O usuário do projeto ($PROJETO) e a chave de leitura do GitHub"
id "$PROJETO" > /dev/null 2>&1 || useradd --system --create-home --home-dir "$CASA" --shell /bin/bash "$PROJETO"
# A pasta do projeto é dele: daqui em diante, o que mexe nela roda como ele, nunca como root.
# 711: os outros não listam a pasta, mas o nginx passa por ela para servir as fotos.
comoProjeto 'chmod 711 "$1" && install -d -m 700 "$1/.ssh" && install -d -m 755 "$1/versoes" "$1/fotos"' "$CASA"
comoProjeto '[ -f "$1/.ssh/id_ed25519" ] || ssh-keygen -q -t ed25519 -N "" -C "$2@servidor" -f "$1/.ssh/id_ed25519"' "$CASA" "$PROJETO"
# A chave do github.com só entra no known_hosts se for a oficial: sem isso, a primeira conexão confiaria em qualquer um.
CHAVE_GITHUB="$(ssh-keyscan -t ed25519 github.com 2> /dev/null | grep -v '^#' | head -1)"
DIGITAL="$(ssh-keygen -lf - <<< "$CHAVE_GITHUB" 2> /dev/null | awk '{print $2}')"
if [ "$DIGITAL" != "$GITHUB_ED25519" ]; then
  echo "PAROU: a chave que respondeu como github.com (${DIGITAL:-nenhuma}) não é a oficial ($GITHUB_ED25519)."
  echo "Pode ser a rede no meio do caminho. Confira a internet do servidor e rode este script de novo."
  exit 1
fi
comoProjeto 'umask 077; touch "$1"; grep -qxF "$2" "$1" || printf "%s\n" "$2" >> "$1"' "$CASA/.ssh/known_hosts" "$CHAVE_GITHUB"
if ! comoProjeto 'git ls-remote -- "$1" > /dev/null 2>&1' "$REPO"; then
  echo
  echo "O servidor ainda não consegue ler o repositório. Cadastre esta chave no GitHub (Settings, Deploy keys,"
  echo "sem marcar a escrita; ou, do seu computador: gh repo deploy-key add) e rode este script de novo:"
  echo
  cat "$CASA/.ssh/id_ed25519.pub"
  exit 2
fi

passo "O código do projeto"
if [ ! -d "$APP/.git" ]; then
  comoProjeto 'git clone -q -- "$1" "$2"' "$REPO" "$APP"
elif [ "$(comoProjeto 'git -C "$1" remote get-url origin' "$APP")" != "$REPO" ]; then
  echo "PAROU: o código em $APP vem de outro repositório. Confira o endereço e rode de novo."
  exit 1
else
  comoProjeto 'git -C "$1" fetch -q origin main && git -C "$1" merge -q --ff-only FETCH_HEAD' "$APP" || {
    echo "PAROU: o código do servidor não acompanha o GitHub (há mudança feita direto nele?)."
    exit 1
  }
fi

passo "O pnpm, na versão que o projeto pede"
# O valor vem do package.json do projeto e vai para um comando de root: só passa se for um número x.y.z.
VERSAO_PNPM="$(comoProjeto 'git -C "$1" show HEAD:package.json' "$APP" | sed -n 's/^ *"packageManager": *"pnpm@\([^"]*\)".*/\1/p' | head -1)"
[[ "$VERSAO_PNPM" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "PAROU: a versão do pnpm no package.json não é um número x.y.z (${VERSAO_PNPM:-vazia})."; exit 1; }
if ! command -v pnpm > /dev/null || [ "$(pnpm --version)" != "$VERSAO_PNPM" ]; then
  npm install -g "pnpm@$VERSAO_PNPM"
fi

passo "As configurações da API (o .env, que só existe no servidor)"
comoProjeto 'umask 077; [ -e "$1" ] || printf "NODE_ENV=production\nPORTA=3333\nHOST=127.0.0.1\n" > "$1"; chmod 600 "$1"' "$APP/apps/api/.env"

passo "Os scripts de operação, de root, em $INSTALADOS"
# O root nunca roda arquivo da pasta do projeto (o usuário dele escreve lá): roda estas cópias, que só o root muda.
# Elas saem do commit que está no ar (o git, não o arquivo da pasta).
install -d -m 755 -o root -g root "$INSTALADOS"
for script in atualizar backup cadeado criar-banco; do
  TEMP="$(mktemp)"
  comoProjeto 'git -C "$1" show "HEAD:infra/servidor/$2.sh"' "$APP" "$script" > "$TEMP"
  install -m 755 -o root -g root "$TEMP" "$INSTALADOS/$script.sh"
  rm -f "$TEMP"
done
ls "$INSTALADOS"

passo "A pasta do backup (o banco e as fotos, todo dia às 3h)"
install -d -m 700 -o postgres -g postgres "/var/backups/$PROJETO"

passo "Os serviços: a API, a frente e o backup"
cat > "/etc/systemd/system/$PROJETO-api.service" << EOF
[Unit]
Description=$PROJETO: a API
After=network.target postgresql.service

[Service]
User=$PROJETO
WorkingDirectory=$CASA/atual/apps/api
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF
cat > "/etc/systemd/system/$PROJETO-web.service" << EOF
[Unit]
Description=$PROJETO: a frente
After=network.target $PROJETO-api.service

[Service]
User=$PROJETO
WorkingDirectory=$CASA/atual/apps/web
Environment=NODE_ENV=production
Environment=NITRO_HOST=127.0.0.1
Environment=NITRO_PORT=3000
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=always
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true
# A frente nunca lê as senhas da API.
InaccessiblePaths=-$APP/apps/api/.env

[Install]
WantedBy=multi-user.target
EOF
cat > "/etc/systemd/system/$PROJETO-backup.service" << EOF
[Unit]
Description=$PROJETO: o backup do banco e das fotos

[Service]
Type=oneshot
User=postgres
Group=postgres
ExecStart=$INSTALADOS/backup.sh $PROJETO
NoNewPrivileges=true
PrivateTmp=true
EOF
cat > "/etc/systemd/system/$PROJETO-backup.timer" << EOF
[Unit]
Description=$PROJETO: o backup, todo dia às 3h

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true

[Install]
WantedBy=timers.target
EOF
servico daemon-reload
servico enable "$PROJETO-api" "$PROJETO-web"
servico enable --now "$PROJETO-backup.timer"

passo "O nginx: a porta de entrada (/api vai para a API, /fotos para a pasta das fotos; o resto, para a frente)"
cat > "/etc/nginx/sites-available/$PROJETO" << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMINIO www.$DOMINIO;
    server_tokens off;
    client_max_body_size 12m;

    location /api/ {
        proxy_pass http://127.0.0.1:3333;
        include /etc/nginx/proxy_params;
        # A leitura da foto pela IA pode levar até 90 segundos.
        proxy_read_timeout 120s;
    }

    # As fotos dos produtos: os arquivos da pasta $CASA/fotos, só para ler.
    location ^~ /fotos/ {
        alias $CASA/fotos/;
        limit_except GET { deny all; }
        add_header X-Content-Type-Options nosniff always;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        include /etc/nginx/proxy_params;
    }
}
EOF
ln -sf "/etc/nginx/sites-available/$PROJETO" "/etc/nginx/sites-enabled/$PROJETO"
rm -f /etc/nginx/sites-enabled/default
# Rodou de novo com o cadeado já ligado? O arquivo acima é só o da porta 80: o certificado que já existe volta para ele.
if [ -f "/etc/letsencrypt/live/$DOMINIO/fullchain.pem" ]; then
  certbot install --nginx --cert-name "$DOMINIO" --redirect -n ||
    echo "AVISO: o cadeado não voltou sozinho. Rode: sudo $INSTALADOS/cadeado.sh $DOMINIO <seu-email>"
fi
nginx -t
servico reload nginx

passo "A primeira versão no ar (o mesmo caminho do pnpm publicar)"
"$INSTALADOS/atualizar.sh" "$PROJETO"

passo "Conferindo pelo nginx"
if [ -z "$SEM_SYSTEMD" ]; then
  if curl -fsS -o /dev/null -H "Host: $DOMINIO" http://127.0.0.1/ && curl -fsS -o /dev/null -H "Host: $DOMINIO" http://127.0.0.1/api/saude; then
    echo "A página e a API respondem pelo nginx."
  else
    echo "AVISO: o nginx não entregou a página ou a API. Veja: sudo nginx -t e sudo journalctl -u nginx -n 30"
  fi
fi
echo
if [ -f "/etc/letsencrypt/live/$DOMINIO/fullchain.pem" ]; then
  echo "Pronto: https://$DOMINIO"
else
  echo "Pronto. Falta o cadeado, depois que o domínio apontar para este servidor:"
  echo "  sudo $INSTALADOS/cadeado.sh $DOMINIO <seu-email>"
fi
