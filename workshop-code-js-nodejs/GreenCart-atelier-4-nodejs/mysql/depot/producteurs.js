// depot/producteurs.js : les producteurs, version MySQL (exercice 3).
// Mêmes fonctions que depot/produits.js, sur la table producteurs (id, nom, ville), plus listerProduits.
const { pool } = require('../config/db');
const aEcrire = require('./a-ecrire');

// Tous les producteurs
async function trouverTous() {
  throw aEcrire('trouverTous', 'depot/producteurs.js');
}

// Le producteur qui a cet id, ou null
async function trouverParId(id) {
  throw aEcrire('trouverParId', 'depot/producteurs.js');
}

// Crée le producteur { nom, ville } et le renvoie
async function creer(p) {
  throw aEcrire('creer', 'depot/producteurs.js');
}

// Remplace nom et ville. Renvoie le producteur modifié, ou null
async function remplacer(id, p) {
  throw aEcrire('remplacer', 'depot/producteurs.js');
}

// Supprime le producteur. Renvoie true s'il existait, false sinon
async function supprimer(id) {
  throw aEcrire('supprimer', 'depot/producteurs.js');
}

// Les produits de ce producteur : la table produits, filtrée sur la colonne producteur_id
async function listerProduits(id) {
  throw aEcrire('listerProduits', 'depot/producteurs.js');
}

module.exports = { trouverTous, trouverParId, creer, remplacer, supprimer, listerProduits };
