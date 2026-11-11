// app.js : configure l'application Express et l'exporte (cours Node.js, slide 14).
// server.js la récupère avec require('./app') et la fait écouter sur un port.
const express = require('express');
const produitRoutes = require('./routes/produit.routes');
const journal = require('./middlewares/journal.middleware');
const gererErreurs = require('./middlewares/erreur.middleware');

const app = express();

// Lit le corps JSON des requêtes POST et PUT et le range dans req.body.
// Sans cette ligne, req.body vaut undefined.
app.use(express.json());

// CORRIGÉ 4.1 : le journal est un middleware global (slide 29).
// Il est placé AVANT les routes, sinon il ne verrait passer aucune requête.
app.use(journal);

// Toutes les routes des produits commencent par /api/produits (slide 25).
app.use('/api/produits', produitRoutes);

// Route de test pour l'exercice 4.3 : elle lance volontairement une erreur.
app.get('/api/panne', (req, res) => {
  throw new Error('Panne simulée pour tester le middleware d\'erreur');
});

// CORRIGÉ 4.3 : aucune route n'a répondu. On renvoie un 404 en JSON
// plutôt que la page HTML « Cannot GET » d'Express.
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

// CORRIGÉ 4.3 : le middleware d'erreur, toujours en dernier (slide 32).
app.use(gererErreurs);

module.exports = app;
