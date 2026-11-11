// GreenCart, atelier 2 : vérificateur.
// Lancez-le dans ce dossier avec : node verifier.js
//
// Il teste les fonctions de logique.js, exercice par exercice.
// La partie page web ne se teste pas ici : une liste de contrôle
// s'affiche à la fin, à cocher vous-même dans le navigateur.
//
// Vous n'avez pas à lire ni à modifier ce fichier.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DOSSIER = __dirname;
const DELAI_MAX = 2000; // millisecondes avant de déclarer une boucle infinie

// Quelques produits du catalogue GreenCart, pour les tests
const POMMES = { id: 1, nom: "Pommes Reinette", categorie: "fruits", prix: 3.2, unite: "kg", stock: 40, bio: true, producteurId: 2 };
const POIRES = { id: 2, nom: "Poires Williams", categorie: "fruits", prix: 3.6, unite: "kg", stock: 0, bio: false, producteurId: 2 };
const CAROTTES = { id: 4, nom: "Carottes", categorie: "legumes", prix: 1.8, unite: "kg", stock: 60, bio: true, producteurId: 1 };
const POIREAUX = { id: 5, nom: "Poireaux", categorie: "legumes", prix: 2.4, unite: "botte", stock: 15, bio: true, producteurId: 1 };
const RADIS = { id: 7, nom: "Radis", categorie: "legumes", prix: 1.9, unite: "botte", stock: 3, bio: true, producteurId: 1 };
const TOMME = { id: 9, nom: "Tomme de chèvre", categorie: "cremerie", prix: 22.0, unite: "kg", stock: 8, bio: false, producteurId: 3 };
const YAOURT = { id: 10, nom: "Yaourt au lait de chèvre", categorie: "cremerie", prix: 0.9, unite: "piece", stock: 0, bio: true, producteurId: 3 };

function lireCatalogue() {
  try {
    return JSON.parse(fs.readFileSync(path.join(DOSSIER, "produits.json"), "utf8"));
  } catch (e) {
    return [POMMES, POIRES, CAROTTES, POIREAUX, RADIS, TOMME, YAOURT];
  }
}
const CATALOGUE = lireCatalogue();

// ------------------------------------------------------------------
// Chargement de logique.js dans un bac à sable
// ------------------------------------------------------------------

let contexte = null;
let erreurChargement = null;

function numeroDeLigne(erreur) {
  const pile = String(erreur && erreur.stack || "");
  const trouve = pile.match(/logique\.js:(\d+)/);
  return trouve ? trouve[1] : null;
}

function charger() {
  const fichier = path.join(DOSSIER, "logique.js");
  let source;
  try {
    source = fs.readFileSync(fichier, "utf8");
  } catch (e) {
    erreurChargement = "le fichier logique.js est introuvable dans ce dossier.";
    return;
  }
  const module = { exports: {} };
  contexte = vm.createContext({ module: module, exports: module.exports, console: console, JSON: JSON });
  try {
    const script = new vm.Script(source, { filename: fichier });
    script.runInContext(contexte, { timeout: DELAI_MAX });
  } catch (e) {
    const ligne = numeroDeLigne(e);
    const ou = ligne ? " vers la ligne " + ligne : "";
    if (e && e.name === "SyntaxError") {
      erreurChargement = "logique.js contient une faute de syntaxe" + ou +
        " (accolade, parenthèse ou guillemet oublié ?).";
    } else {
      erreurChargement = "logique.js déclenche une erreur dès son chargement" + ou + " : " + expliquer(e);
    }
    contexte = null;
  }
}

