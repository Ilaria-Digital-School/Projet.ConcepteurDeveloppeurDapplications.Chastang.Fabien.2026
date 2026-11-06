#!/bin/sh
set -e

echo "=========================================================="
echo "Démarrage du backend Django..."
echo "=========================================================="

echo "Vérification de la disponibilité de MySQL ($MYSQL_HOST:$MYSQL_PORT)..."

python << 'EOF'
import sys
import socket
import time
import os

host = os.environ.get('MYSQL_HOST', 'db')
port = int(os.environ.get('MYSQL_PORT', 3306))

for attempt in range(1, 61):
    try:
        with socket.create_connection((host, port), timeout=2):
            print(f"✓ Base de données MySQL prête sur {host}:{port}")
            sys.exit(0)
    except OSError:
        time.sleep(1)

print(f"✗ Erreur : MySQL ({host}:{port}) n'a pas répondu dans le délai imparti.")
sys.exit(1)
EOF

echo "Application des migrations de base de données..."
# L'option --fake-initial permet à Django d'ignorer la création si la table existe déjà (ex: créée par init.sql)
python manage.py migrate --fake-initial --noinput

echo "Collecte des fichiers statiques..."
python manage.py collectstatic --noinput --clear 2>/dev/null || true

echo "Initialisation des données de test si la base est vide..."
python << 'EOF'
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from etudiants.models import Etudiant

if Etudiant.objects.count() == 0:
    Etudiant.objects.bulk_create([
        Etudiant(nom='DIOP', prenom='Awa', email='awa.diop@example.com', telephone='+221 77 123 45 67', filiere='Génie Logiciel'),
        Etudiant(nom='FALL', prenom='Moussa', email='moussa.fall@example.com', telephone='+221 70 987 65 43', filiere='Réseaux & Télécoms'),
        Etudiant(nom='TRAORE', prenom='Fatou', email='fatou.traore@example.com', telephone='+221 76 555 44 33', filiere='Cybersécurité'),
    ])
    print("✓ Données de démonstration créées avec succès !")
EOF

echo "Lancement de la commande : $@"
exec "$@"
