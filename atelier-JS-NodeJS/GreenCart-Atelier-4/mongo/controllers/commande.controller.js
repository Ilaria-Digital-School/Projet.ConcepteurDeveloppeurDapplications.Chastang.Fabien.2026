// controllers/commande.controller.js : exercice 4, passer une commande.
// Les règles métier GreenCart s'écrivent ici. Elles sont les mêmes pour MongoDB et MySQL.
// Le dépôt (depot/commandes.js) ne fait qu'enregistrer.
const depotProduits = require('../depot/produits');
const depotCommandes = require('../depot/commandes');

const TVA = 0.055; // 5,5 % sur l'alimentaire
const FRAIS_LIVRAISON = 4.9;
const SEUIL_LIVRAISON_OFFERTE = 40; // en euros TTC

// Fournie, comme à l'atelier 1 : arrondit un montant au centime, 17.8295 donne 17.83
function arrondirAuCentime(montant) {
  return Math.round(montant * 100) / 100;
}

// Reprenez ici prixTTC(prixHT) et fraisLivraison(totalTTC), tels que vous les avez écrits à l'atelier 1.

// POST /api/commandes
// Corps attendu : { "client": "Léa", "lignes": [ { "produitId": ..., "quantite": 2 } ] }
const passerCommande = async (req, res, next) => {
  try {
    // À écrire, étape par étape (voir l'énoncé, exercice 4) :
    //
    // 0. Contrôler le corps : client rempli, au moins une ligne, chaque quantité entière et au moins 1.
    //    Sinon : 400 avec un message clair.
    //
    // 1. Pour CHAQUE ligne, AVANT de toucher au stock :
    //    - retrouver le produit avec depotProduits.trouverParId(...)   -> 404 s'il n'existe pas
    //    - comparer la quantité au stock                               -> 409 si le stock ne suffit pas
    //    - préparer la ligne { produitId, quantite, prixUnitaireHT } et ajouter prix x quantité au total HT,
    //      sans arrondir
    //
    // 2. Les montants, avec la règle de l'atelier 1 :
    //      const totalTTC = prixTTC(totalHT);
    //      const livraison = fraisLivraison(totalTTC);
    //      const montantAPayer = arrondirAuCentime(totalTTC + livraison);
    //    La variable s'appelle livraison : fraisLivraison est déjà le nom de la fonction.
    //
    // 3. Enregistrer avec depotCommandes.creer({ client, lignes, totalHT, totalTTC, fraisLivraison: livraison, montantAPayer }),
    //    où lignes sont les lignes préparées à l'étape 1, puis répondre 201 avec la commande renvoyée.

    res.status(501).json({ message: 'À écrire : passerCommande dans controllers/commande.controller.js' });
  } catch (err) {
    next(err);
  }
};

// GET /api/commandes/:id
const afficherCommande = async (req, res, next) => {
  try {
    // À écrire : comme afficherProduit dans produit.controller.js, avec depotCommandes.trouverParId(...)
    res.status(501).json({ message: 'À écrire : afficherCommande dans controllers/commande.controller.js' });
  } catch (err) {
    next(err);
  }
};

module.exports = { passerCommande, afficherCommande };
