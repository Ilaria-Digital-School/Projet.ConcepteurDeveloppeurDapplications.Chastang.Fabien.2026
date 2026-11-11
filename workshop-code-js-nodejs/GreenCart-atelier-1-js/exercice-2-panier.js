// Exercice 2 : le panier et la livraison (indispensable)
//
// Un panier est un tableau de lignes. Chaque ligne est un objet :
//   { nom: 'Carottes', prix: 1.8, quantite: 2 }
// Le prix est HT, pour une unité.
//
// La livraison coûte 4,90 €. Elle est offerte à partir de 40 € TTC.

// Cette ligne importe les fonctions de l'exercice 1.
// Vous écrirez vous-même ce genre de ligne à l'exercice 4.
const { prixTTC, arrondirAuCentime } = require('./exercice-1-prix');

const FRAIS_LIVRAISON = 4.9;
const SEUIL_LIVRAISON_OFFERTE = 40;

// Calcule le total TTC du panier, arrondi au centime.
// Calculez d'abord le total HT de toutes les lignes (prix x quantité),
// puis appliquez la TVA une seule fois, à la fin.
// Un panier vide coûte 0.
function totalPanierTTC(panier) {
  // À compléter : une boucle for sur le panier.
  return prixTTC(panier.reduce((total, article) => total + article.prix * article.quantite, 0));
}

// Renvoie les frais de livraison pour un total TTC donné.
// fraisLivraison(39.99) renvoie 4.9
// fraisLivraison(40) renvoie 0
// fraisLivraison(0) renvoie 0 : un panier vide ne se livre pas
function fraisLivraison(totalTTC) {
  // À compléter : une condition if.
  return totalTTC === 0 || totalTTC >= SEUIL_LIVRAISON_OFFERTE ? 0 : FRAIS_LIVRAISON;
}

// Renvoie ce que le client paie : total TTC du panier plus livraison,
// arrondi au centime.
function montantAPayer(panier) {
  // À compléter : utilisez totalPanierTTC et fraisLivraison.
  const totalTTC = totalPanierTTC(panier);
  return arrondirAuCentime(totalTTC + fraisLivraison(totalTTC));
}

module.exports = { FRAIS_LIVRAISON, SEUIL_LIVRAISON_OFFERTE, totalPanierTTC, fraisLivraison, montantAPayer };

// Vos essais : lancez  node exercice-2-panier.js
if (require.main === module) {
  const panier = [
    { nom: 'Pommes Reinette', prix: 3.2, quantite: 2 },
    { nom: "Miel d'acacia", prix: 10.5, quantite: 3 },
  ];
  console.log(totalPanierTTC(panier)); // doit afficher 39.98
  console.log(fraisLivraison(39.98)); // doit afficher 4.9
  console.log(montantAPayer(panier)); // doit afficher 44.88
}
