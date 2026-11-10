// app.js : configure l'application Express et l'exporte (cours Node.js, slide 14).
// server.js la récupère avec require('./app') et la fait écouter sur un port.
// Repris de l'atelier 3. Nouveau : les routes santé, producteurs, commandes et connexion.
const express = require('express');
const santeRoutes = require('./routes/sante.routes');
const produitRoutes = require('./routes/produit.routes');
const producteurRoutes = require('./routes/producteur.routes'); // exercice 3
const commandeRoutes = require('./routes/commande.routes');
const authRoutes = require('./routes/auth.routes');
const journal = require('./middlewares/journal.middleware');
const gererErreurs = require('./middlewares/erreur.middleware');

const app = express();

// Lit le corps JSON des requêtes POST et PUT et le range dans req.body.
// Sans cette ligne, req.body vaut undefined.
app.use(express.json());

// Le journal est un middleware global (slide 29).
// Il est placé AVANT les routes, sinon il ne verrait passer aucune requête.
app.use(journal);

// Une ressource = un fichier de routes (slide 25).
app.use('/api/sante', santeRoutes);
app.use('/api/produits', produitRoutes);
app.use('/api/producteurs', producteurRoutes); // exercice 3
app.use('/api/commandes', commandeRoutes);
app.use('/api/auth', authRoutes);

// Route de test de l'atelier 3 : elle lance volontairement une erreur.
app.get('/api/panne', (req, res) => {
  throw new Error('Panne simulée pour tester le middleware d\'erreur');
});

// Aucune route n'a répondu. On renvoie un 404 en JSON
// plutôt que la page HTML « Cannot GET » d'Express.
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

// Le middleware d'erreur, toujours en dernier (slide 32).
app.use(gererErreurs);

module.exports = app;