// Traduit une erreur JavaScript en français simple
function expliquer(e) {
  const message = String(e && e.message || e);
  if (/Script execution timed out/i.test(message)) {
    return "le code ne s'arrête jamais. Vérifiez la condition de votre boucle.";
  }
  let m = message.match(/^(\w+) is not defined/);
  if (m) {
    return "« " + m[1] + " » n'existe pas. Faute de frappe, ou variable pas encore déclarée ?";
  }
  m = message.match(/Cannot read propert(?:y|ies) of (undefined|null)(?: \(reading '(.+)'\))?/);
  if (m) {
    const quoi = m[2] ? "« ." + m[2] + " »" : "une propriété";
    return "vous lisez " + quoi + " sur une valeur " + m[1] + ". Une variable est vide : vérifiez son nom et son contenu.";
  }
  m = message.match(/Cannot set propert(?:y|ies) of (undefined|null)/);
  if (m) {
    return "vous modifiez une propriété d'une valeur " + m[1] + ". Une variable est vide.";
  }
  m = message.match(/(\S+) is not a function/);
  if (m) {
    return "« " + m[1] + " » n'est pas une fonction. Vérifiez son nom et les parenthèses.";
  }
  if (/Assignment to constant variable/.test(message)) {
    return "vous changez la valeur d'une constante (const). Utilisez let pour une variable qui change.";
  }
  if (/is not iterable|\.length/.test(message)) {
    return "vous parcourez quelque chose qui n'est pas un tableau.";
  }
  return "une erreur s'est produite (" + message + ").";
}

// Appelle une fonction de logique.js avec des copies des arguments.
// Renvoie { indefini, valeur, args } ou lance une erreur déjà expliquée.
function appeler(nom, args) {
  const exportes = contexte.module.exports || {};
  let disponible = typeof exportes[nom] === "function";
  if (!disponible) {
    const existe = vm.runInContext("typeof " + nom + " === 'function'", contexte);
    if (existe) {
      throw new Error("la fonction " + nom + " existe mais n'est pas exportée. Ajoutez-la dans module.exports en bas de logique.js.");
    }
    throw new Error("la fonction " + nom + " est introuvable. Vérifiez son nom (majuscules comprises).");
  }
  contexte.__nom = nom;
  contexte.__argsTexte = JSON.stringify(args);
  let texte;
  try {
    texte = vm.runInContext(
      "(function () {" +
      "  var a = JSON.parse(__argsTexte);" +
      "  var r = module.exports[__nom].apply(null, a);" +
      "  return JSON.stringify({ indefini: r === undefined, valeur: r === undefined ? null : r, args: a });" +
      "})()",
      contexte, { timeout: DELAI_MAX });
  } catch (e) {
    throw new Error(nom + " : " + expliquer(e));
  }
  return JSON.parse(texte);
}

// ------------------------------------------------------------------
// Petits outils pour écrire les tests
// ------------------------------------------------------------------

class Probleme extends Error {}
function aRevoir(message) { throw new Probleme(message); }

function montrer(valeur) {
  if (valeur === undefined) return "rien (undefined)";
  return JSON.stringify(valeur);
}

// Compare deux valeurs sans tenir compte de l'ordre des cles d'un objet :
// { quantite: 2, produitId: 1 } vaut { produitId: 1, quantite: 2 }.
function pareil(a, b) {
  return JSON.stringify(trier(a)) === JSON.stringify(trier(b));
}

function trier(valeur) {
  if (Array.isArray(valeur)) return valeur.map(trier);
  if (valeur !== null && typeof valeur === "object") {
    const copie = {};
    Object.keys(valeur).sort().forEach(function (cle) { copie[cle] = trier(valeur[cle]); });
    return copie;
  }
  return valeur;
}

function exigerRetour(nom, resultat) {
  if (resultat.indefini) {
    aRevoir(nom + " ne renvoie rien pour l'instant. Avez-vous écrit return ?");
  }
}

function exigerTableau(nom, resultat) {
  exigerRetour(nom, resultat);
  if (!Array.isArray(resultat.valeur)) {
    aRevoir(nom + " doit renvoyer un tableau, elle renvoie " + montrer(resultat.valeur) + ".");
  }
}

function ids(liste) {
  const r = [];
  for (let i = 0; i < liste.length; i++) {
    r.push(liste[i] && liste[i].id);
  }
  return r;
}

// ------------------------------------------------------------------
// Les tests, exercice par exercice
// ------------------------------------------------------------------

const exercices = [];

