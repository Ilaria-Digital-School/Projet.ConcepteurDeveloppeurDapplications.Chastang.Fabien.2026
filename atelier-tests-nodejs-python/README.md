# Tests en live : 8 exercices

Huit petits exercices pour découvrir comment s'écrit un test et comment il se
lance : 4 en JavaScript avec Jest, puis les 4 mêmes en Python avec pytest.

Chaque exercice tient en deux fichiers : le code à tester, déjà écrit, et un
fichier de tests presque vide, que vous remplissez.

| | JavaScript (Jest) | Python (pytest) | Ce que vous découvrez |
|---|---|---|---|
| 1 et 5 | `01-premier-test` | `05-premier-test` | écrire un test, le lancer, lire un échec |
| 2 et 6 | `02-plusieurs-cas` | `06-plusieurs-cas` | plusieurs cas, la valeur limite |
| 3 et 7 | `03-objets-tableaux` | `07-dicts-listes` | comparer des objets et des listes |
| 4 et 8 | `04-erreurs` | `08-erreurs` | vérifier qu'une erreur est levée |

## JavaScript

Il vous faut Node.js 18 ou plus récent. Une seule fois, dans le dossier `node/` :

```bash
npm install
```

Puis, pour lancer les tests d'un exercice :

```bash
npx jest 01-premier-test
```

Et pour tout lancer : `npm test`. Ajoutez `--verbose` pour voir chaque test.

## Python

Il vous faut Python 3.9 ou plus récent. Une seule fois, dans le dossier `python/` :

```bash
python3 -m venv .venv
source .venv/bin/activate          # Windows : .venv\Scripts\activate
pip install -r requirements.txt
```

Puis, l'environnement activé (`(.venv)` en début de ligne), dans le dossier
de l'exercice :

```bash
cd 05-premier-test
pytest -v
```

Et pour tout lancer : `pytest -v` depuis le dossier `python/`.

## Dans chaque exercice

1. Lisez le code à tester.
2. Écrivez le test dans le fichier de tests.
3. Lancez-le : il doit passer au vert.
4. Cassez volontairement le code, relancez : le test doit passer au rouge.
   Lisez ce qu'il vous dit.
5. Réparez, relancez : vert.

Un test qui n'a jamais été vu rouge ne prouve rien : c'est l'étape 4 qui vous
montre qu'il vérifie vraiment quelque chose.
