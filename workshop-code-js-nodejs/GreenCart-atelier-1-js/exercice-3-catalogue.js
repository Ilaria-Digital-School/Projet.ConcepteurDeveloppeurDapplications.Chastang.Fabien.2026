// Exercice 3 : le catalogue (souhaitable)
//
// Le catalogue est un tableau d'objets produits, lu dans donnees/produits.json.
// Un produit ressemble à :
//   { id: 4, nom: 'Carottes', categorie: 'legumes', prix: 1.8,
//     unite: 'kg', stock: 60, bio: true, producteurId: 1 }
//
// Écrivez ces fonctions avec une boucle for, comme dans le cours.

// Renvoie l'élément de la liste qui a cet id, ou null s'il n'existe pas.
// Marche pour les produits comme pour les producteurs.
function trouverParId(liste, id) {
  // À compléter
  return undefined;
}

// Renvoie un nouveau tableau avec les produits dont le nom contient le texte.
// Les majuscules ne comptent pas : "pomme" trouve "Pommes Reinette".
// Si rien ne correspond, renvoie un tableau vide.
function rechercherParNom(catalogue, texte) {
  // À compléter : toLowerCase et indexOf
  return undefined;
}

// Renvoie un nouveau tableau avec les produits dont le stock est supérieur à 0.
// Le catalogue reçu ne doit pas être modifié.
function produitsDisponibles(catalogue) {
  // À compléter : un tableau vide, puis push
  return undefined;
}

module.exports = { trouverParId, rechercherParNom, produitsDisponibles };

// Vos essais : lancez  node exercice-3-catalogue.js
if (require.main === module) {
  const catalogue = require('./donnees/produits.json');
  const producteurs = require('./donnees/producteurs.json');
  console.log(trouverParId(catalogue, 9)); // la Tomme de chèvre
  console.log(trouverParId(producteurs, 4)); // le Rucher Martin
  console.log(trouverParId(catalogue, 99)); // null
  console.log(rechercherParNom(catalogue, 'pomme')); // Pommes Reinette et Pommes de terre
  console.log(produitsDisponibles(catalogue)); // 10 produits
}
