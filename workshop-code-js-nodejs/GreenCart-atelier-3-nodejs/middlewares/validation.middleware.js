// middlewares/validation.middleware.js : vérifie le produit reçu (slide 28).
// Exercice 4.2 : un produit invalide est refusé avec 400 et un message en JSON.
// Le contrôleur n'est appelé (next) que si tout est correct.
const CATEGORIES = ['fruits', 'legumes', 'cremerie', 'epicerie'];

const validerProduit = (req, res, next) => {
  const produit = req.body;

  // À compléter : une vérification par règle de l'énoncé.
  // Exemple pour la première règle :
  if (!produit || typeof produit.nom !== 'string' || produit.nom.trim() === '') {
    return res.status(400).json({ message: 'Le nom doit être une chaîne de caractères non vide' });
  }
  if (!CATEGORIES.includes(produit.categorie)) {
    return res.status(400).json({ message: `La catégorie doit être l'une des suivantes : "${CATEGORIES.join('", "')}"` });
  }
  if (!Number.isFinite(produit.prix) || produit.prix <= 0) {
    return res.status(400).json({ message: 'Le prix doit être un nombre positif' });
  }
  if (!Number.isFinite(produit.stock) || produit.stock < 0 || !Number.isInteger(produit.stock)) {
    return res.status(400).json({ message: 'Le stock doit être un nombre entier positif ou nul' });
  }

  next();
};

module.exports = validerProduit;
