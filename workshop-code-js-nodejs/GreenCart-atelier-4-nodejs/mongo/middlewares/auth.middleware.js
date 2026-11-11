// Bonus JWT : middleware d'authentification (cours Node.js et Express, slides 28 et 29).
// Il laisse passer la requête seulement si elle porte un jeton valide, dans l'en-tête :
//   Authorization: Bearer <jeton>
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secret-de-developpement';

const verifierToken = (req, res, next) => {
  // 1. Lire l'en-tête Authorization (texte vide s'il est absent)
  const entete = req.headers.authorization || '';

  // 2. Il doit avoir la forme "Bearer <jeton>" : on coupe au niveau de l'espace
  const morceaux = entete.split(' ');
  // À compléter : si morceaux[0] n'est pas 'Bearer' ou si morceaux[1] est vide,
  // répondre 401 avec { message: 'Connexion requise' } (et ne pas appeler next)

  // 3. Vérifier le jeton. jwt.verify lève une erreur s'il est faux ou expiré.
  try {
    req.utilisateur = jwt.verify(morceaux[1], SECRET);
    // À compléter : le jeton est bon, laisser passer la requête (une seule instruction)
  } catch (err) {
    // À compléter : répondre 401 avec { message: 'Jeton invalide ou expiré' }
  }
};

module.exports = verifierToken;
