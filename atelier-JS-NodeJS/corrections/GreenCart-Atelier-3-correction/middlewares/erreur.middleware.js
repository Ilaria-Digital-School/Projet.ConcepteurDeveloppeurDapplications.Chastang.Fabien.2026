// middlewares/erreur.middleware.js : la gestion centralisée des erreurs (slide 32).
// CORRIGÉ 4.3 : Express reconnaît un middleware d'erreur à ses QUATRE paramètres.
// Il reçoit toutes les erreurs passées avec next(err) ou lancées avec throw.
const gererErreurs = (err, req, res, next) => {
  // Le détail reste dans le terminal du serveur, pour le développeur.
  console.error('Erreur :', err.message);

  // Certaines erreurs portent déjà un code. Par exemple, un JSON mal écrit
  // dans le corps d'une requête arrive avec err.status = 400. Sinon, 500.
  const statut = err.status || 500;

  res.status(statut).json({ message: err.message });
};

module.exports = gererErreurs;
