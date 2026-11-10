// Exercice 1 : le prix TTC (indispensable). CORRIGÉ
//
// À retenir : deux fonctions de quelques lignes. L'essentiel : 5,5 %
// s'écrit 0.055, et l'arrondi est un vrai arrondi (Math.round), pas une
// troncature (Math.floor, qui donnerait 3.37 pour 3.376).

const TVA = 0.055; // 5,5 %

// Arrondit un montant au centime le plus proche.
// À retenir : on passe en centimes (x 100), on arrondit à l'entier,
// on revient en euros (/ 100).
// Number(montant.toFixed(2)) marche aussi. montant.toFixed(2) seul ne suffit
// pas : il renvoie du texte, et l'addition de l'exercice 2 collerait les textes.
function arrondirAuCentime(montant) {
  return Math.round(montant * 100) / 100;
}

// Calcule le prix TTC à partir du prix HT, arrondi au centime.
// À retenir : prixHT + prixHT * TVA est juste aussi.
// prixTTC réutilise arrondirAuCentime au lieu de refaire l'arrondi.
function prixTTC(prixHT) {
  const prix = prixHT * (1 + TVA);
  return arrondirAuCentime(prix);
}

module.exports = { TVA, arrondirAuCentime, prixTTC };

if (require.main === module) {
  console.log(arrondirAuCentime(3.376)); // 3.38
  console.log(prixTTC(10)); // 10.55
  console.log(prixTTC(3.2)); // 3.38
}
