// middlewares/validation.middleware.js : vérifie le produit reçu (slide 28).
// Repris tel quel de l'atelier 3 : un produit invalide est refusé avec 400 Bad Request.
// Le contrôleur n'est appelé (next) que si tout est correct.
// La base ajoute ses propres règles (unité, producteur) : config/db.js les traduit en 400.
const CATEGORIES = ['fruits', 'legumes', 'cremerie', 'epicerie'];

const validerProduit = (req, res, next) => {
  const produit = req.body;

  // Pas de corps JSON du tout.
  if (!produit) {
    return res.status(400).json({ message: 'Envoyez le produit en JSON dans le corps de la requête' });
  }

  // typeof donne le type d'une valeur : 'string', 'number', 'boolean'...
  // trim() retire les espaces, pour refuser un nom fait seulement d'espaces.
  if (typeof produit.nom !== 'string' || produit.nom.trim() === '') {
    return res.status(400).json({ message: 'Le nom est obligatoire' });
  }

  // indexOf renvoie -1 quand la valeur n'est pas dans le tableau.
  if (CATEGORIES.indexOf(produit.categorie) === -1) {
    return res.status(400).json({ message: 'La catégorie doit être fruits, legumes, cremerie ou epicerie' });
  }

  // "3.2" entre guillemets est une chaîne, pas un nombre : refusé.
  if (typeof produit.prix !== 'number' || produit.prix <= 0) {
    return res.status(400).json({ message: 'Le prix doit être un nombre plus grand que 0' });
  }

  // Number.isInteger vérifie que c'est un nombre entier (pas 2.5).
  if (!Number.isInteger(produit.stock) || produit.stock < 0) {
    return res.status(400).json({ message: 'Le stock doit être un nombre entier, 0 ou plus' });
  }

  // Tout est correct : on passe la main au contrôleur.
  next();
};

module.exports = validerProduit;
