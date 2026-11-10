// controllers/produit.controller.js : la logique entre la route et le modèle (slide 22).
// Chaque fonction reçoit req et res, et next pour passer une erreur
// au middleware d'erreur (try/catch, slide 31).
const Produit = require('../models/produit.model');

// GET /api/produits et GET /api/produits?categorie=legumes
const listerProduits = (req, res, next) => {
  try {
    const produits = Produit.trouverTous();

    // CORRIGÉ 1 : le paramètre d'URL ?categorie=... arrive dans req.query.
    const categorie = req.query.categorie;

    // Sans paramètre, on renvoie tout le catalogue, comme avant.
    if (!categorie) {
      return res.json(produits);
    }

    // Avec un paramètre, on garde les produits de cette catégorie.
    // Une boucle for et un if suffisent (cours JavaScript, slides 30 à 34).
    // Une catégorie inconnue donne une liste vide, ce n'est pas une erreur.
    const resultat = [];
    for (let i = 0; i < produits.length; i++) {
      if (produits[i].categorie === categorie) {
        resultat.push(produits[i]);
      }
    }
    res.json(resultat);
  } catch (err) {
    next(err);
  }
};

// GET /api/produits/:id
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

// POST /api/produits
const creerProduit = (req, res, next) => {
  try {
    // CORRIGÉ 2 : le produit envoyé est dans req.body (grâce à express.json()).
    // Le modèle lui donne un id. On répond 201 Created avec le produit créé.
    const produit = Produit.creer(req.body);
    res.status(201).json(produit);
  } catch (err) {
    next(err);
  }
};

// PUT /api/produits/:id
const modifierProduit = (req, res, next) => {
  try {
    // CORRIGÉ 3 : même conversion de l'id que dans afficherProduit.
    const id = Number(req.params.id);
    const produit = Produit.remplacer(id, req.body);

    if (!produit) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }
    // 200 est le code par défaut : res.json suffit.
    res.json(produit);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/produits/:id
const supprimerProduit = (req, res, next) => {
  try {
    // CORRIGÉ 3
    const id = Number(req.params.id);
    const supprime = Produit.supprimer(id);

    if (!supprime) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }
    // 204 No Content : la suppression a réussi, il n'y a rien à renvoyer.
    res.status(204).send();
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
