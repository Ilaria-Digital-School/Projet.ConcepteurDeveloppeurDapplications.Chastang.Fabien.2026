// depot/producteurs.js : les producteurs, version MySQL (exercice 3).
// Mêmes noms que depot/produits.js, plus listerProduits.
const { pool } = require('../config/db');

async function trouverTous() {
  const [lignes] = await pool.execute('SELECT id, nom, ville FROM producteurs ORDER BY id');
  return lignes;
}

async function trouverParId(id) {
  const [lignes] = await pool.execute('SELECT id, nom, ville FROM producteurs WHERE id = ?', [id]);
  if (lignes.length === 0) return null;
  return lignes[0];
}

async function creer(p) {
  const [resultat] = await pool.execute('INSERT INTO producteurs (nom, ville) VALUES (?, ?)', [p.nom, p.ville]);
  return trouverParId(resultat.insertId);
}

async function remplacer(id, p) {
  const [resultat] = await pool.execute('UPDATE producteurs SET nom = ?, ville = ? WHERE id = ?', [p.nom, p.ville, id]);
  if (resultat.affectedRows === 0) return null;
  return trouverParId(id);
}

// Si le producteur a encore des produits, la clé étrangère bloque le DELETE :
// MySQL lève l'erreur ER_ROW_IS_REFERENCED_2, que config/db.js traduit en 409.
async function supprimer(id) {
  const [resultat] = await pool.execute('DELETE FROM producteurs WHERE id = ?', [id]);
  return resultat.affectedRows > 0;
}

// Les produits d'un producteur. Avec une jointure, on pourrait aussi ramener le nom du producteur :
// SELECT p.nom, f.nom AS producteur FROM produits p JOIN producteurs f ON f.id = p.producteur_id WHERE f.id = ?
async function listerProduits(id) {
  const [lignes] = await pool.execute(
    'SELECT id, nom, categorie, prix, unite, stock, bio, producteur_id AS producteurId FROM produits WHERE producteur_id = ? ORDER BY id',
    [id]
  );
  return lignes;
}

module.exports = { trouverTous, trouverParId, creer, remplacer, supprimer, listerProduits };
