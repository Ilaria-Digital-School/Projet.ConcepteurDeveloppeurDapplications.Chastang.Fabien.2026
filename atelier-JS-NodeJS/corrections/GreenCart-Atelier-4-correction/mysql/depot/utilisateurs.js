// depot/utilisateurs.js : les utilisateurs, version MySQL (bonus JWT).
const { pool } = require('../config/db');

// Renvoie { id, email, motDePasseHash, role } ou null
async function trouverParEmail(email) {
  const [lignes] = await pool.execute(
    'SELECT id, email, mot_de_passe_hash AS motDePasseHash, role FROM utilisateurs WHERE email = ?',
    [email]
  );
  if (lignes.length === 0) return null;
  return lignes[0];
}

module.exports = { trouverParEmail };
