// Bonus JWT : middleware d'authentification (cours Node.js et Express, slides 28 et 29).
// Il laisse passer la requête seulement si elle porte un jeton valide :
//   Authorization: Bearer <jeton>
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secret-de-developpement';

const verifierToken = (req, res, next) => {
  // 1. Lire l'en-tête Authorization
  const entete = req.headers.authorization || '';

  // 2. Il doit avoir la forme "Bearer <jeton>"
  const morceaux = entete.split(' ');
  if (morceaux[0] !== 'Bearer' || !morceaux[1]) {
    return res.status(401).json({ message: 'Connexion requise' });
  }

  // 3. Vérifier la signature et la date d'expiration du jeton
  try {
    req.utilisateur = jwt.verify(morceaux[1], SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Jeton invalide ou expiré' });
  }
};

module.exports = verifierToken;
