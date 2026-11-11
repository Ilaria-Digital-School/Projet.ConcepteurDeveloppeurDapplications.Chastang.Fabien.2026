// middlewares/validation-commande.middleware.js : exercice 4.
// Même principe que validation.middleware.js : une commande mal remplie est refusée
// avec 400, avant le contrôleur. Écrire ces contrôles au début de passerCommande marche aussi.
const validerCommande = (req, res, next) => {
  const commande = req.body;

  if (!commande) {
    return res.status(400).json({ message: 'Envoyez la commande en JSON dans le corps de la requête' });
  }

  if (typeof commande.client !== 'string' || commande.client.trim() === '') {
    return res.status(400).json({ message: 'Le nom du client est obligatoire' });
  }

  if (!Array.isArray(commande.lignes) || commande.lignes.length === 0) {
    return res.status(400).json({ message: 'La commande doit contenir au moins une ligne' });
  }

  for (let i = 0; i < commande.lignes.length; i++) {
    const ligne = commande.lignes[i] || {};
    if (ligne.produitId === undefined || ligne.produitId === null || ligne.produitId === '') {
      return res.status(400).json({ message: `Ligne ${i + 1} : le produitId est obligatoire` });
    }
    // Number.isInteger refuse 1.5, "2" et NaN.
    if (!Number.isInteger(ligne.quantite) || ligne.quantite < 1) {
      return res.status(400).json({ message: `Ligne ${i + 1} : la quantité doit être un nombre entier, au moins 1` });
    }
  }

  next();
};

module.exports = validerCommande;
