// depot/utilisateurs.js : les utilisateurs, version MongoDB (bonus JWT).
const Utilisateur = require('../models/utilisateur.model');

// Renvoie { id, email, motDePasseHash, role } ou null
async function trouverParEmail(email) {
  return Utilisateur.findOne({ email: String(email) });
}

module.exports = { trouverParEmail };
