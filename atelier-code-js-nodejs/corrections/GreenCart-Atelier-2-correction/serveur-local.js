// serveur-local.js : un petit serveur pour le bonus fetch (exercice 5).
// Fourni : vous n'avez pas à le modifier, ni même à le lire.
//
// Lancement, dans un terminal, depuis ce dossier :
//   node serveur-local.js
// Puis ouvrez http://127.0.0.1:8642 dans le navigateur.
// Pour l'arrêter : Ctrl + C dans le terminal.
//
// Il n'utilise que Node : pas de npm install, pas de connexion internet.
// Pour les curieux : c'est le module http que vous retrouverez à l'atelier 3.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 8642;
const DOSSIER = __dirname;

// Le type de chaque fichier, pour que le navigateur sache le lire
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8'
};

const serveur = http.createServer((req, res) => {
  // L'adresse demandée, sans ce qui suit un ?
  let chemin;
  try {
    chemin = decodeURIComponent(req.url.split('?')[0]);
  } catch (err) {
    // Une adresse mal écrite (%E0 par exemple) : on refuse sans s'arrêter
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Adresse invalide');
    return;
  }
  if (chemin === '/') {
    chemin = '/index.html';
  }

  // On ne sert que les fichiers de ce dossier, jamais au-dessus
  const fichier = path.join(DOSSIER, path.normalize(chemin));
  if (!fichier.startsWith(DOSSIER + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Accès refusé');
    return;
  }

  fs.readFile(fichier, (err, contenu) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Fichier introuvable : ' + chemin);
      return;
    }
    const type = TYPES[path.extname(fichier)] || 'application/octet-stream';
    // no-store : le navigateur relit toujours le fichier, même après une modification
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(contenu);
  });
});

serveur.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Le port ${PORT} est déjà pris. Arrêtez l'autre serveur, ou choisissez un autre port : PORT=8643 node serveur-local.js`);
  } else {
    console.log('Le serveur ne démarre pas : ' + err.message);
  }
});

// 127.0.0.1 : la page n'est visible que depuis votre ordinateur
serveur.listen(PORT, '127.0.0.1', () => {
  console.log(`Page GreenCart servie sur http://127.0.0.1:${PORT}`);
  console.log('Laissez ce terminal ouvert. Ctrl + C pour arrêter.');
});
