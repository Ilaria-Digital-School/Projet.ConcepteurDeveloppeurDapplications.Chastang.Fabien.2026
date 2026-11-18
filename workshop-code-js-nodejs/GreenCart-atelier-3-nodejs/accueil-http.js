// accueil-http.js : BONUS. La page d'accueil de GreenCart, sans Express.
//
// Express est construit au-dessus du module http de Node. Ici, vous écrivez
// à la main ce qu'Express fait pour vous : regarder l'URL demandée,
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
// Il n'y a pas de routes : vous testez vous-même la méthode et l'URL.
const serveur = http.createServer((req, res) => {
  // À compléter, en trois étapes.

  if (req.method === 'GET' && req.url === '/') {
    // 1. Si req.method vaut 'GET' et req.url vaut '/' :
    //    construisez une chaîne liste avec une boucle for,
    //    une ligne <li>Nom (Ville)</li> par producteur.
    //    Puis la page : un titre <h1>GreenCart</h1>, une phrase dans un <p>,
    //    un sous-titre <h2>Nos producteurs</h2>, et <ul> + liste + </ul>.
    let liste = '';
    for (const producteur of producteurs) {
      liste += `<li>${producteur.nom} (${producteur.ville})</li>`;
    }
    const page = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>GreenCart</title>
        </head>
        <body>
          <h1>GreenCart</h1>
          <p>Des produits locaux, en direct des producteurs.</p>
          <h2>Nos producteurs</h2>
          <ul>${liste}</ul>
        </body>
      </html>
    `;

    // 2. Envoyez la page :
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page);
  } else {
    // 3. Sinon : res.writeHead(404, ...) et res.end('Page introuvable').
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Page introuvable');
  }
});

serveur.listen(PORT, () => {
  console.log(`Page d'accueil GreenCart sur http://localhost:${PORT}`);
});
