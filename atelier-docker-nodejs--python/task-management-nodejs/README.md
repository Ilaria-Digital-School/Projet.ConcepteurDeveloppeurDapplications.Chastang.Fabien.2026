# TaskFlow API

API REST de gestion de tâches, utilisée pour la démonstration **CI/CD + déploiement sur un VPS via SSH**
(ilaria Digital School). À chaque `push` sur `main`, GitHub Actions teste le code, construit l'image Docker,
puis se connecte au serveur en SSH pour récupérer la dernière version depuis GitHub et relancer l'application.

## 1. Description et stack

- **Node.js 22** et **Express 5** (modules ES)
- Stockage dans un fichier JSON (volume Docker : les tâches survivent aux redéploiements)
- Tests avec le lanceur intégré de Node (`node --test`), aucune dépendance de test à installer
- **Docker** et **Docker Compose** pour l'exécution
- **GitHub Actions** pour le pipeline

### Endpoints

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/` | Nom, version et environnement de l'API |
| GET | `/health` | Santé du service (utilisé par Docker) |
| GET | `/api/tasks` | Liste des tâches (`?done=true` ou `?done=false` pour filtrer) |
| GET | `/api/tasks/:id` | Une tâche |
| POST | `/api/tasks` | Créer une tâche : `{"title": "..."}` |
| PATCH | `/api/tasks/:id` | Modifier : `{"title": "..."}` et/ou `{"done": true}` |
| DELETE | `/api/tasks/:id` | Supprimer (réponse 204) |

Si la variable `API_KEY` est définie, `POST`, `PATCH` et `DELETE` exigent l'en-tête `x-api-key`. La lecture reste publique.

## 2. Lancement en local

```bash
git clone https://github.com/<utilisateur>/taskflow-api.git
cd taskflow-api
npm install
npm test            # 9 tests
npm run dev         # http://localhost:3000, rechargement automatique
```

Avec Docker :

```bash
cp .env.example .env
docker compose up --build
./scripts/demo.sh   # parcours complet de l'API avec curl
```

## 3. Mise en production (VPS)

**Prérequis serveur** : un VPS Ubuntu ou Debian, un utilisateur avec `sudo`, le port 3000 ouvert (ou celui de `HOST_PORT`).

1. Préparer le serveur (une seule fois) :
   ```bash
   scp scripts/setup-vps.sh utilisateur@IP_DU_VPS:~
   ssh utilisateur@IP_DU_VPS "chmod +x setup-vps.sh && ./setup-vps.sh https://github.com/<utilisateur>/taskflow-api.git"
   ```
   Le script installe Docker, clone le dépôt dans `~/taskflow-api` et crée le `.env`.
   Le dépôt doit être public, sinon ajoutez une *deploy key* ou un jeton au clone.
2. Se reconnecter, puis éditer `~/taskflow-api/.env` (par exemple `API_KEY=...`).
3. Premier lancement : `cd ~/taskflow-api && docker compose up -d --build --wait`.

**Variables d'environnement** (fichier `.env` sur le serveur, jamais dans Git) :

| Variable | Rôle | Défaut |
|---|---|---|
| `NODE_ENV` | Environnement d'exécution | `production` |
| `HOST_PORT` | Port publié sur le serveur | `3000` |
| `API_KEY` | Clé exigée pour les écritures (optionnelle) | vide |

**Commandes de déploiement** (exécutées automatiquement par le pipeline) :

```bash
cd ~/taskflow-api
git fetch origin main && git reset --hard origin/main
docker compose up -d --build --wait
docker image prune -f
```

## 4. Pipeline CI/CD

Fichier : `.github/workflows/ci-cd.yml`

- **Branches surveillées** : `main` et `develop` (push), pull requests vers `main`
- **Étapes** : `test` (npm ci, npm test) → `build` (docker build) → `deploy` (SSH vers le VPS)
- Le job `deploy` ne s'exécute que pour un push sur `main`

### Secrets à configurer dans GitHub

*Settings → Secrets and variables → Actions → New repository secret*

| Secret | Contenu |
|---|---|
| `SSH_HOST` | Adresse IP ou nom de domaine du VPS |
| `SSH_USER` | Utilisateur SSH du VPS |
| `SSH_PRIVATE_KEY` | Clé privée de déploiement (fichier complet, lignes BEGIN et END comprises) |

Créer la clé de déploiement :

```bash
ssh-keygen -t ed25519 -f deploy_key -N "" -C "github-actions-deploy"
ssh-copy-id -i deploy_key.pub utilisateur@IP_DU_VPS   # autorise la clé sur le serveur
cat deploy_key                                         # à copier dans le secret SSH_PRIVATE_KEY
rm deploy_key deploy_key.pub                           # ne laissez pas la clé sur votre machine
```

### Vérifier le déploiement

1. Dans `package.json`, passez `version` à `1.1.0`, puis `git commit` et `git push origin main`.
2. Suivez l'onglet **Actions** : test, build et deploy passent au vert.
3. `curl http://IP_DU_VPS:3000/` affiche la nouvelle version. Les tâches créées avant sont toujours là (volume).

### Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| `Permission denied (publickey)` | Clé publique absente du serveur | Relancer `ssh-copy-id` et vérifier `SSH_USER` |
| `docker: permission denied` sur le VPS | Utilisateur hors du groupe `docker` | Se reconnecter après `setup-vps.sh` |
| `.env: no such file` | Fichier `.env` absent sur le serveur | `cp .env.example .env` dans `~/taskflow-api` |
| Le job reste bloqué sur `--wait` | Healthcheck en échec | `docker compose logs api` sur le VPS |
| Port 3000 inaccessible | Pare-feu du VPS | Ouvrir le port (`sudo ufw allow 3000`) |

> Note de sécurité : `ssh-keyscan` fait confiance à la première empreinte reçue. En production, enregistrez
> l'empreinte du serveur dans un secret (`SSH_KNOWN_HOSTS`) et utilisez-la à la place.
