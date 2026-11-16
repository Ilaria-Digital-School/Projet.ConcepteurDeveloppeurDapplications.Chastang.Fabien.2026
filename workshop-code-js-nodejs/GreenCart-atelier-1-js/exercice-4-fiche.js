// Exercice 4 : les modules (souhaitable)
//
// Ce fichier fabrique la fiche d'un produit, en une ligne de texte.
// Il réutilise prixTTC de l'exercice 1 au lieu de refaire le calcul.

// Étape 1 : importez prixTTC depuis le fichier de l'exercice 1.
// (Regardez la ligne d'import en haut de exercice-2-panier.js.)

const { prixTTC } = require('./exercice-1-prix');

// Étape 2 : écrivez la fonction.
// Renvoie la fiche du produit, par exemple :
//   'Carottes (bio) : 1,90 € TTC / kg'
//   'Pommes de terre : 1,58 € TTC / kg'
//   'Poires Williams : 3,80 € TTC / kg (épuisé)'
// Le prix a toujours deux chiffres après la virgule, et une virgule.
// (bio) seulement si le produit est bio. (épuisé) seulement si le stock vaut 0.
function ficheProduit(produit) {
  const bio = produit.bio ? ' (bio)' : '';
  const soldOut = produit.stock ? '' : ' (épuisé)';
  return `${produit.nom}${bio} : ${prixTTC(produit.prix).toLocaleString(
    'fr-FR',
    { minimumFractionDigits: 2 }
  )} € TTC / ${produit.unite}${soldOut}`;
}

// Étape 3 : exportez ficheProduit, pour que boutique.js puisse s'en servir.

module.exports = { ficheProduit };

// Vos essais : lancez  node exercice-4-fiche.js
if (require.main === module) {
  const carottes = { id: 4, nom: 'Carottes', categorie: 'legumes', prix: 1.8, unite: 'kg', stock: 60, bio: true, producteurId: 1 };
  console.log(ficheProduit(carottes)); // Carottes (bio) : 1,90 € TTC / kg
}
