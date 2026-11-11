// depot/producteurs.js : les producteurs, version MongoDB (exercice 3).
// Mêmes noms que depot/produits.js, plus listerProduits.
const mongoose = require('mongoose');
const Producteur = require('../models/producteur.model');
const Produit = require('../models/produit.model');

function idValide(id) {
  return mongoose.isValidObjectId(id);
}

async function trouverTous() {
  return Producteur.find();
}

async function trouverParId(id) {
  if (!idValide(id)) return null;
  return Producteur.findById(id);
}

async function creer(donnees) {
  return Producteur.create({ nom: donnees.nom, ville: donnees.ville });
}

async function remplacer(id, donnees) {
  if (!idValide(id)) return null;
  return Producteur.findByIdAndUpdate(id, { nom: donnees.nom, ville: donnees.ville }, { new: true, runValidators: true });
}

async function supprimer(id) {
  if (!idValide(id)) return false;
  // Sans clé étrangère, c'est à nous d'empêcher des produits orphelins
  const nbProduits = await Produit.countDocuments({ producteurId: id });
  if (nbProduits > 0) {
    const err = new Error(`Ce producteur a encore ${nbProduits} produit(s). Supprimez-les ou changez leur producteur d'abord.`);
    err.status = 409;
    throw err;
  }
  const producteur = await Producteur.findByIdAndDelete(id);
  return producteur !== null;
}

// Les produits d'un producteur : on filtre sur le champ producteurId
async function listerProduits(id) {
  if (!idValide(id)) return [];
  return Produit.find({ producteurId: id });
}

module.exports = { trouverTous, trouverParId, creer, remplacer, supprimer, listerProduits };
