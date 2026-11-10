// GreenCart, atelier 2 : la page. CORRIGÉ.
//
// catalogue.js est chargé avant ce fichier : CATALOGUE contient les 12 produits.
// logique.js aussi : libellePrix, filtrerParCategorie, ajouterAuPanier...
// sont donc utilisables ici directement.
//
// Règle suivie partout : app.js s'occupe de la page (DOM, clics, localStorage),
// logique.js fait les calculs. Aucun calcul de prix n'est refait ici.

// ------------------------------------------------------------------
// Les éléments de la page (slides 64 à 68)
// ------------------------------------------------------------------
const listeCatalogue = document.getElementById("catalogue");
const choixCategorie = document.getElementById("choix-categorie");
const zoneMessage = document.getElementById("message");
const compteurPanier = document.getElementById("compteur-panier");
const lignesPanier = document.getElementById("lignes-panier");
// querySelector marche aussi : même résultat, avec un sélecteur CSS
const zoneSousTotal = document.querySelector("#sous-total");
const zoneLivraison = document.querySelector("#livraison");
const zoneTotal = document.querySelector("#total");
const boutonVider = document.getElementById("vider-panier");

// La clé sous laquelle le panier est rangé dans localStorage
const CLE_PANIER = "greencart-panier";

// Les données de la page
let catalogue = CATALOGUE;
// Exercice 4 : au chargement, on relit le panier enregistré (slide 75).
// getItem renvoie null la première fois : panierDepuisTexte renvoie alors [].
let panier = panierDepuisTexte(localStorage.getItem(CLE_PANIER));

// ------------------------------------------------------------------
// Exercice 1 : afficher le catalogue (slides 63, 70)
// Exercice 3 : le clic sur « Ajouter au panier » (slides 78 à 84)
// Exercice 4 : griser les produits épuisés (slide 71)
// ------------------------------------------------------------------
function afficherCatalogue(produits) {
  // On vide la liste avant de la remplir, sinon les produits s'empilent
  // à chaque changement de catégorie.
  listeCatalogue.innerHTML = "";

  for (let i = 0; i < produits.length; i++) {
    // const dans la boucle : chaque bouton garde SON produit.
    const produit = produits[i];

    const carte = document.createElement("li");
    carte.className = "carte";

    let html = "<h3>" + produit.nom + "</h3>";
    html = html + "<p class=\"prix\">" + libellePrix(produit) + "</p>";
    if (produit.bio) {
      html = html + "<p class=\"bio\">Bio</p>";
    }
    html = html + "<button type=\"button\">Ajouter au panier</button>";
    carte.innerHTML = html;

    // On cherche le bouton DANS la carte, pas dans toute la page.
    const bouton = carte.querySelector("button");

    if (estEpuise(produit)) {
      carte.style.opacity = "0.6";
      bouton.disabled = true;
      bouton.textContent = "Épuisé";
    }

    bouton.addEventListener("click", function () {
      ajouter(produit);
    });

    listeCatalogue.appendChild(carte);
  }
}

// ------------------------------------------------------------------
// Exercice 3 : ajouter un produit, puis réafficher le panier
// ------------------------------------------------------------------
function ajouter(produit) {
  const avant = nombreArticles(panier);
  panier = ajouterAuPanier(panier, produit);

  // Si rien n'a changé, c'est que le stock est atteint : on le dit.
  if (nombreArticles(panier) === avant) {
    zoneMessage.textContent = "Stock atteint pour " + produit.nom + " : " + produit.stock + " au plus.";
  } else {
    zoneMessage.textContent = "";
  }

  enregistrerPanier();
  afficherPanier();
}

// ------------------------------------------------------------------
// Exercice 3 : les lignes et le compteur
// Exercice 4 : les totaux
// ------------------------------------------------------------------
function afficherPanier() {
  lignesPanier.innerHTML = "";

  if (panier.length === 0) {
    lignesPanier.innerHTML = "<li class=\"vide\">Votre panier est vide.</li>";
  }

  for (let i = 0; i < panier.length; i++) {
    const produit = trouverParId(catalogue, panier[i].produitId);
    if (produit !== null) {
      const ligne = document.createElement("li");
      // textContent : on écrit du texte, pas du HTML.
      ligne.textContent = produit.nom + " x " + panier[i].quantite;
      lignesPanier.appendChild(ligne);
    }
  }

  const nombre = nombreArticles(panier);
  if (nombre > 1) {
    compteurPanier.textContent = nombre + " articles";
  } else {
    compteurPanier.textContent = nombre + " article";
  }

  // Exercice 4 : les montants viennent tous des fonctions fournies.
  // Panier vide : pas de commande, donc rien à payer. On laisse 0,00 €.
  if (panier.length === 0) {
    zoneSousTotal.textContent = formaterEuros(0);
    zoneLivraison.textContent = formaterEuros(0);
    zoneTotal.textContent = formaterEuros(0);
    return;
  }
  const totalTTC = totalPanierTTC(panier, catalogue);
  zoneSousTotal.textContent = formaterEuros(totalTTC);
  zoneLivraison.textContent = formaterEuros(fraisLivraison(totalTTC));
  zoneTotal.textContent = formaterEuros(montantAPayer(panier, catalogue));
}

// ------------------------------------------------------------------
// Exercice 4 : localStorage (slides 75 et 76)
// ------------------------------------------------------------------
function enregistrerPanier() {
  // localStorage ne garde que du texte, d'où panierEnTexte.
  localStorage.setItem(CLE_PANIER, panierEnTexte(panier));
}

boutonVider.addEventListener("click", function () {
  panier = [];
  localStorage.removeItem(CLE_PANIER);
  zoneMessage.textContent = "";
  afficherPanier();
});

// ------------------------------------------------------------------
// Exercice 2 : filtrer par catégorie (slides 72 et 82)
// ------------------------------------------------------------------
// "change" : la valeur de la liste vient de changer.
choixCategorie.addEventListener("change", function () {
  afficherCatalogue(filtrerParCategorie(catalogue, choixCategorie.value));
});

// ------------------------------------------------------------------
// Exercice 5 (bonus) : charger le catalogue avec fetch
// ------------------------------------------------------------------
// fetch prend du temps : async et await attendent la réponse sans bloquer
// la page. Sans serveur (fichier ouvert directement), fetch échoue :
// on l'explique et on garde le catalogue de catalogue.js.
async function chargerCatalogue() {
  // Page ouverte directement (adresse file://) : fetch ne peut pas marcher.
  // On ne tente même pas, pour ne pas remplir la console d'erreurs.
  if (location.protocol === "file:") {
    zoneMessage.textContent = "Page ouverte sans serveur : le catalogue intégré est affiché.";
    afficherCatalogue(filtrerParCategorie(catalogue, choixCategorie.value));
    afficherPanier();
    return;
  }
  try {
    const reponse = await fetch("produits.json");
    if (!reponse.ok) {
      // 404 par exemple : le fichier n'existe pas sur le serveur.
      throw new Error("Réponse " + reponse.status);
    }
    catalogue = await reponse.json();
  } catch (erreur) {
    catalogue = CATALOGUE;
    zoneMessage.textContent = "Le fichier produits.json n'a pas pu être chargé. " +
      "La page est-elle ouverte sans serveur local ? Le catalogue intégré est affiché.";
  }
  afficherCatalogue(filtrerParCategorie(catalogue, choixCategorie.value));
  afficherPanier();
}

// ------------------------------------------------------------------
// Au chargement de la page
// ------------------------------------------------------------------
// Sans le bonus, on écrirait simplement :
//   afficherCatalogue(catalogue)
//   afficherPanier()
chargerCatalogue();
