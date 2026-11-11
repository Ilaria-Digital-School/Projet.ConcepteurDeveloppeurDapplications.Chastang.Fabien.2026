// depot/utilisateurs.js : les utilisateurs, version MongoDB (bonus JWT).
const Utilisateur = require('../models/utilisateur.model');
const aEcrire = require('./a-ecrire');

// Renvoie l'utilisateur qui a cet email { id, email, motDePasseHash, role }, ou null.
// Indice : Utilisateur.findOne({ email: ... }). Passez l'email dans String() pour être sûr que c'est un texte.
async function trouverParEmail(email) {
  throw aEcrire('trouverParEmail', 'depot/utilisateurs.js');
}

module.exports = { trouverParEmail };
