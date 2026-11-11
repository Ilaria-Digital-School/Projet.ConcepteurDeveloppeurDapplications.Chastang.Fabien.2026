// depot/produits.js : les produits, version MySQL (exercices 1 et 2).
// Il remplace le modèle en mémoire de l'atelier 3, avec les mêmes noms de fonctions :
// trouverTous, trouverParId, creer, remplacer, supprimer.
// Règle d'or : les valeurs venues du client ne sont JAMAIS collées dans le texte SQL.
// On écrit des "?" et on passe les valeurs à part : c'est une requête paramétrée.
const { pool } = require('../config/db');

// Les colonnes renvoyées, avec "producteur_id" renommé en "producteurId" pour le JSON.
// (Ce texte est une constante écrite par nous, pas une valeur du client : il peut être collé.)
const COLONNES = 'id, nom, categorie, prix, unite, stock, bio, producteur_id AS producteurId';

// Déjà écrite. Garde seulement les champs d'un produit, comme le modèle de l'atelier 3.
// Un champ absent devient null : MySQL le refusera proprement (colonne NOT NULL).
function champsProduit(donnees) {
  return {
    nom: donnees.nom,
    categorie: donnees.categorie,
    prix: donnees.prix,
    unite: donnees.unite || null,
    stock: donnees.stock,
    bio: donnees.bio === true,
    producteurId: donnees.producteurId || null
  };
}

// Exercice 1 : tous les produits, ou ceux d'une catégorie
async function trouverTous(filtres) {
  if (filtres && filtres.categorie) {
    const [lignes] = await pool.execute(
      `SELECT ${COLONNES} FROM produits WHERE categorie = ? ORDER BY id`,
      [String(filtres.categorie)]
    );
    return lignes;
  }
  const [lignes] = await pool.execute(`SELECT ${COLONNES} FROM produits ORDER BY id`);
  return lignes;
}

// Exercice 1 : le produit qui a cet id, ou null
async function trouverParId(id) {
  const [lignes] = await pool.execute(`SELECT ${COLONNES} FROM produits WHERE id = ?`, [id]);
  if (lignes.length === 0) return null;
  return lignes[0];
}

// Exercice 2 : crée le produit et le renvoie, avec son id
async function creer(donnees) {
  const p = champsProduit(donnees);
  const [resultat] = await pool.execute(
    'INSERT INTO produits (nom, categorie, prix, unite, stock, bio, producteur_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [p.nom, p.categorie, p.prix, p.unite, p.stock, p.bio, p.producteurId]
  );
  // insertId : l'id que MySQL vient de donner (AUTO_INCREMENT)
  return trouverParId(resultat.insertId);
}

// Exercice 2 : remplace le produit, renvoie le produit modifié ou null
async function remplacer(id, donnees) {
  const p = champsProduit(donnees);
  const [resultat] = await pool.execute(
    'UPDATE produits SET nom = ?, categorie = ?, prix = ?, unite = ?, stock = ?, bio = ?, producteur_id = ? WHERE id = ?',
    [p.nom, p.categorie, p.prix, p.unite, p.stock, p.bio, p.producteurId, id]
  );
  // affectedRows : le nombre de lignes trouvées par le WHERE. 0 = pas de produit avec cet id
  if (resultat.affectedRows === 0) return null;
  return trouverParId(id);
}

// Exercice 2 : supprime le produit, renvoie true s'il existait
async function supprimer(id) {
  const [resultat] = await pool.execute('DELETE FROM produits WHERE id = ?', [id]);
  return resultat.affectedRows > 0;
}

module.exports = { trouverTous, trouverParId, creer, remplacer, supprimer };