exercices.push({
  titre: "Fonctions fournies (atelier 1)",
  tester: function () {
    const verifs = [
      ["arrondirAuCentime", [3.376], 3.38],
      ["prixTTC", [3.2], 3.38],
      ["formaterEuros", [3.38], "3,38 €"],
      ["trouverParId", [CATALOGUE, 99], null],
      ["totalPanierTTC", [[{ produitId: 1, quantite: 2 }], CATALOGUE], 6.75],
      ["fraisLivraison", [6.75], 4.9],
      ["fraisLivraison", [40], 0],
      ["montantAPayer", [[{ produitId: 1, quantite: 2 }], CATALOGUE], 11.65],
      // Le panier de l'atelier 1 : 39,98 € TTC, juste sous le seuil.
      // Un arrondi ligne par ligne donnerait 40,00 € et offrirait la livraison.
      ["totalPanierTTC", [[{ produitId: 1, quantite: 2 }, { produitId: 12, quantite: 3 }], CATALOGUE], 39.98],
      ["montantAPayer", [[{ produitId: 1, quantite: 2 }, { produitId: 12, quantite: 3 }], CATALOGUE], 44.88]
    ];
    for (let i = 0; i < verifs.length; i++) {
      const r = appeler(verifs[i][0], verifs[i][1]);
      if (!pareil(r.valeur, verifs[i][2])) {
        aRevoir("la fonction fournie " + verifs[i][0] + " ne donne plus le bon résultat. " +
          "Elle a dû être modifiée par erreur. Reprenez-la depuis le fichier d'origine.");
      }
    }
  }
});

exercices.push({
  titre: "Exercice 1 (indispensable) : libellePrix",
  tester: function () {
    const r = appeler("libellePrix", [POMMES]);
    exigerRetour("libellePrix", r);
    const v = r.valeur;
    if (typeof v !== "string") {
      aRevoir("libellePrix doit renvoyer du texte, elle renvoie " + montrer(v) + ".");
    }
    if (v.indexOf("3,2") !== -1 || v.indexOf("3.2") !== -1) {
      aRevoir("le prix affiché est le prix HT. Il faut le prix TTC : utilisez prixTTC.");
    }
    if (v.indexOf("3.38") !== -1) {
      aRevoir("le prix s'écrit avec un point. Utilisez formaterEuros, qui met une virgule.");
    }
    if (v.indexOf("kg") === -1) {
      aRevoir("il manque l'unité. Pour les pommes, on attend \"3,38 € / kg\", vous renvoyez " + montrer(v) + ".");
    }
    if (v !== "3,38 € / kg") {
      aRevoir("pour les pommes, on attend exactement \"3,38 € / kg\" (avec les espaces), vous renvoyez " + montrer(v) + ".");
    }
    const autres = [[TOMME, "23,21 € / kg"], [POIREAUX, "2,53 € / botte"], [YAOURT, "0,95 € / piece"]];
    for (let i = 0; i < autres.length; i++) {
      const r2 = appeler("libellePrix", [autres[i][0]]);
      if (r2.valeur !== autres[i][1]) {
        aRevoir("les pommes marchent, mais pour " + autres[i][0].nom + " on attend " +
          montrer(autres[i][1]) + " et vous renvoyez " + montrer(r2.indefini ? undefined : r2.valeur) + ". Le prix ou l'unité est-il écrit en dur ?");
      }
    }
  }
});

exercices.push({
  titre: "Exercice 2 (indispensable) : filtrerParCategorie",
  tester: function () {
    const r = appeler("filtrerParCategorie", [CATALOGUE, "fruits"]);
    exigerTableau("filtrerParCategorie", r);
    if (r.args[0].length !== CATALOGUE.length) {
      aRevoir("le catalogue d'origine a changé de taille. Remplissez un nouveau tableau au lieu de modifier le catalogue.");
    }
    if (r.valeur.length === CATALOGUE.length) {
      aRevoir("pour \"fruits\", tous les produits sont renvoyés. Le test sur la catégorie manque ou ne marche pas.");
    }
    const attendus = filtrerAttendu("fruits");
    if (!pareil(ids(r.valeur), attendus)) {
      aRevoir("pour \"fruits\", on attend les produits " + montrer(attendus) + " (des produits entiers, pas seulement leur nom), vous renvoyez " + montrer(ids(r.valeur)) + ".");
    }
    const legumes = appeler("filtrerParCategorie", [CATALOGUE, "legumes"]);
    if (!pareil(ids(legumes.valeur || []), filtrerAttendu("legumes"))) {
      aRevoir("les fruits marchent, mais pas les légumes. La catégorie est-elle écrite en dur ?");
    }
    const toutes = appeler("filtrerParCategorie", [CATALOGUE, "toutes"]);
    if (!Array.isArray(toutes.valeur) || toutes.valeur.length !== CATALOGUE.length) {
      aRevoir("avec \"toutes\", il faut renvoyer tous les produits (" + CATALOGUE.length + "). Vous en renvoyez " +
        (Array.isArray(toutes.valeur) ? toutes.valeur.length : montrer(toutes.indefini ? undefined : toutes.valeur)) + ".");
    }
    const aucune = appeler("filtrerParCategorie", [CATALOGUE, "viande"]);
    if (!pareil(aucune.valeur, [])) {
      aRevoir("pour une catégorie qui n'existe pas, on attend un tableau vide [].");
    }
  }
});

