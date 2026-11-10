// Exercice 5 : bonus, map, filter et les erreurs
//
// Partie A : filter et map. Ces deux méthodes ne sont pas dans le cours.
// Le rappel est dans l'énoncé (le PDF). Ici, pas de boucle for : c'est le but.
//
// Partie B : throw et try / catch, pour refuser une quantité invalide.

// Partie A

// Renvoie les produits bio du catalogue, avec filter.
function produitsBio(catalogue) {
  // À compléter
  return undefined;
}

// Renvoie un tableau avec seulement les noms des produits, avec map.
// nomsDesProduits([carottes, radis]) renvoie ['Carottes', 'Radis']
function nomsDesProduits(produits) {
  // À compléter
  return undefined;
}

// Partie B

// Ajoute une ligne { nom, prix, quantite } au panier, puis renvoie le panier.
// Avant d'ajouter, vérifie la quantité. Si elle est invalide, lève une erreur
// avec throw new Error('un message clair'), sans rien ajouter :
//   - la quantité n'est pas un nombre entier (2.5)
//   - la quantité est inférieure à 1 (0, -1)
//   - le produit est épuisé (stock à 0)
//   - la quantité dépasse le stock
// Une quantité égale au stock est acceptée. Le stock du produit ne change pas.
function ajouterAuPanier(panier, produit, quantite) {
  // À compléter
  return undefined;
}

// Essaie d'ajouter au panier, sans jamais planter.
// Si l'ajout marche, renvoie par exemple : '2 x Radis ajouté au panier'
// Sinon, renvoie 'Impossible : ' suivi du message de l'erreur.
function essayerAjout(panier, produit, quantite) {
  // À compléter : try / catch autour de ajouterAuPanier
  return undefined;
}

module.exports = { produitsBio, nomsDesProduits, ajouterAuPanier, essayerAjout };

// Vos essais : lancez  node exercice-5-bonus.js
if (require.main === module) {
  const catalogue = require('./donnees/produits.json');
  console.log(nomsDesProduits(produitsBio(catalogue))); // 7 noms
  const radis = catalogue[6]; // stock : 3
  const panier = [];
  console.log(essayerAjout(panier, radis, 2)); // 2 x Radis ajouté au panier
  console.log(essayerAjout(panier, radis, 4)); // Impossible : ...
  console.log(essayerAjout(panier, radis, 0)); // Impossible : ...
  console.log(panier); // une seule ligne
}
