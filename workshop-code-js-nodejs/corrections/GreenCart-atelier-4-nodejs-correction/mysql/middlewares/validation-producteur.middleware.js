// middlewares/validation-producteur.middleware.js : exercice 3.
// Copié sur validation.middleware.js : un producteur sans nom ou sans ville est refusé avec 400.
const validerProducteur = (req, res, next) => {
  const producteur = req.body;

  if (!producteur) {
    return res.status(400).json({ message: 'Envoyez le producteur en JSON dans le corps de la requête' });
  }

  if (typeof producteur.nom !== 'string' || producteur.nom.trim() === '') {
    return res.status(400).json({ message: 'Le nom est obligatoire' });
  }

  if (typeof producteur.ville !== 'string' || producteur.ville.trim() === '') {
    return res.status(400).json({ message: 'La ville est obligatoire' });
  }

  next();
};

module.exports = validerProducteur;