function filtrerAttendu(categorie) {
  const r = [];
  for (let i = 0; i < CATALOGUE.length; i++) {
    if (CATALOGUE[i].categorie === categorie) r.push(CATALOGUE[i].id);
  }
  return r;
}

exercices.push({
  titre: "Exercice 3 (indispensable) : ajouterAuPanier et nombreArticles",
  tester: function () {
    let r = appeler("ajouterAuPanier", [[], POMMES]);
    exigerTableau("ajouterAuPanier", r);
    if (r.valeur.length !== 1) {
      aRevoir("dans un panier vide, ajouter des pommes doit donner une seule ligne. Vous obtenez " + montrer(r.valeur) + ".");
    }
    const ligne = r.valeur[0];
    if (ligne && ligne.nom !== undefined) {
      aRevoir("une ligne du panier ne contient pas tout le produit, seulement { produitId: 1, quantite: 1 }.");
    }
    if (!pareil(r.valeur, [{ produitId: 1, quantite: 1 }])) {
      aRevoir("on attend [{\"produitId\":1,\"quantite\":1}], vous obtenez " + montrer(r.valeur) +
        ". Vérifiez les noms produitId et quantite.");
    }
    r = appeler("ajouterAuPanier", [[{ produitId: 1, quantite: 1 }], POMMES]);
    if (Array.isArray(r.valeur) && r.valeur.length === 2) {
      aRevoir("les pommes apparaissent deux fois. Si le produit est déjà dans le panier, augmentez sa quantité au lieu d'ajouter une ligne.");
    }
    if (!pareil(r.valeur, [{ produitId: 1, quantite: 2 }])) {
      aRevoir("ajouter des pommes à [{ produitId: 1, quantite: 1 }] doit donner une quantité de 2. Vous obtenez " + montrer(r.indefini ? undefined : r.valeur) + ".");
    }
    r = appeler("ajouterAuPanier", [[{ produitId: 1, quantite: 2 }], CAROTTES]);
    if (!pareil(r.valeur, [{ produitId: 1, quantite: 2 }, { produitId: 4, quantite: 1 }])) {
      aRevoir("ajouter des carottes à un panier qui a déjà des pommes doit garder les pommes et ajouter une ligne pour les carottes. Vous obtenez " + montrer(r.indefini ? undefined : r.valeur) + ".");
    }
    r = appeler("ajouterAuPanier", [[], POIRES]);
    if (!pareil(r.valeur, [])) {
      aRevoir("les poires sont épuisées (stock 0) : elles ne doivent pas entrer dans le panier.");
    }
    r = appeler("ajouterAuPanier", [[{ produitId: 7, quantite: 3 }], RADIS]);
    if (!pareil(r.valeur, [{ produitId: 7, quantite: 3 }])) {
      aRevoir("il reste 3 bottes de radis et le panier en a déjà 3 : la quantité doit rester à 3. Vous obtenez " + montrer(r.indefini ? undefined : r.valeur) + ".");
    }

    let n = appeler("nombreArticles", [[]]);
    exigerRetour("nombreArticles", n);
    if (n.valeur !== 0) {
      aRevoir("pour un panier vide, nombreArticles doit renvoyer 0. Vous renvoyez " + montrer(n.valeur) + ".");
    }
    n = appeler("nombreArticles", [[{ produitId: 1, quantite: 2 }, { produitId: 4, quantite: 3 }]]);
    if (n.valeur === 2) {
      aRevoir("nombreArticles compte les lignes. Il faut additionner les quantités : 2 + 3 donne 5.");
    }
    if (n.valeur === "023" || n.valeur === "23") {
      aRevoir("les quantités sont collées comme du texte. Partez de 0 (un nombre) et additionnez.");
    }
    if (n.valeur !== 5) {
      aRevoir("pour 2 pommes et 3 carottes, on attend 5. Vous renvoyez " + montrer(n.valeur) + ".");
    }
  }
});

