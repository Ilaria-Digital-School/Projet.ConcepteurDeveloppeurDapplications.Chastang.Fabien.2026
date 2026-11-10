// Exercice 2 : le panier et la livraison (indispensable). CORRIGÉ
//
// À retenir : le panier des tests (2 kg de pommes, 3 pots de miel
// d'acacia) tombe juste sous le seuil de 40 €. Arrondir le TTC de chaque
// produit avant d'additionner donne 40.00 et offre la livraison à tort.
// L'ordre des calculs change le prix payé.

const { prixTTC, arrondirAuCentime } = require('./exercice-1-prix');

const FRAIS_LIVRAISON = 4.9;
const SEUIL_LIVRAISON_OFFERTE = 40;

// Calcule le total TTC du panier, arrondi au centime.
// À retenir : le schéma « accumulateur » vu en cours (slide 92,
// exercice 14, moyenne avec une boucle). Pièges fréquents : le total
// déclaré avec const, ou dans la boucle, ou i <= panier.length.
function totalPanierTTC(panier) {
  let totalHT = 0;
  for (let i = 0; i < panier.length; i++) {
    const ligne = panier[i];
    totalHT = totalHT + ligne.prix * ligne.quantite;
  }
  // La TVA une seule fois, sur le total. prixTTC arrondit déjà au centime.
  return prixTTC(totalHT);
}

// Renvoie les frais de livraison pour un total TTC donné.
// À retenir : le cas limite est 40 pile. « À partir de 40 € » veut
// dire >= 40. Avec >, un panier de 40 € paierait la livraison.
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

// Renvoie ce que le client paie, arrondi au centime.
// À retenir : 39.98 + 4.9 vaut 44.879999... en JavaScript. D'où
// l'arrondi final : chaque montant affiché s'arrondit au centime.
function montantAPayer(panier) {
  const total = totalPanierTTC(panier);
  return arrondirAuCentime(total + fraisLivraison(total));
}

module.exports = { FRAIS_LIVRAISON, SEUIL_LIVRAISON_OFFERTE, totalPanierTTC, fraisLivraison, montantAPayer };

if (require.main === module) {
  const panier = [
    { nom: 'Pommes Reinette', prix: 3.2, quantite: 2 },
    { nom: "Miel d'acacia", prix: 10.5, quantite: 3 },
  ];
  console.log(totalPanierTTC(panier)); // 39.98
  console.log(fraisLivraison(39.98)); // 4.9
  console.log(montantAPayer(panier)); // 44.88
}
