// app.js : configure l'application Express et l'exporte (cours Node.js, slide 14).
// server.js la récupère avec require('./app') et la fait écouter sur un port.
const express = require('express');
const produitRoutes = require('./routes/produit.routes');

// Exercice 4.1 et 4.3 : retirez les // devant ces lignes quand vous en avez besoin.
// const journal = require('./middlewares/journal.middleware');
// const gererErreurs = require('./middlewares/erreur.middleware');

const app = express();

// Lit le corps JSON des requêtes POST et PUT et le range dans req.body.
// Sans cette ligne, req.body vaut undefined. Ne la retirez pas.
app.use(express.json());

// Exercice 4.1 : branchez ici le journal, en middleware global (slide 29).

// Toutes les routes des produits commencent par /api/produits (slide 25).
app.use('/api/produits', produitRoutes);

// Route de test pour l'exercice 4.3 : elle lance volontairement une erreur.
// Ne la modifiez pas.
app.get('/api/panne', (req, res) => {
  throw new Error('Panne simulée pour tester le middleware d\'erreur');
});

// Exercice 4.3 : ajoutez ici, dans cet ordre,
//   1. le middleware « route introuvable » (404 en JSON)
//   2. le middleware d'erreur (slide 32), toujours en dernier

module.exports = app;
