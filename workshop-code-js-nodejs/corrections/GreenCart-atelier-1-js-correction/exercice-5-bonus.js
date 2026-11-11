// Exercice 5 : bonus, map, filter et les erreurs. CORRIGÉ
//
// À retenir : map et filter ne sont pas dans le cours. Le rappel est dans
// l'énoncé. Une fonction fléchée (produit => produit.bio) marche aussi, la
// forme function ci-dessous est celle du cours.

// Partie A

function produitsBio(catalogue) {
  return catalogue.filter(function (produit) {
    return produit.bio === true;
  });
}

// À retenir : sans le return dans la fonction passée à map, on obtient
// un tableau de undefined.
function nomsDesProduits(produits) {
  return produits.map(function (produit) {
    return produit.nom;
  });
}

// Partie B

// À retenir : l'ordre des tests compte. On vérifie d'abord que la
// quantité est un entier, puis qu'elle vaut au moins 1, puis le stock.
// parseInt(quantite) !== quantite marche aussi à la place de Number.isInteger.
// Le push vient après toutes les vérifications : sinon la ligne serait
// ajoutée même quand on refuse.
function ajouterAuPanier(panier, produit, quantite) {
  if (!Number.isInteger(quantite)) {
    throw new Error('la quantité doit être un nombre entier');
  }
  if (quantite < 1) {
    throw new Error('la quantité doit être au moins 1');
  }
  if (produit.stock === 0) {
    throw new Error(produit.nom + ' est épuisé');
  }
  if (quantite > produit.stock) {
    throw new Error('stock insuffisant, il en reste ' + produit.stock);
  }
  panier.push({ nom: produit.nom, prix: produit.prix, quantite: quantite });
  return panier;
}

// À retenir : try / catch « attrape » l'erreur levée par throw.
// Le message de l'erreur est dans erreur.message. 'Impossible : ' + erreur
// donnerait « Impossible : Error: ... », avec le mot Error en trop.
function essayerAjout(panier, produit, quantite) {
  try {
    ajouterAuPanier(panier, produit, quantite);
    return quantite + ' x ' + produit.nom + ' ajouté au panier';
  } catch (erreur) {
    return 'Impossible : ' + erreur.message;
  }
}

module.exports = { produitsBio, nomsDesProduits, ajouterAuPanier, essayerAjout };

if (require.main === module) {
  const catalogue = require('./donnees/produits.json');
  console.log(nomsDesProduits(produitsBio(catalogue)));
  const radis = catalogue[6];
  const panier = [];
  console.log(essayerAjout(panier, radis, 2));
  console.log(essayerAjout(panier, radis, 4));
  console.log(essayerAjout(panier, radis, 0));
  console.log(panier);
}
