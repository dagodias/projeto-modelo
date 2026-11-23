#!/usr/bin/env bash
# Prepara um servidor Ubuntu LTS novo para o projeto. Roda no servidor, como root (sudo).
#
# Uso:   sudo bash preparar.sh <projeto> <repositorio-ssh> <dominio>
# Ex.:   sudo bash preparar.sh meu-negocio git@github.com:fulana/meu-negocio.git meunegocio.com.br
#
# Pode rodar de novo quantas vezes precisar: o que já está feito, ele pula ou refaz igual.
set -euo pipefail

PROJETO="${1:?Falta o nome do projeto}"
REPO="${2:?Falta o endereço SSH do repositório no GitHub}"
DOMINIO="${3:?Falta o domínio}"
NODE_MAJOR="${NODE_MAJOR:-24}"
CASA="/srv/$PROJETO"
APP="$CASA/app"
SEM_SYSTEMD="${SEM_SYSTEMD:-}" # só para testar em contêiner, onde não há systemd

passo() { printf '\n== %s\n' "$*"; }
servico() { if [ -z "$SEM_SYSTEMD" ]; then systemctl "$@"; else echo "(teste) systemctl $*"; fi; }

[ "$(id -u)" -eq 0 ] || { echo "Rode com sudo."; exit 1; }
[[ "$PROJETO" =~ ^[a-z][a-z0-9-]{1,30}$ ]] || { echo "O nome do projeto: só letras minúsculas, números e hífen."; exit 1; }

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

passo "Node.js $NODE_MAJOR (a LTS), pelo repositório oficial da NodeSource"
if ! command -v node > /dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt "$NODE_MAJOR" ]; then
  install -d -m 0755 /etc/apt/keyrings
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor --yes -o /etc/apt/keyrings/nodesource.gpg
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
    > /etc/apt/sources.list.d/nodesource.list
  apt-get update -q && apt-get install -yq nodejs
fi
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
install -d -m 700 -o "$PROJETO" -g "$PROJETO" "$CASA/.ssh"
if [ ! -f "$CASA/.ssh/id_ed25519" ]; then
  sudo -u "$PROJETO" ssh-keygen -q -t ed25519 -N '' -C "$PROJETO@servidor" -f "$CASA/.ssh/id_ed25519"
fi
sudo -u "$PROJETO" bash -c 'ssh-keyscan -t ed25519 github.com >> ~/.ssh/known_hosts 2> /dev/null; sort -u -o ~/.ssh/known_hosts ~/.ssh/known_hosts'
if ! sudo -u "$PROJETO" git ls-remote "$REPO" > /dev/null 2>&1; then
  echo
  echo "O servidor ainda não consegue ler o repositório. Cadastre esta chave no GitHub (Settings, Deploy keys,"
  echo "sem marcar a escrita; ou, do seu computador: gh repo deploy-key add) e rode este script de novo:"
  echo
  cat "$CASA/.ssh/id_ed25519.pub"
  exit 2
fi

passo "O código do projeto"
if [ ! -d "$APP/.git" ]; then
  sudo -u "$PROJETO" git clone -q "$REPO" "$APP"
else
  sudo -u "$PROJETO" git -C "$APP" pull -q --ff-only
fi

passo "O pnpm, na versão que o projeto pede"
VERSAO_PNPM="$(node -p "require('$APP/package.json').packageManager.split('@')[1]")"
if ! command -v pnpm > /dev/null || [ "$(pnpm --version)" != "$VERSAO_PNPM" ]; then
  npm install -g "pnpm@$VERSAO_PNPM"
fi

passo "As configurações da API (o .env, que só existe no servidor)"
ENV_API="$APP/apps/api/.env"
[ -f "$ENV_API" ] || printf 'NODE_ENV=production\nPORTA=3333\nHOST=127.0.0.1\n' > "$ENV_API"
chown "$PROJETO:$PROJETO" "$ENV_API" && chmod 600 "$ENV_API"

passo "Instalar e fazer o build"
sudo -u "$PROJETO" bash -lc "cd '$APP' && pnpm install --frozen-lockfile && pnpm build"

passo "Os dois serviços: a API e a frente"
cat > "/etc/systemd/system/$PROJETO-api.service" << EOF
[Unit]
Description=$PROJETO: a API
After=network.target postgresql.service

[Service]
User=$PROJETO
WorkingDirectory=$APP/apps/api
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
WorkingDirectory=$APP/apps/web
Environment=NODE_ENV=production
Environment=NITRO_HOST=127.0.0.1
Environment=NITRO_PORT=3000
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=always
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF
servico daemon-reload
servico enable "$PROJETO-api" "$PROJETO-web"
servico restart "$PROJETO-api" "$PROJETO-web"

passo "O nginx: a porta de entrada (/api vai para a API; o resto, para a frente)"
cat > "/etc/nginx/sites-available/$PROJETO" << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMINIO www.$DOMINIO;
    client_max_body_size 12m;

    location /api/ {
        proxy_pass http://127.0.0.1:3333;
        include /etc/nginx/proxy_params;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        include /etc/nginx/proxy_params;
    }
}
EOF
ln -sf "/etc/nginx/sites-available/$PROJETO" "/etc/nginx/sites-enabled/$PROJETO"
rm -f /etc/nginx/sites-enabled/default
nginx -t
servico reload nginx

passo "O backup diário do banco, às 3h (vale quando o banco estiver ligado)"
cat > "/etc/systemd/system/$PROJETO-backup.service" << EOF
[Unit]
Description=$PROJETO: backup do banco

[Service]
Type=oneshot
ExecStart=/bin/bash $APP/infra/servidor/backup.sh $PROJETO
EOF
cat > "/etc/systemd/system/$PROJETO-backup.timer" << EOF
[Unit]
Description=$PROJETO: backup do banco, todo dia às 3h

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true

[Install]
WantedBy=timers.target
EOF
servico daemon-reload
servico enable --now "$PROJETO-backup.timer"

passo "Conferindo"
if [ -z "$SEM_SYSTEMD" ]; then
  for _ in $(seq 1 30); do curl -fsS http://127.0.0.1:3333/api/saude > /dev/null 2>&1 && break; sleep 1; done
  curl -fsS -H "Host: $DOMINIO" http://127.0.0.1/api/saude && echo
fi
echo
echo "Pronto. Falta o cadeado, depois que o domínio apontar para este servidor:"
echo "  sudo bash $APP/infra/servidor/cadeado.sh $DOMINIO <seu-email>"
