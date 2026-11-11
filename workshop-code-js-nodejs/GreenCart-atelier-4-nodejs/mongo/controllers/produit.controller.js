// controllers/produit.controller.js : la logique entre la route et le dépôt (slide 22).
// Repris de l'atelier 3. Ce qui change : le modèle en mémoire est remplacé par le dépôt
// (depot/produits.js), qui parle à la base. Les mêmes noms de fonctions, les mêmes codes HTTP.
// Une base répond avec un délai : chaque fonction devient async, et chaque appel au dépôt
// prend un await. Le try/catch passe toujours l'erreur au middleware d'erreur (slide 31).
const depot = require('../depot/produits');

// GET /api/produits et GET /api/produits?categorie=legumes
const listerProduits = async (req, res, next) => {
  try {
    // Le filtre par catégorie se fait maintenant dans la base, par le dépôt.
    // Sans paramètre, req.query.categorie vaut undefined et tout le catalogue revient.
    const produits = await depot.trouverTous({ categorie: req.query.categorie });
    res.json(produits);
  } catch (err) {
    next(err);
  }
};

// GET /api/produits/:id
const afficherProduit = async (req, res, next) => {
  try {
    // L'id reste tel quel : un nombre en texte avec MySQL ("4"), un ObjectId avec MongoDB.
    // C'est le dépôt qui sait le lire.
    const produit = await depot.trouverParId(req.params.id);

    if (!produit) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }
    res.json(produit);
  } catch (err) {
    next(err);
  }
};

// POST /api/produits
const creerProduit = async (req, res, next) => {
  try {
    // Le produit envoyé est dans req.body. Le dépôt lui donne un id.
    // On répond 201 Created avec le produit créé.
    const produit = await depot.creer(req.body);
    res.status(201).json(produit);
  } catch (err) {
    next(err);
  }
};

// PUT /api/produits/:id
const modifierProduit = async (req, res, next) => {
  try {
    const produit = await depot.remplacer(req.params.id, req.body);

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
const supprimerProduit = async (req, res, next) => {
  try {
    const supprime = await depot.supprimer(req.params.id);

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
