// controllers/commande.controller.js : exercice 4, passer une commande.
// Les règles métier GreenCart sont ici, communes à MongoDB et MySQL.
// Le dépôt (depot/commandes.js) ne fait qu'enregistrer.
const depotProduits = require('../depot/produits');
const depotCommandes = require('../depot/commandes');

// La règle de calcul de l'atelier 1, avec les mêmes noms :
// - totalHT : somme des prix HT x quantité, sans arrondi intermédiaire
// - totalTTC : arrondirAuCentime(totalHT x 1,055)
// - livraison : 4,90 € si totalTTC < 40, sinon 0
// - montant à payer : arrondirAuCentime(totalTTC + livraison)
const TVA = 0.055; // 5,5 % sur l'alimentaire
const FRAIS_LIVRAISON = 4.9;
const SEUIL_LIVRAISON_OFFERTE = 40; // en euros TTC

// Arrondit un montant au centime : 17.8295 donne 17.83
function arrondirAuCentime(montant) {
  return Math.round(montant * 100) / 100;
}

// Prix TTC à partir d'un prix HT, arrondi au centime
function prixTTC(prixHT) {
  return arrondirAuCentime(prixHT * (1 + TVA));
}

// 4,90 € de livraison, offerte à partir de 40 € TTC
function fraisLivraison(totalTTC) {
  // Panier vide : rien à livrer, donc pas de frais.
  if (totalTTC === 0) {
    return 0;
  }
  if (totalTTC >= SEUIL_LIVRAISON_OFFERTE) {
    return 0;
  }
  return FRAIS_LIVRAISON;
}

// POST /api/commandes (le corps a déjà été contrôlé par validerCommande)
const passerCommande = async (req, res, next) => {
  try {
    const client = req.body.client.trim();
    const lignes = req.body.lignes;

    // 1. Vérifier TOUTES les lignes avant de toucher au stock
    const lignesCompletes = [];
    let totalHT = 0;
    for (let i = 0; i < lignes.length; i++) {
      const produit = await depotProduits.trouverParId(lignes[i].produitId);
      if (!produit) {
        return res.status(404).json({ message: `Produit introuvable : ${lignes[i].produitId}` });
      }
      if (lignes[i].quantite > produit.stock) {
        return res.status(409).json({
          message: `Stock insuffisant pour ${produit.nom} : ${produit.stock} disponible(s), ${lignes[i].quantite} demandé(s)`
        });
      }
      // On garde le prix du jour dans la ligne : si le prix change demain, la commande reste juste.
      lignesCompletes.push({ produitId: produit.id, quantite: lignes[i].quantite, prixUnitaireHT: produit.prix });
      // Pas d'arrondi ici : on additionne les prix HT tels quels.
      totalHT = totalHT + produit.prix * lignes[i].quantite;
    }

    // 2. Les montants, avec la règle de l'atelier 1
    const totalTTC = prixTTC(totalHT);
    const livraison = fraisLivraison(totalTTC);
    const montantAPayer = arrondirAuCentime(totalTTC + livraison);

    // 3. Enregistrer : le dépôt retire le stock et crée la commande.
    // totalHT est arrondi seulement pour l'affichage, une fois le TTC calculé.
    const commande = await depotCommandes.creer({
      client: client,
      lignes: lignesCompletes,
      totalHT: arrondirAuCentime(totalHT),
      totalTTC: totalTTC,
      fraisLivraison: livraison,
      montantAPayer: montantAPayer
    });

    res.status(201).json(commande);
  } catch (err) {
    next(err); // un stock devenu insuffisant entre-temps arrive ici avec un code 409
  }
};

// GET /api/commandes/:id
const afficherCommande = async (req, res, next) => {
  try {
    const commande = await depotCommandes.trouverParId(req.params.id);

    if (!commande) {
      return res.status(404).json({ message: 'Commande introuvable' });
    }
    res.json(commande);
  } catch (err) {
    next(err);
  }
};

module.exports = { passerCommande, afficherCommande };
