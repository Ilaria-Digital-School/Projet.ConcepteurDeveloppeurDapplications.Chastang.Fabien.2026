// middlewares/journal.middleware.js : trace chaque requête (slides 26 à 28).
// Exercice 4.1
const journal = (req, res, next) => {
  // À compléter : affichez dans la console la méthode et l'URL de la requête.

  next();
};

module.exports = journal;
