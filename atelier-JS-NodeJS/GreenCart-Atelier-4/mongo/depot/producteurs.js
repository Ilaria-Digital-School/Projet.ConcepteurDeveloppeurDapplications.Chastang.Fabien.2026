// depot/producteurs.js : les producteurs, version MongoDB (exercice 3).
// Mêmes fonctions que depot/produits.js, avec le modèle Producteur, plus listerProduits.
const mongoose = require('mongoose');
const Producteur = require('../models/producteur.model');
const Produit = require('../models/produit.model');
const aEcrire = require('./a-ecrire');

function idValide(id) {
  return mongoose.isValidObjectId(id);
}

// Tous les producteurs
async function trouverTous() {
  throw aEcrire('trouverTous', 'depot/producteurs.js');
}

// Le producteur qui a cet id, ou null
async function trouverParId(id) {
  throw aEcrire('trouverParId', 'depot/producteurs.js');
}

// Crée le producteur { nom, ville } et le renvoie
async function creer(donnees) {
  throw aEcrire('creer', 'depot/producteurs.js');
}

// Remplace nom et ville. Renvoie le producteur modifié, ou null
async function remplacer(id, donnees) {
  throw aEcrire('remplacer', 'depot/producteurs.js');
}

// Supprime le producteur. Renvoie true s'il existait, false sinon
async function supprimer(id) {
  throw aEcrire('supprimer', 'depot/producteurs.js');
}

// Les produits de ce producteur : ceux dont le champ producteurId vaut id
async function listerProduits(id) {
  throw aEcrire('listerProduits', 'depot/producteurs.js');
}

module.exports = { trouverTous, trouverParId, creer, remplacer, supprimer, listerProduits };
