// GreenCart, atelier 2 : la page. À compléter.
//
// catalogue.js est chargé avant ce fichier : CATALOGUE contient les 12 produits.
// logique.js aussi : vous pouvez appeler ici libellePrix, filtrerParCategorie,
// ajouterAuPanier, nombreArticles, estEpuise, panierEnTexte, panierDepuisTexte,
// et les fonctions fournies (trouverParId, totalPanierTTC, fraisLivraison,
// montantAPayer, formaterEuros).
//
// Règle : app.js s'occupe de la page (DOM, clics, localStorage).
// Les calculs restent dans logique.js.

// ------------------------------------------------------------------
// Les éléments de la page
// ------------------------------------------------------------------
// Exercice 1 : récupérez la liste <ul id="catalogue">
// const listeCatalogue = ...

// Exercice 2 : récupérez la liste déroulante <select id="choix-categorie">

// Exercice 3 : récupérez <ul id="lignes-panier"> et <p id="compteur-panier">

// Exercice 4 : récupérez #sous-total, #livraison, #total et #vider-panier

// Déjà récupéré pour vous : la zone de message
const zoneMessage = document.getElementById("message");

// La clé sous laquelle le panier est rangé dans localStorage
const CLE_PANIER = "greencart-panier";

// Les données de la page
let catalogue = CATALOGUE;
// Exercice 4 : remplacez [] par le panier relu dans localStorage
let panier = [];

// ------------------------------------------------------------------
// Exercice 1 : afficher les produits reçus dans la liste #catalogue
// ------------------------------------------------------------------
function afficherCatalogue(produits) {
  // 1. Videz la liste (sinon les produits s'empilent à chaque filtre).
  // 2. Pour chaque produit (boucle for) :
  //    - créez un <li> avec document.createElement, de classe "carte"
  //    - remplissez-le avec innerHTML en suivant le modèle de index.html
  //      (le prix vient de libellePrix)
  //    - ajoutez-le à la liste avec appendChild
  //
  // Exercice 3 : récupérez le bouton de la carte avec carte.querySelector("button")
  //   et branchez son clic avec addEventListener pour appeler ajouter(produit).
  //
  // Exercice 4 : si estEpuise(produit), grisez la carte avec style,
  //   désactivez le bouton (disabled) et écrivez "Épuisé" dessus.
}

// ------------------------------------------------------------------
// Exercice 3 : ajouter un produit au panier
// ------------------------------------------------------------------
function ajouter(produit) {
  // 1. panier = ajouterAuPanier(panier, produit)
  // 2. Exercice 4 : enregistrez le panier dans localStorage
  // 3. afficherPanier()
}

// ------------------------------------------------------------------
// Exercice 3 : afficher les lignes du panier et le nombre d'articles
// Exercice 4 : afficher les totaux
// ------------------------------------------------------------------
function afficherPanier() {
  // 1. Videz #lignes-panier.
  // 2. Pour chaque ligne du panier : retrouvez le produit avec
  //    trouverParId(catalogue, ligne.produitId), puis ajoutez un <li>
  //    du type "Pommes Reinette x 2".
  // 3. Écrivez le nombre d'articles dans #compteur-panier.
  // 4. Exercice 4 : total TTC, livraison et montant à payer, écrits avec
  //    formaterEuros. Panier vide : laissez 0,00 € partout.
}

// ------------------------------------------------------------------
// Exercice 2 : le filtre par catégorie
// ------------------------------------------------------------------
// Écoutez l'événement "change" de la liste déroulante.
// Sa valeur (.value) vaut "toutes", "fruits", "legumes"...
// Réaffichez le catalogue avec filtrerParCategorie.

// ------------------------------------------------------------------
// Exercice 4 : le bouton « Vider le panier »
// ------------------------------------------------------------------
// Au clic : panier vide, removeItem dans localStorage, afficherPanier().

// ------------------------------------------------------------------
// Au chargement de la page
// ------------------------------------------------------------------
afficherCatalogue(catalogue);
afficherPanier();

// ------------------------------------------------------------------
// Exercice 5 (bonus) : charger le catalogue avec fetch
// ------------------------------------------------------------------
// fetch ne marche qu'avec un serveur local : node serveur-local.js, puis http://127.0.0.1:8642.
// Décommentez ce squelette, complétez les trois « À FAIRE », puis
// supprimez les deux lignes « Au chargement de la page » ci-dessus :
// chargerCatalogue() les remplace.
//
// async function chargerCatalogue() {
//   try {
//     // await attend la réponse du serveur
//     const reponse = await fetch("produits.json");
//     if (!reponse.ok) {
//       // le serveur a répondu, mais sans le fichier (404 par exemple)
//       throw new Error("Réponse " + reponse.status);
//     }
//     // À FAIRE : lisez le JSON de la réponse (await reponse.json())
//     //           et rangez-le dans la variable catalogue
//   } catch (erreur) {
//     // À FAIRE : écrivez un message clair dans zoneMessage
//     //           et reprenez catalogue = CATALOGUE
//   }
//   // À FAIRE : affichez le catalogue et le panier
// }
//
// chargerCatalogue();
