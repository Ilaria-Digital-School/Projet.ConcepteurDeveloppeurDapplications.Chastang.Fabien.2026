// controllers/produit.controller.js : la logique entre la route et le modèle (slide 22).
// Chaque fonction reçoit req et res, et next pour passer une erreur
// au middleware d'erreur (try/catch, slide 31).
const Produit = require('../models/produit.model');

// GET /api/produits : EXEMPLE FOURNI, à compléter à l'exercice 1.
const listerProduits = (req, res, next) => {
  try {
    const produits = Produit.trouverTous();

    // Exercice 1 : si l'URL contient ?categorie=..., ne renvoyez que
    // les produits de cette catégorie. Sinon, renvoyez tout.

    res.json(produits);
  } catch (err) {
    next(err);
  }
};

// GET /api/produits/:id : EXEMPLE FOURNI, complet. Inspirez-vous-en.
const afficherProduit = (req, res, next) => {
  try {
    // req.params.id est une chaîne : "3". Les id du modèle sont des nombres.
    const id = Number(req.params.id);
    const produit = Produit.trouverParId(id);

    if (!produit) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }
    res.json(produit);
  } catch (err) {
    next(err);
  }
};

// POST /api/produits : exercice 2.
const creerProduit = (req, res, next) => {
  try {
    // À compléter. Remplacez la ligne ci-dessous.
    res.status(501).json({ message: 'creerProduit est à compléter' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/produits/:id : exercice 3.
const modifierProduit = (req, res, next) => {
  try {
    // À compléter. Remplacez la ligne ci-dessous.
    res.status(501).json({ message: 'modifierProduit est à compléter' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/produits/:id : exercice 3.
const supprimerProduit = (req, res, next) => {
  try {
    // À compléter. Remplacez la ligne ci-dessous.
    res.status(501).json({ message: 'supprimerProduit est à compléter' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listerProduits,
  afficherProduit,
  creerProduit,
  modifierProduit,
  supprimerProduit
};
