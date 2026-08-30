#!/usr/bin/env bash
# Execute como root na VPS após um deploy caso o Coolify restaure o domínio sslip.io.
# Exemplo: /root/fix-domain-missaoimunidade.sh

set -euo pipefail

APP_UUID="${APP_UUID:-nrcpwtpehztonw0e4ivs71oi}"
DOMAIN="${DOMAIN:-missaoimunidade.furquim.cloud}"
APP_DIR="/data/coolify/applications/${APP_UUID}"
COMPOSE_FILE="${APP_DIR}/docker-compose.yaml"

[[ -f "$COMPOSE_FILE" ]] || {
  echo "Arquivo não encontrado: $COMPOSE_FILE" >&2
  exit 1
}

cp -p "$COMPOSE_FILE" "${COMPOSE_FILE}.bak-domain"
OLD_DOMAIN="$(grep -oE "${APP_UUID}(\.[0-9]{1,3}){4}\.sslip\.io" "$COMPOSE_FILE" | head -n 1 || true)"
if [[ -n "$OLD_DOMAIN" ]]; then
  sed -i "s|${OLD_DOMAIN}|${DOMAIN}|g" "$COMPOSE_FILE"
fi
sed -i "s|traefik.http.routers.http-0-${APP_UUID}.middlewares=gzip|traefik.http.routers.http-0-${APP_UUID}.middlewares=redirect-to-https|" "$COMPOSE_FILE"

if ! grep -q "traefik.http.routers.https-0-${APP_UUID}.tls.certresolver" "$COMPOSE_FILE"; then
  sed -i "/traefik.http.routers.http-0-${APP_UUID}.service=/a\            - traefik.http.routers.https-0-${APP_UUID}.entryPoints=https\n            - traefik.http.routers.https-0-${APP_UUID}.middlewares=gzip\n            - 'traefik.http.routers.https-0-${APP_UUID}.rule=Host(\\\`${DOMAIN}\\\`) && PathPrefix(\\\`/\\\`)'\n            - traefik.http.routers.https-0-${APP_UUID}.service=http-0-${APP_UUID}\n            - traefik.http.routers.https-0-${APP_UUID}.tls=true\n            - traefik.http.routers.https-0-${APP_UUID}.tls.certresolver=letsencrypt" "$COMPOSE_FILE"
fi

cd "$APP_DIR"
docker compose up -d --force-recreate
printf 'Domínio aplicado: https://%s\n' "$DOMAIN"
