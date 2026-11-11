// accueil-http.js : BONUS. La page d'accueil de GreenCart, sans Express.
//
// Express est construit au-dessus du module http de Node. Ici, on écrit
// à la main ce qu'Express fait pour nous : regarder l'URL demandée,
// choisir le code de statut et l'en-tête, puis envoyer la réponse.
//
// Lancement, dans un deuxième terminal : node accueil-http.js
// Puis ouvrir http://localhost:3001 dans le navigateur.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT_ACCUEIL || 3001;

const fichier = path.join(__dirname, 'data', 'producteurs.json');
const producteurs = JSON.parse(fs.readFileSync(fichier, 'utf8'));

// http.createServer reçoit une fonction appelée à CHAQUE requête.
// Il n'y a pas de routes : on teste nous-mêmes la méthode et l'URL.
const serveur = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // CORRIGÉ 5 : une ligne <li> par producteur, avec une boucle for.
    let liste = '';
    for (let i = 0; i < producteurs.length; i++) {
      liste += `<li>${producteurs[i].nom} (${producteurs[i].ville})</li>`;
    }

    const page = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>GreenCart</title>
</head>
<body>
  <h1>GreenCart</h1>
  <p>Des produits locaux, en direct des producteurs.</p>
  <h2>Nos producteurs</h2>
  <ul>${liste}</ul>
</body>
</html>`;

    // Sans Express, pas de res.status() ni de res.json() :
    // writeHead fixe le code et les en-têtes, end envoie le contenu.
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page);
  } else {
    // Toute autre adresse : 404.
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Page introuvable');
  }
});

serveur.listen(PORT, () => {
  console.log(`Page d'accueil GreenCart sur http://localhost:${PORT}`);
});
