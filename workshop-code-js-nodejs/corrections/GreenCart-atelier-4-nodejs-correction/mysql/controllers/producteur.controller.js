// controllers/producteur.controller.js : exercice 3, copié sur produit.controller.js.
const depot = require('../depot/producteurs');

// GET /api/producteurs
const listerProducteurs = async (req, res, next) => {
  try {
    const producteurs = await depot.trouverTous();
    res.json(producteurs);
  } catch (err) {
    next(err);
  }
};

// GET /api/producteurs/:id
const afficherProducteur = async (req, res, next) => {
  try {
    const producteur = await depot.trouverParId(req.params.id);

    if (!producteur) {
      return res.status(404).json({ message: 'Producteur introuvable' });
    }
    res.json(producteur);
  } catch (err) {
    next(err);
  }
};

// GET /api/producteurs/:id/produits
const listerProduitsDuProducteur = async (req, res, next) => {
  try {
    // D'abord vérifier que le producteur existe, sinon on renverrait [] au lieu de 404.
    const producteur = await depot.trouverParId(req.params.id);

    if (!producteur) {
      return res.status(404).json({ message: 'Producteur introuvable' });
    }
    const produits = await depot.listerProduits(req.params.id);
    res.json(produits);
  } catch (err) {
    next(err);
  }
};

// POST /api/producteurs
const creerProducteur = async (req, res, next) => {
  try {
    const producteur = await depot.creer(req.body);
    res.status(201).json(producteur);
  } catch (err) {
    next(err);
  }
};

// PUT /api/producteurs/:id
const modifierProducteur = async (req, res, next) => {
  try {
    const producteur = await depot.remplacer(req.params.id, req.body);

    if (!producteur) {
      return res.status(404).json({ message: 'Producteur introuvable' });
    }
    res.json(producteur);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/producteurs/:id
const supprimerProducteur = async (req, res, next) => {
  try {
    const supprime = await depot.supprimer(req.params.id);

    if (!supprime) {
      return res.status(404).json({ message: 'Producteur introuvable' });
    }
    res.status(204).send();
  } catch (err) {
    // Un producteur qui a encore des produits arrive ici, avec un code 409.
    next(err);
  }
};

module.exports = {
  listerProducteurs,
  afficherProducteur,
  listerProduitsDuProducteur,
  creerProducteur,
  modifierProducteur,
  supprimerProducteur
};
