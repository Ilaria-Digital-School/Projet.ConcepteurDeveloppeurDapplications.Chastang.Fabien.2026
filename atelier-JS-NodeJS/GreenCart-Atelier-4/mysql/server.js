// server.js : le point d'entrée. Il démarre le serveur (cours Node.js, slide 14).
// L'application elle-même est configurée dans app.js.
// Repris de l'atelier 3, avec deux lignes en plus : lire le fichier .env et se connecter à la base.
require('dotenv').config(); // lit le fichier .env, avant tout le reste

const app = require('./app');
const { connecter } = require('./config/db');

// Le port 3000 par défaut. Le fichier .env permet d'en choisir un autre (PORT=3002).
const PORT = process.env.PORT || 3000;

connecter(); // la connexion à la base est déjà écrite dans config/db.js

app.listen(PORT, () => {
  console.log(`Serveur GreenCart lancé sur http://localhost:${PORT}`);
});
