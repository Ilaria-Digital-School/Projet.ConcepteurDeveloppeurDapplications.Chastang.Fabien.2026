// middlewares/erreur.middleware.js : la gestion centralisée des erreurs (slide 32).
// Repris de l'atelier 3. Une seule nouveauté, marquée « Atelier 4 » :
// les erreurs propres à la base sont traduites par config/db.js.
// Express reconnaît un middleware d'erreur à ses QUATRE paramètres.
const { erreurDeLaBase } = require('../config/db');

const gererErreurs = (err, req, res, next) => {
  // Le détail reste dans le terminal du serveur, pour le développeur.
  console.error('Erreur :', err.message);

  // Atelier 4 : une erreur de la base (donnée refusée, base arrêtée...)
  // devient un code HTTP et un message clair. null si ce n'est pas une erreur de la base.
  const traduite = erreurDeLaBase(err);
  if (traduite) {
    return res.status(traduite.status).json({ message: traduite.message });
  }

  // Certaines erreurs portent déjà un code. Par exemple, un JSON mal écrit
  // dans le corps d'une requête arrive avec err.status = 400. Sinon, 500.
  const statut = err.status || 500;

  res.status(statut).json({ message: err.message });
};

module.exports = gererErreurs;
