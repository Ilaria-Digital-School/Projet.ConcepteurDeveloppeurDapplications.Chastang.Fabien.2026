// middlewares/validation.middleware.js : vérifie le produit reçu (slide 28).
// Exercice 4.2 : un produit invalide est refusé avec 400 et un message en JSON.
// Le contrôleur n'est appelé (next) que si tout est correct.
const CATEGORIES = ['fruits', 'legumes', 'cremerie', 'epicerie'];

const validerProduit = (req, res, next) => {
  const produit = req.body;

  // À compléter : une vérification par règle de l'énoncé.
  // Exemple pour la première règle :
  // if (typeof produit.nom !== 'string' || produit.nom === '') {
  //   return res.status(400).json({ message: 'Le nom est obligatoire' });
  // }

  next();
};

module.exports = validerProduit;
