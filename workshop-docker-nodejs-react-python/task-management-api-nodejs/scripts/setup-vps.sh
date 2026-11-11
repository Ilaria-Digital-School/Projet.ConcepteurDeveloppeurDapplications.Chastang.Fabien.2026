#!/usr/bin/env bash
# À exécuter UNE SEULE FOIS sur le VPS (Ubuntu/Debian), avec un utilisateur disposant de sudo.
# Usage : ./setup-vps.sh https://github.com/<utilisateur>/taskflow-api.git
set -euo pipefail

REPO_URL="${1:?Usage : $0 <url-du-depot-github>}"
APP_DIR="$HOME/taskflow-api"

echo "→ 1/4 Paquets de base"
sudo apt-get update -y
sudo apt-get install -y git curl

echo "→ 2/4 Docker"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sudo sh
fi
sudo usermod -aG docker "$USER"

echo "→ 3/4 Code source"
if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO_URL" "$APP_DIR"
fi

echo "→ 4/4 Fichier .env"
cd "$APP_DIR"
if [ ! -f .env ]; then
  cp .env.example .env
  echo "   .env créé depuis .env.example : pensez à renseigner API_KEY"
fi

cat <<MSG

Serveur prêt. Étapes suivantes :
  1. Déconnectez-vous puis reconnectez-vous (pour activer le groupe docker)
  2. Éditez $APP_DIR/.env (par exemple : nano .env)
  3. Premier lancement :  cd $APP_DIR && docker compose up -d --build --wait
  4. Autorisez la clé de déploiement GitHub Actions dans ~/.ssh/authorized_keys
MSG