exercices.push({
  titre: "Exercice 4 (souhaitable) : estEpuise, panierEnTexte, panierDepuisTexte",
  tester: function () {
    let r = appeler("estEpuise", [POIRES]);
    exigerRetour("estEpuise", r);
    if (r.valeur !== true) {
      aRevoir("les poires ont un stock de 0 : estEpuise doit renvoyer true. Vous renvoyez " + montrer(r.valeur) + ".");
    }
    r = appeler("estEpuise", [POMMES]);
    if (r.valeur !== false) {
      aRevoir("les pommes ont un stock de 40 : estEpuise doit renvoyer false. Vous renvoyez " + montrer(r.indefini ? undefined : r.valeur) + ".");
    }

    const panier = [{ produitId: 1, quantite: 2 }, { produitId: 4, quantite: 3 }];
    r = appeler("panierEnTexte", [panier]);
    exigerRetour("panierEnTexte", r);
    if (r.valeur === "[object Object],[object Object]" || r.valeur === "[object Object]") {
      aRevoir("le panier est devenu \"[object Object]\". Utilisez JSON.stringify (slide 74).");
    }
    if (typeof r.valeur !== "string") {
      aRevoir("panierEnTexte doit renvoyer du texte. Elle renvoie " + montrer(r.valeur) + ".");
    }
    let relu;
    try { relu = JSON.parse(r.valeur); } catch (e) { relu = undefined; }
    if (!pareil(relu, panier)) {
      aRevoir("le texte renvoyé n'est pas le JSON du panier. Utilisez JSON.stringify(panier).");
    }

    r = appeler("panierDepuisTexte", [JSON.stringify(panier)]);
    exigerRetour("panierDepuisTexte", r);
    if (typeof r.valeur === "string") {
      aRevoir("panierDepuisTexte renvoie encore du texte. Utilisez JSON.parse pour retrouver le tableau.");
    }
    if (!pareil(r.valeur, panier)) {
      aRevoir("le panier relu n'est pas le bon. On attend " + montrer(panier) + ", vous renvoyez " + montrer(r.valeur) + ".");
    }
    let vide;
    try {
      vide = appeler("panierDepuisTexte", [null]);
    } catch (e) {
      aRevoir("avec null (rien dans localStorage), panierDepuisTexte plante. Testez d'abord si le texte vaut null, et renvoyez [] dans ce cas.");
    }
    if (!pareil(vide.valeur, [])) {
      aRevoir("avec null (rien dans localStorage), panierDepuisTexte doit renvoyer un panier vide []. Vous renvoyez " + montrer(vide.indefini ? undefined : vide.valeur) + ".");
    }
    try {
      vide = appeler("panierDepuisTexte", [""]);
    } catch (e) {
      aRevoir("avec un texte vide \"\", panierDepuisTexte plante. Renvoyez [] dans ce cas aussi.");
    }
    if (!pareil(vide.valeur, [])) {
      aRevoir("avec un texte vide \"\", panierDepuisTexte doit renvoyer [].");
    }
  }
});

exercices.push({
  titre: "Exercice 5 (bonus) : fetch dans app.js",
  sansLogique: true,
  tester: function () {
    let source;
    try {
      source = fs.readFileSync(path.join(DOSSIER, "app.js"), "utf8");
    } catch (e) {
      aRevoir("le fichier app.js est introuvable dans ce dossier.");
    }
    // On enlève les commentaires pour ne pas compter le squelette commenté
    const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1");
    if (code.indexOf("fetch(") === -1) {
      aRevoir("fetch n'est pas encore utilisé dans app.js. C'est un bonus, facultatif.");
    }
    if (code.indexOf("await") === -1 || code.indexOf("async") === -1) {
      aRevoir("fetch est appelé, mais sans async et await. Reprenez le squelette fourni.");
    }
    if (code.indexOf("catch") === -1) {
      aRevoir("il manque la gestion d'erreur (try et catch) autour de fetch.");
    }
    return "vérification rapide du code, testez aussi la page avec un serveur local";
  }
});

