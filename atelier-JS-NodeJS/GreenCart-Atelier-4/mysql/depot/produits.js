// depot/produits.js : les produits, version MySQL (exercices 1 et 2).
// Il remplace le modèle en mémoire de l'atelier 3, avec les mêmes noms de fonctions :
// trouverTous, trouverParId, creer, remplacer, supprimer.
// Le contrôleur controllers/produit.controller.js appelle déjà ces fonctions : ne changez pas leurs noms.
//
// Règle d'or : les valeurs venues du client ne sont JAMAIS collées dans le texte SQL.
// On écrit des "?" et on passe les valeurs à part, dans un tableau :
//   const [lignes] = await pool.execute('SELECT ... FROM produits WHERE id = ?', [id]);
// "lignes" est un tableau d'objets, un objet par ligne trouvée.
const { pool } = require('../config/db');
const aEcrire = require('./a-ecrire');

// Les colonnes à renvoyer. "producteur_id AS producteurId" renomme la colonne pour le JSON.
// Utilisation : `SELECT ${COLONNES} FROM produits ...`
// (Ce texte est une constante écrite par nous, pas une valeur du client : il peut être collé.)
const COLONNES = 'id, nom, categorie, prix, unite, stock, bio, producteur_id AS producteurId';

// Déjà écrite. Garde seulement les champs d'un produit, comme le modèle de l'atelier 3.
// Un champ absent devient null : MySQL le refusera proprement (colonne NOT NULL).
// Utilisation : const p = champsProduit(donnees);
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

// Exercice 1 : renvoie tous les produits, ou seulement ceux d'une catégorie.
// filtres.categorie vaut par exemple 'legumes', ou undefined s'il n'y a pas de filtre.
async function trouverTous(filtres) {
  throw aEcrire('trouverTous', 'depot/produits.js');
}

// Exercice 1 : renvoie le produit qui a cet id, ou null s'il n'existe pas.
async function trouverParId(id) {
  throw aEcrire('trouverParId', 'depot/produits.js');
}

// Exercice 2 : crée le produit et le renvoie (avec son id).
// donnees est le corps de la requête : passez-le d'abord dans champsProduit.
// Indice : après un INSERT, le résultat contient insertId, l'id donné par MySQL.
async function creer(donnees) {
  throw aEcrire('creer', 'depot/produits.js');
}

// Exercice 2 : remplace le produit et renvoie sa version APRÈS modification, ou null s'il n'existe pas.
// Indice : après un UPDATE, resultat.affectedRows vaut 0 si aucune ligne n'a cet id.
async function remplacer(id, donnees) {
  throw aEcrire('remplacer', 'depot/produits.js');
}

// Exercice 2 : supprime le produit. Renvoie true s'il existait, false sinon.
async function supprimer(id) {
  throw aEcrire('supprimer', 'depot/produits.js');
}

module.exports = { trouverTous, trouverParId, creer, remplacer, supprimer };
