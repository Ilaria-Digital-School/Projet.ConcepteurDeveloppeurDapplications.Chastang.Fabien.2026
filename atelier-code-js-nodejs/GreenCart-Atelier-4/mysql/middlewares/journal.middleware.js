// middlewares/journal.middleware.js : trace chaque requête (slides 26 à 28).
// Repris tel quel de l'atelier 3 : c'est l'exemple de la slide 27, rangé dans son propre fichier.
const journal = (req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  // Sans next(), la requête reste bloquée ici et le client attend sans fin.
  next();
};

module.exports = journal;