// ------------------------------------------------------------------
// Affichage
// ------------------------------------------------------------------

function lancer() {
  console.log("");
  console.log("GreenCart, atelier 2 : vérification de logique.js");
  console.log("");

  charger();
  let ok = 0;
  let compte = 0;

  for (let i = 0; i < exercices.length; i++) {
    const ex = exercices[i];
    const estExercice = ex.titre.indexOf("Exercice") === 0;
    if (estExercice) compte++;
    let ligne;
    if (erreurChargement && !ex.sansLogique) {
      ligne = "À revoir : " + erreurChargement;
    } else {
      try {
        const remarque = ex.tester();
        ligne = "OK" + (remarque ? " (" + remarque + ")" : "");
        if (estExercice) ok++;
      } catch (e) {
        ligne = "À revoir : " + (e instanceof Probleme ? e.message : String(e && e.message || e));
      }
    }
    console.log("  " + ex.titre);
    console.log("    " + ligne);
  }

  console.log("");
  console.log("Résultat : " + ok + " exercice(s) OK sur " + compte + ".");
  afficherListeManuelle();
}

function afficherListeManuelle() {
  const lignes = [
    "",
    "Partie page web : à vérifier vous-même, dans le navigateur",
    "Ouvrez index.html, puis la console (F12). Elle ne doit montrer aucune erreur rouge.",
    "Cochez chaque ligne quand vous l'avez constatée.",
    "",
    "Exercice 1",
    "  [ ] Les 12 produits s'affichent, chacun avec son nom et son prix TTC (Pommes Reinette : 3,38 € / kg).",
    "  [ ] Les produits bio portent la mention « Bio ».",
    "  [ ] Chaque produit a un bouton « Ajouter au panier ».",
    "Exercice 2",
    "  [ ] Choisissez Fruits dans la liste : seuls les 2 fruits restent affichés.",
    "  [ ] Choisissez Légumes : 4 produits. Choisissez Toutes : les 12 reviennent.",
    "Exercice 3",
    "  [ ] Cliquez sur « Ajouter au panier » des Pommes Reinette : le panier affiche « Pommes Reinette x 1 ».",
    "  [ ] Cliquez une deuxième fois : « x 2 », et toujours une seule ligne.",
    "  [ ] Le nombre d'articles en haut de la page suit (2 articles).",
    "Exercice 4",
    "  [ ] Avec 2 kg de pommes : total TTC 6,75 €, livraison 4,90 €, à payer 11,65 €.",
    "  [ ] Ajoutez 3 pots de miel d'acacia : total TTC 39,98 €, la livraison reste à 4,90 €.",
    "  [ ] Un quatrième pot : la livraison passe à 0,00 € (offerte dès 40 €).",
    "  [ ] Poires Williams et Yaourt au lait de chèvre sont grisés, leur bouton est désactivé.",
    "  [ ] Rechargez la page (F5) : le panier est toujours là.",
    "  [ ] Cliquez sur « Vider le panier » : les trois montants reviennent à 0,00 €. Rechargez : le panier reste vide.",
    "Exercice 5 (bonus, avec le serveur fourni : node serveur-local.js, puis http://127.0.0.1:8642)",
    "  [ ] La page s'ouvre par l'adresse http://127.0.0.1:8642 et affiche le catalogue.",
    "  [ ] Changez le prix des carottes dans produits.json, rechargez : le nouveau prix s'affiche.",
    "  [ ] Renommez produits.json, rechargez : un message d'erreur clair s'affiche, la page ne reste pas blanche.",
    ""
  ];
  console.log(lignes.join("\n"));
}

try {
  lancer();
} catch (e) {
  // Filet de sécurité : le vérificateur ne doit jamais planter.
  console.log("Le vérificateur a rencontré un problème inattendu. Montrez ce message au formateur : " + (e && e.message));
}
process.exitCode = 0;
