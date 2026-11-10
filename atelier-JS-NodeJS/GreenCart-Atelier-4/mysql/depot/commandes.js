// depot/commandes.js : les commandes, version MySQL (exercice 4).
// Tables : commandes (client, statut, total_ht, total_ttc, frais_livraison, montant_a_payer)
// et lignes_commande (commande_id, produit_id, quantite, prix_unitaire_ht).
const { pool } = require('../config/db');
const aEcrire = require('./a-ecrire');

// Reçoit { client, lignes, totalHT, totalTTC, fraisLivraison, montantAPayer },
// chaque ligne étant { produitId, quantite, prixUnitaireHT }.
// 1. Pour chaque ligne, retirer la quantité du stock (UPDATE produits ...).
// 2. Insérer la commande (INSERT INTO commandes ...), récupérer son insertId.
// 3. Insérer chaque ligne (INSERT INTO lignes_commande ...).
// 4. Renvoyer la commande complète, par exemple avec trouverParId(id).
// Pour aller plus loin : faire tout cela dans une transaction (voir l'énoncé).
async function creer(commande) {
  throw aEcrire('creer', 'depot/commandes.js');
}

// La commande qui a cet id, avec ses lignes, ou null.
// Renvoie { id, client, statut, totalHT, totalTTC, fraisLivraison, montantAPayer, lignes: [...] }
// Indice : deux SELECT, un sur commandes et un sur lignes_commande, avec des AS pour les noms.
async function trouverParId(id) {
  throw aEcrire('trouverParId', 'depot/commandes.js');
}

module.exports = { creer, trouverParId };
