#!/usr/bin/env bash
# Parcours de démonstration de l'API.
# Usage : ./scripts/demo.sh [url] [cle-api]      ex. ./scripts/demo.sh http://203.0.113.10:3000 ma-cle
set -euo pipefail

BASE="${1:-http://localhost:3000}"
KEY="${2:-}"
HEADERS=(-H "Content-Type: application/json")
[ -n "$KEY" ] && HEADERS+=(-H "x-api-key: $KEY")

step() { printf '\n\033[1;31m→ %s\033[0m\n' "$1"; }

step "Version déployée";           curl -s "$BASE/"; echo
step "Santé";                      curl -s "$BASE/health"; echo
step "Création de 2 tâches"
FIRST=$(curl -s "${HEADERS[@]}" -d '{"title":"Écrire le Dockerfile"}' "$BASE/api/tasks")
echo "$FIRST"
ID=$(echo "$FIRST" | sed -n 's/.*"id":\([0-9]*\).*/\1/p')
curl -s "${HEADERS[@]}" -d '{"title":"Déployer sur le VPS"}' "$BASE/api/tasks"; echo
step "Tâche $ID terminée";         curl -s "${HEADERS[@]}" -X PATCH -d '{"done":true}' "$BASE/api/tasks/$ID"; echo
step "Liste des tâches terminées"; curl -s "$BASE/api/tasks?done=true"; echo
step "Liste complète";             curl -s "$BASE/api/tasks"; echo
step "Suppression de la tâche $ID"; curl -s -o /dev/null -w 'HTTP %{http_code}\n' "${HEADERS[@]}" -X DELETE "$BASE/api/tasks/$ID"
