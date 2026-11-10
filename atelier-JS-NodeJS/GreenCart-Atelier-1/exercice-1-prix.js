// Exercice 1 : le prix TTC (indispensable)
//
// Les prix du catalogue GreenCart sont stockés HT (hors taxes).
// Le client paie le prix TTC : le prix HT plus 5,5 % de TVA.
// Tous les montants sont arrondis au centime.

const TVA = 0.055; // 5,5 %

// Arrondit un montant au centime le plus proche.
// arrondirAuCentime(3.376) renvoie 3.38
// arrondirAuCentime(2.531) renvoie 2.53
function arrondirAuCentime(montant) {
  // À compléter : remplacez la ligne ci-dessous par votre code.
  return Math.round(100 * montant) / 100;
}

// Calcule le prix TTC à partir du prix HT, arrondi au centime.
// prixTTC(10) renvoie 10.55
// prixTTC(3.2) renvoie 3.38
function prixTTC(prixHT) {
  // À compléter : utilisez TVA et arrondirAuCentime.
  return arrondirAuCentime((1 + TVA) * prixHT);
}

// Ces lignes rendent vos fonctions utilisables depuis d'autres fichiers.
// Ne les supprimez pas.
module.exports = { TVA, arrondirAuCentime, prixTTC };

// Vos essais : ce bloc ne s'exécute que si vous lancez  node exercice-1-prix.js
if (require.main === module) {
  console.log(arrondirAuCentime(3.376)); // doit afficher 3.38
  console.log(prixTTC(10)); // doit afficher 10.55
  console.log(prixTTC(3.2)); // doit afficher 3.38
}
