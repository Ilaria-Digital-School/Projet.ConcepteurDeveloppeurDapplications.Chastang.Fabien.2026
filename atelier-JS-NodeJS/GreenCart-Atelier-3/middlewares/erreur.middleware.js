// middlewares/erreur.middleware.js : la gestion centralisée des erreurs (slide 32).
// Exercice 4.3 : Express reconnaît un middleware d'erreur à ses QUATRE paramètres.
const gererErreurs = (err, req, res, next) => {
  // À compléter : affichez err.message dans la console,
  // puis répondez 500 avec un JSON { message: ... }.
};

module.exports = gererErreurs;
