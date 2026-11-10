// GreenCart, atelier 2 : la logique, sans DOM.
//
// Vous complétez les fonctions marquées « À FAIRE ».
// Testez-les avec : node verifier.js
//
// Ce fichier sert deux fois :
// - dans la page, par <script src="logique.js"></script>
// - dans Node, par require("./logique.js"), pour le vérificateur
//
// Un panier est un tableau de lignes : [{ produitId: 1, quantite: 2 }, ...]
// C'est la même forme que les lignes d'une commande GreenCart.

// ------------------------------------------------------------------
// Fourni : la logique de l'atelier 1 (déjà écrite, à ne pas modifier)
// ------------------------------------------------------------------
//
// Mêmes noms et même règle de calcul qu'à l'atelier 1. Une seule
// différence : à l'atelier 1, vos lignes portaient le prix. Ici, elles
// renvoient au catalogue par son id. Les fonctions du panier reçoivent
// donc aussi le catalogue.

const TVA = 0.055;              // 5,5 % sur l'alimentaire
const FRAIS_LIVRAISON = 4.9;    // en euros
const SEUIL_LIVRAISON_OFFERTE = 40; // en euros TTC

// Arrondit un montant au centime : 3.376 devient 3.38
function arrondirAuCentime(montant) {
  return Math.round(montant * 100) / 100;
}

// Prix TTC à partir du prix HT, arrondi au centime
function prixTTC(prixHT) {
  return arrondirAuCentime(prixHT * (1 + TVA));
}

// Écrit un montant à la française : 3.38 devient "3,38 €"
function formaterEuros(montant) {
  return montant.toFixed(2).replace(".", ",") + " €";
}

// Cherche l'élément de la liste qui a cet id. Renvoie null s'il n'existe pas.
function trouverParId(liste, id) {
  for (let i = 0; i < liste.length; i++) {
    if (liste[i].id === id) {
      return liste[i];
    }
  }
  return null;
}

// Total TTC du panier, sans la livraison.
// On additionne les prix HT, sans arrondir, puis on applique la TVA
// une seule fois sur le total, et on arrondit au centime.
function totalPanierTTC(panier, catalogue) {
  let totalHT = 0;
  for (let i = 0; i < panier.length; i++) {
    const produit = trouverParId(catalogue, panier[i].produitId);
    if (produit !== null) {
      totalHT = totalHT + produit.prix * panier[i].quantite;
    }
  }
  return prixTTC(totalHT);
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

// Ce que le client paie : total TTC plus livraison, arrondi au centime
function montantAPayer(panier, catalogue) {
  const totalTTC = totalPanierTTC(panier, catalogue);
  return arrondirAuCentime(totalTTC + fraisLivraison(totalTTC));
}

// ------------------------------------------------------------------
// Exercice 1 : le libellé du prix d'un produit
// ------------------------------------------------------------------

// Pommes Reinette (3.2 HT, au kg) doit donner "3,38 € / kg"
function libellePrix(produit) {
  // À FAIRE : utilisez prixTTC et formaterEuros, puis ajoutez " / " et l'unité.
}

// ------------------------------------------------------------------
// Exercice 2 : filtrer le catalogue par catégorie
// ------------------------------------------------------------------

// Renvoie un NOUVEAU tableau avec les produits de la catégorie demandée.
// "toutes" renvoie tous les produits.
// Le catalogue d'origine ne doit pas changer.
function filtrerParCategorie(catalogue, categorie) {
  // À FAIRE : un tableau vide, une boucle for, un if, push.
}

// ------------------------------------------------------------------
// Exercice 3 : ajouter au panier, compter les articles
// ------------------------------------------------------------------

// Ajoute 1 exemplaire du produit et renvoie le panier mis à jour.
// - produit déjà présent : sa quantité augmente de 1
// - produit absent : une nouvelle ligne { produitId: produit.id, quantite: 1 }
// - jamais plus que le stock : un produit épuisé ne s'ajoute pas
function ajouterAuPanier(panier, produit) {
  // À FAIRE
}

// Nombre total d'articles : [{ produitId: 1, quantite: 2 }, { produitId: 4, quantite: 3 }] donne 5
function nombreArticles(panier) {
  // À FAIRE
}

// ------------------------------------------------------------------
// Exercice 4 : produit épuisé, panier en texte pour localStorage
// ------------------------------------------------------------------

// true si le produit n'a plus de stock, false sinon
function estEpuise(produit) {
  // À FAIRE
}

// Transforme le panier (un tableau) en texte JSON
function panierEnTexte(panier) {
  // À FAIRE
}

// L'inverse : du texte JSON vers le panier.
// Si le texte vaut null (rien d'enregistré) ou "", renvoyez un panier vide : []
function panierDepuisTexte(texte) {
  // À FAIRE
}

// ------------------------------------------------------------------
// Export pour Node (le vérificateur). Ignoré dans le navigateur.
// ------------------------------------------------------------------
if (typeof module !== "undefined") {
  module.exports = {
    TVA, FRAIS_LIVRAISON, SEUIL_LIVRAISON_OFFERTE,
    arrondirAuCentime, prixTTC, formaterEuros, trouverParId,
    totalPanierTTC, fraisLivraison, montantAPayer,
    libellePrix, filtrerParCategorie, ajouterAuPanier, nombreArticles,
    estEpuise, panierEnTexte, panierDepuisTexte
  };
}
