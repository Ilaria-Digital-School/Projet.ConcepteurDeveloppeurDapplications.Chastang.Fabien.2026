// server.js : le point d'entrée. Il démarre le serveur (cours Node.js, slide 14).
// L'application elle-même est configurée dans app.js.
const app = require('./app');

// Le port 3000 par défaut. process.env.PORT permet d'en choisir un autre
// au lancement, par exemple : PORT=3002 npm run dev (Mac et Linux).
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur GreenCart lancé sur http://localhost:${PORT}`);
});
