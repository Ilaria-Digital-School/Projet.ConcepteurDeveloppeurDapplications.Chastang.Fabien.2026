// depot/commandes.js : les commandes, version MongoDB (exercice 4).
const mongoose = require('mongoose');
const Commande = require('../models/commande.model');
const Produit = require('../models/produit.model');
const aEcrire = require('./a-ecrire');

// Reçoit { client, lignes, totalHT, totalTTC, fraisLivraison, montantAPayer },
// chaque ligne étant { produitId, quantite, prixUnitaireHT }.
// 1. Pour chaque ligne, retirer la quantité du stock du produit.
// 2. Créer la commande avec Commande.create(...) et la renvoyer.
async function creer(commande) {
  throw aEcrire('creer', 'depot/commandes.js');
}

// La commande qui a cet id, ou null
async function trouverParId(id) {
  throw aEcrire('trouverParId', 'depot/commandes.js');
}

module.exports = { creer, trouverParId };
