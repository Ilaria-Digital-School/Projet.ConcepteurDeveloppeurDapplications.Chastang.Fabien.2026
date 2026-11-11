// depot/utilisateurs.js : les utilisateurs, version MySQL (bonus JWT).
// Table utilisateurs (id, email, mot_de_passe_hash, role).
const { pool } = require('../config/db');
const aEcrire = require('./a-ecrire');

// Renvoie l'utilisateur qui a cet email { id, email, motDePasseHash, role }, ou null.
// Indice : mot_de_passe_hash AS motDePasseHash
async function trouverParEmail(email) {
  throw aEcrire('trouverParEmail', 'depot/utilisateurs.js');
}

module.exports = { trouverParEmail };
