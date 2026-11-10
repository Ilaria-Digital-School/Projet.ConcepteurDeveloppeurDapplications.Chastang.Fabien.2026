// depot/commandes.js : les commandes, version MongoDB (exercice 4).
const mongoose = require('mongoose');
const Commande = require('../models/commande.model');
const Produit = require('../models/produit.model');

// Retire le stock de chaque ligne, puis enregistre la commande.
async function creer(commande) {
  const dejaRetirees = [];
  try {
    for (let i = 0; i < commande.lignes.length; i++) {
      const ligne = commande.lignes[i];
      // Le filtre "stock >= quantite" garantit que le stock ne devient jamais négatif,
      // même si deux clients commandent au même moment.
      const produit = await Produit.findOneAndUpdate(
        { _id: ligne.produitId, stock: { $gte: ligne.quantite } },
        { $inc: { stock: -ligne.quantite } },
        { new: true }
      );
      if (!produit) {
        const err = new Error('Stock insuffisant, la commande est annulée');
        err.status = 409;
        throw err;
      }
      dejaRetirees.push(ligne);
    }
    return await Commande.create(commande);
  } catch (err) {
    // Tout ou rien : on rend le stock déjà retiré.
    // Une vraie transaction MongoDB demande un "replica set", hors du programme de l'atelier.
    for (let i = 0; i < dejaRetirees.length; i++) {
      await Produit.updateOne({ _id: dejaRetirees[i].produitId }, { $inc: { stock: dejaRetirees[i].quantite } });
    }
    throw err;
  }
}

async function trouverParId(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return Commande.findById(id);
}

module.exports = { creer, trouverParId };
