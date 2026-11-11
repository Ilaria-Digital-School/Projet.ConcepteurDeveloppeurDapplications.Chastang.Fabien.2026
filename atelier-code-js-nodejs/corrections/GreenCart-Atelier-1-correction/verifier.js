// Vérificateur de l'atelier 1 : JavaScript, les bases.
//
// Lancez-le depuis ce dossier avec :   node verifier.js
//
// Il affiche une ligne par exercice : OK, ou À revoir avec une explication.
// Vous n'avez pas besoin de lire ce fichier, et vous ne devez pas le modifier.
//
// Fonctionnement : chaque exercice est vérifié dans un petit programme à part,
// lancé avec une limite de temps. Une boucle sans fin ou un plantage dans un
// exercice n'empêche donc pas de vérifier les autres.

'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const DOSSIER = __dirname;
const MARQUEUR = '@@RESULTAT_VERIFICATEUR@@';
const DELAI_MS = 8000;

const TVA = 0.055;

// ---------------------------------------------------------------------------
// Outils communs
// ---------------------------------------------------------------------------

class ARevoir extends Error {}

function aRevoir(message) {
  throw new ARevoir(message);
}

function arrondi(montant) {
  return Math.round(montant * 100) / 100;
}

// egal : le bon montant, arrondi au centime (44.879999 n'est pas 44.88).
// proche : une valeur voisine, pour reconnaître une erreur fréquente.
function egal(a, b) {
  return typeof a === 'number' && a === b;
}

function proche(a, b) {
  return typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 0.0001;
}

function copie(valeur) {
  return JSON.parse(JSON.stringify(valeur));
}

function lireJson(nom) {
  return JSON.parse(fs.readFileSync(path.join(DOSSIER, 'donnees', nom), 'utf8'));
}

// Décrit une valeur en quelques mots, pour les messages.
function decrire(valeur) {
  if (valeur === undefined) return 'undefined (rien)';
  if (valeur === null) return 'null';
  if (typeof valeur === 'string') return `le texte "${valeur}"`;
  if (typeof valeur === 'number') return String(valeur);
  if (typeof valeur === 'boolean') return String(valeur);
  if (Array.isArray(valeur)) return `un tableau de ${valeur.length} élément(s)`;
  if (typeof valeur === 'object' && valeur.nom) return `l'objet « ${valeur.nom} »`;
  if (typeof valeur === 'function') return 'une fonction';
  return 'un objet';
}

// Traduit une erreur JavaScript en une phrase simple.
function traduireErreur(erreur) {
  if (erreur === undefined || erreur === null) return 'une erreur sans message.';
  const message = typeof erreur === 'string' ? erreur : String(erreur.message || erreur);
  let m;
  if ((m = message.match(/^(\S+) is not defined/))) {
    return `le nom « ${m[1]} » n'est pas défini. Vérifiez l'orthographe et les majuscules. S'il vient d'un autre fichier, importez-le avec require.`;
  }
  if ((m = message.match(/Cannot read propert(?:y|ies) of (undefined|null)(?: \(reading '(.+)'\))?/))) {
    const prop = m[2] ? ` « ${m[2]} »` : '';
    return `votre code lit la propriété${prop} de quelque chose qui vaut ${m[1]}. Une variable n'a pas la valeur que vous croyez (par exemple un indice de tableau trop grand dans la boucle).`;
  }
  if ((m = message.match(/^(.+) is not a function/))) {
    return `« ${m[1]} » n'est pas une fonction. Vérifiez le nom, et qu'il est bien importé.`;
  }
  if ((m = message.match(/Assignment to constant variable/))) {
    return 'vous modifiez une variable déclarée avec const. Utilisez let pour une variable qui change.';
  }
  if ((m = message.match(/Cannot find module '(.+?)'/))) {
    return `le fichier « ${m[1]} » est introuvable. Vérifiez le chemin dans require : il commence par ./ et le nom doit être exact.`;
  }
  if (erreur instanceof RangeError || /Maximum call stack/.test(message)) {
    return 'une fonction s\'appelle elle-même sans fin.';
  }
  return `erreur « ${message} ».`;
}

// Retire les commentaires d'un code source, pour chercher des mots dedans.
function sansCommentaires(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"])\/\/.*$/gm, '$1');
}

function lireSource(nomFichier) {
  return sansCommentaires(fs.readFileSync(path.join(DOSSIER, nomFichier), 'utf8'));
}

// Charge un fichier de l'étudiant, avec une explication claire s'il plante.
function charger(nomFichier) {
  const chemin = path.join(DOSSIER, nomFichier);
  if (!fs.existsSync(chemin)) {
    aRevoir(`le fichier ${nomFichier} est introuvable. Il doit être dans le même dossier que verifier.js.`);
  }
  try {
    return require(chemin);
  } catch (erreur) {
    if (erreur instanceof SyntaxError) {
      const lieu = trouverLieu(erreur, nomFichier);
      aRevoir(`le fichier ${lieu.fichier} contient une erreur d'écriture${lieu.ligne} : ${traduireSyntaxe(erreur.message)} Vérifiez les parenthèses, les accolades et les guillemets.`);
    }
    if (erreur && erreur.message === 'À compléter') {
      aRevoir(`le fichier ${nomFichier} appelle une fonction pas encore écrite dès son chargement. Mettez vos essais dans le bloc « Vos essais » en bas du fichier.`);
    }
    aRevoir(`le fichier ${nomFichier} plante dès son chargement : ${traduireErreur(erreur)}`);
  }
}

// Retrouve le fichier et la ligne d'une erreur d'écriture. Le fichier fautif
// peut être un autre que celui qu'on charge (un fichier importé avec require).
function trouverLieu(erreur, nomFichier) {
  const texte = String(erreur.stack || '');
  const m = texte.match(/([\w.-]+\.js):(\d+)/);
  if (m) return { fichier: m[1], ligne: ` vers la ligne ${m[2]}` };
  return { fichier: nomFichier, ligne: '' };
}

function traduireSyntaxe(message) {
  if (/Unexpected end of input/.test(message)) return 'il manque une accolade } ou une parenthèse ) fermante.';
  if (/missing \) after argument list/.test(message)) return 'il manque une parenthèse ) fermante.';
  if (/Unexpected string/.test(message)) return 'un texte entre guillemets est mal placé (il manque peut-être un + ou une virgule).';
  if (/Invalid or unexpected token/.test(message)) return 'un caractère est mal placé, souvent un guillemet qui n\'est pas refermé.';
  if (/has already been declared/.test(message)) return 'une variable ou une fonction est déclarée deux fois.';
  if (/Unexpected token/.test(message)) return 'un caractère est mal placé (« ' + message.replace(/^.*Unexpected token\s*/, '') + ' »).';
  return `« ${message} ».`;
}

// Récupère une fonction exportée, ou explique pourquoi elle manque.
function fonction(module, nom, fichier) {
  if (module === null || typeof module !== 'object' || !(nom in module)) {
    aRevoir(`la fonction ${nom} n'est pas exportée par ${fichier}. Vérifiez module.exports en bas du fichier.`);
  }
  if (typeof module[nom] !== 'function') {
    aRevoir(`${nom} est exporté par ${fichier} mais ce n'est pas une fonction.`);
  }
  return module[nom];
}

// Appelle une fonction de l'étudiant. Si elle plante, on explique.
function appeler(f, nom, args, contexte) {
  try {
    return f(...args);
  } catch (erreur) {
    if (erreur && erreur.message === 'À compléter') {
      aRevoir(`la fonction ${nom} n'est pas encore écrite.`);
    }
    aRevoir(`${nom} plante ${contexte} : ${traduireErreur(erreur)}`);
  }
}

// Vérifie qu'une valeur est un montant utilisable, sinon explique.
function exigerNombre(valeur, appel) {
  if (valeur === undefined) {
    aRevoir(`${appel} ne renvoie rien (undefined). La fonction n'est pas encore écrite, ou il manque return.`);
  }
  if (typeof valeur === 'string') {
    aRevoir(`${appel} renvoie du texte ("${valeur}") au lieu d'un nombre. Si vous utilisez toFixed, convertissez le résultat avec Number(...).`);
  }
  if (typeof valeur !== 'number') {
    aRevoir(`${appel} devrait renvoyer un nombre, et renvoie ${decrire(valeur)}.`);
  }
  if (Number.isNaN(valeur)) {
    aRevoir(`${appel} renvoie NaN (pas un nombre). Une variable n'a pas de valeur de départ, ou vous calculez avec du texte.`);
  }
}

function exigerTableau(valeur, appel) {
  if (valeur === undefined) {
    aRevoir(`${appel} ne renvoie rien (undefined). La fonction n'est pas encore écrite, ou il manque return.`);
  }
  if (!Array.isArray(valeur)) {
    aRevoir(`${appel} devrait renvoyer un tableau, et renvoie ${decrire(valeur)}.`);
  }
}

function ids(liste) {
  return liste.map(function (element) {
    return element && typeof element === 'object' ? element.id : element;
  });
}

function memesIds(liste, attendus) {
  const obtenus = ids(liste);
  return obtenus.length === attendus.length && obtenus.every(function (id, i) { return id === attendus[i]; });
}

function noms(liste, catalogue) {
  return liste.map(function (id) {
    for (let i = 0; i < catalogue.length; i++) {
      if (catalogue[i].id === id) return catalogue[i].nom;
    }
    return '?';
  }).join(', ');
}

function nomsObtenus(liste) {
  if (liste.length === 0) return 'aucun produit';
  return liste.map(function (p) { return p && p.nom ? p.nom : decrire(p); }).join(', ');
}

// Le panier des tests : 2 kg de pommes et 3 pots de miel d'acacia.
// Total HT 37,90 €, TTC 39,98 €. Juste sous le seuil de livraison offerte.
function panierSousLeSeuil() {
  return [
    { nom: 'Pommes Reinette', prix: 3.2, quantite: 2 },
    { nom: "Miel d'acacia", prix: 10.5, quantite: 3 },
  ];
}

// Le même panier avec une botte de radis en plus : TTC 41,99 €.
function panierAuDessusDuSeuil() {
  const panier = panierSousLeSeuil();
  panier.push({ nom: 'Radis', prix: 1.9, quantite: 1 });
  return panier;
}

// ---------------------------------------------------------------------------
// Exercice 1 : le prix TTC
// ---------------------------------------------------------------------------

function verifierExercice1() {
  const fichier = 'exercice-1-prix.js';
  const mod = charger(fichier);

  const arrondirAuCentime = fonction(mod, 'arrondirAuCentime', fichier);
  const cas = [[3.376, 3.38], [2.531, 2.53], [4.125, 4.13], [10, 10], [39.984, 39.98]];
  for (let i = 0; i < cas.length; i++) {
    const entree = cas[i][0];
    const attendu = cas[i][1];
    const appel = `arrondirAuCentime(${entree})`;
    const obtenu = appeler(arrondirAuCentime, 'arrondirAuCentime', [entree], `avec ${entree}`);
    exigerNombre(obtenu, appel);
    if (!egal(obtenu, attendu)) {
      if (proche(obtenu, Math.floor(entree * 100) / 100)) {
        aRevoir(`${appel} renvoie ${obtenu} au lieu de ${attendu}. Vous coupez les décimales au lieu d'arrondir : utilisez Math.round, pas Math.floor.`);
      }
      if (proche(obtenu, Math.round(entree))) {
        aRevoir(`${appel} renvoie ${obtenu} au lieu de ${attendu}. Vous arrondissez à l'euro. Pour arrondir au centime, multipliez par 100, arrondissez, puis divisez par 100.`);
      }
      aRevoir(`${appel} devrait renvoyer ${attendu}, et renvoie ${obtenu}.`);
    }
  }

  const prixTTC = fonction(mod, 'prixTTC', fichier);
  const prix = [[10, 10.55], [3.2, 3.38], [22, 23.21], [1.8, 1.9], [0, 0]];
  for (let i = 0; i < prix.length; i++) {
    const ht = prix[i][0];
    const attendu = prix[i][1];
    const appel = `prixTTC(${ht})`;
    const obtenu = appeler(prixTTC, 'prixTTC', [ht], `avec un prix HT de ${ht}`);
    exigerNombre(obtenu, appel);
    if (egal(obtenu, attendu)) continue;
    const debut = `${appel} renvoie ${obtenu} au lieu de ${attendu}.`;
    if (proche(obtenu, ht * 1.055)) aRevoir(`${debut} Le calcul est juste mais pas arrondi. Arrondissez au centime avec arrondirAuCentime.`);
    if (proche(obtenu, ht * 1.55) || proche(obtenu, arrondi(ht * 1.55))) aRevoir(`${debut} Vous avez ajouté 55 %. 5,5 % s'écrit 0.055, donc on multiplie par 1.055.`);
    if (proche(obtenu, arrondi(ht * TVA)) || proche(obtenu, ht * TVA)) aRevoir(`${debut} Vous avez calculé le montant de la TVA seule. Ajoutez-le au prix HT.`);
    if (proche(obtenu, arrondi(ht * 1.05)) || proche(obtenu, ht * 1.05)) aRevoir(`${debut} Vous avez appliqué 5 %. La TVA de l'alimentaire est de 5,5 %.`);
    if (proche(obtenu, arrondi(ht * 1.2)) || proche(obtenu, ht * 1.2)) aRevoir(`${debut} 20 % est la TVA normale. L'alimentaire est à 5,5 %.`);
    if (proche(obtenu, arrondi(ht * 5.5)) || proche(obtenu, arrondi(ht + 5.5))) aRevoir(`${debut} 5,5 % ne veut pas dire 5,5 : c'est 5,5 centièmes, soit 0.055.`);
    aRevoir(`${debut}`);
  }
}

// ---------------------------------------------------------------------------
// Exercice 2 : le panier et la livraison
// ---------------------------------------------------------------------------

function verifierExercice2() {
  const fichier = 'exercice-2-panier.js';
  const mod = charger(fichier);

  const totalPanierTTC = fonction(mod, 'totalPanierTTC', fichier);

  let obtenu = appeler(totalPanierTTC, 'totalPanierTTC', [[]], 'avec un panier vide');
  exigerNombre(obtenu, 'totalPanierTTC([]) (panier vide)');
  if (!egal(obtenu, 0)) aRevoir(`un panier vide devrait coûter 0, et totalPanierTTC renvoie ${obtenu}. Le total doit démarrer à 0.`);

  obtenu = appeler(totalPanierTTC, 'totalPanierTTC', [panierSousLeSeuil()], 'avec le panier pommes et miel');
  const appel1 = 'totalPanierTTC pour 2 kg de Pommes Reinette et 3 pots de Miel d\'acacia';
  exigerNombre(obtenu, appel1);
  if (!egal(obtenu, 39.98)) {
    const debut = `${appel1} renvoie ${obtenu} au lieu de 39.98.`;
    if (proche(obtenu, 40) || proche(obtenu, 40.01)) aRevoir(`${debut} Vous avez arrondi le prix TTC de chaque produit avant d'additionner. Calculez d'abord le total HT de tout le panier, puis appliquez la TVA une seule fois, à la fin.`);
    if (proche(obtenu, 37.9)) aRevoir(`${debut} 37.9 est le total HT. Il manque la TVA.`);
    if (proche(obtenu, 39.9845)) aRevoir(`${debut} Le total n'est pas arrondi au centime.`);
    if (proche(obtenu, arrondi(13.7 * 1.055)) || proche(obtenu, 13.7)) aRevoir(`${debut} Les quantités sont oubliées : multipliez le prix de chaque ligne par sa quantité.`);
    if (proche(obtenu, arrondi(31.5 * 1.055)) || proche(obtenu, arrondi(6.4 * 1.055))) aRevoir(`${debut} Seule une ligne du panier est comptée. Votre boucle doit parcourir toutes les lignes, et ajouter chacune au total (total = total + ...).`);
    aRevoir(debut);
  }

  obtenu = appeler(totalPanierTTC, 'totalPanierTTC', [panierAuDessusDuSeuil()], 'avec le panier de trois lignes');
  exigerNombre(obtenu, 'totalPanierTTC');
  if (!egal(obtenu, 41.99)) {
    if (proche(obtenu, 39.98)) aRevoir('avec trois lignes, totalPanierTTC oublie la dernière. Vérifiez la condition de la boucle : i < panier.length.');
    aRevoir(`avec une botte de radis en plus, totalPanierTTC devrait renvoyer 41.99, et renvoie ${obtenu}.`);
  }

  const fraisLivraison = fonction(mod, 'fraisLivraison', fichier);
  const frais = [[39.99, 4.9], [40, 0], [40.01, 0], [12, 4.9], [100, 0], [0, 0]];
  for (let i = 0; i < frais.length; i++) {
    const total = frais[i][0];
    const attendu = frais[i][1];
    const appel = `fraisLivraison(${total})`;
    const valeur = appeler(fraisLivraison, 'fraisLivraison', [total], `pour un panier de ${total} € TTC`);
    exigerNombre(valeur, appel);
    if (!egal(valeur, attendu)) {
      if (total === 0) aRevoir(`${appel} renvoie ${valeur}. Un panier vide ne se livre pas : pour un total de 0 €, la livraison vaut 0.`);
      if (total === 40) aRevoir(`${appel} renvoie ${valeur}. À 40 € pile, la livraison est déjà offerte : utilisez >= et non >.`);
      if (attendu === 0) aRevoir(`${appel} renvoie ${valeur}. À partir de 40 € TTC, la livraison est offerte : elle vaut 0.`);
      if (proche(valeur, 4.09) || proche(valeur, 490)) aRevoir(`${appel} renvoie ${valeur}. Les frais sont de 4,90 €, soit 4.9 en JavaScript.`);
      aRevoir(`${appel} devrait renvoyer ${attendu}, et renvoie ${valeur}.`);
    }
  }

  const montantAPayer = fonction(mod, 'montantAPayer', fichier);
  obtenu = appeler(montantAPayer, 'montantAPayer', [panierSousLeSeuil()], 'avec le panier pommes et miel');
  const appel2 = 'montantAPayer pour le panier pommes et miel (39,98 € TTC)';
  exigerNombre(obtenu, appel2);
  if (!egal(obtenu, 44.88)) {
    const debut = `${appel2} renvoie ${obtenu} au lieu de 44.88.`;
    if (proche(obtenu, 39.98)) aRevoir(`${debut} Les frais de livraison sont oubliés.`);
    if (proche(obtenu, 39.98 + 4.9)) aRevoir(`${debut} Arrondissez le résultat au centime.`);
    if (proche(obtenu, 37.9 + 4.9)) aRevoir(`${debut} Les frais sont ajoutés au total HT. Ajoutez-les au total TTC.`);
    aRevoir(debut);
  }
  obtenu = appeler(montantAPayer, 'montantAPayer', [panierAuDessusDuSeuil()], 'avec le panier de trois lignes');
  exigerNombre(obtenu, 'montantAPayer');
  if (!egal(obtenu, 41.99)) {
    aRevoir(`pour un panier de 41,99 € TTC, la livraison est offerte : montantAPayer devrait renvoyer 41.99, et renvoie ${obtenu}.`);
  }
}

// ---------------------------------------------------------------------------
// Exercice 3 : le catalogue
// ---------------------------------------------------------------------------

function verifierExercice3() {
  const fichier = 'exercice-3-catalogue.js';
  const mod = charger(fichier);
  const produits = lireJson('produits.json');
  const producteurs = lireJson('producteurs.json');

  // trouverParId
  const trouverParId = fonction(mod, 'trouverParId', fichier);
  let catalogue = copie(produits);
  let obtenu = appeler(trouverParId, 'trouverParId', [catalogue, 9], 'avec l\'id 9');
  if (obtenu === undefined) aRevoir('trouverParId(catalogue, 9) ne renvoie rien (undefined). La fonction n\'est pas encore écrite, ou il manque return.');
  if (obtenu === null) aRevoir('trouverParId(catalogue, 9) renvoie null alors que le produit 9 existe. Votre boucle s\'arrête sans doute au premier produit : le return null doit être placé après la boucle, pas dans un else.');
  if (typeof obtenu === 'string') aRevoir('trouverParId doit renvoyer le produit entier (l\'objet), pas seulement son nom.');
  if (!obtenu || obtenu.id !== 9) aRevoir(`trouverParId(catalogue, 9) devrait renvoyer la Tomme de chèvre, et renvoie ${decrire(obtenu)}.`);

  obtenu = appeler(trouverParId, 'trouverParId', [catalogue, 99], 'avec un id qui n\'existe pas');
  if (obtenu !== null) {
    aRevoir(`trouverParId(catalogue, 99) devrait renvoyer null, car aucun produit n'a l'id 99. Elle renvoie ${decrire(obtenu)}.`);
  }
  obtenu = appeler(trouverParId, 'trouverParId', [copie(producteurs), 4], 'avec la liste des producteurs');
  if (!obtenu || obtenu.nom !== 'Rucher Martin') {
    aRevoir(`trouverParId(producteurs, 4) devrait renvoyer le Rucher Martin, et renvoie ${decrire(obtenu)}. La fonction doit marcher avec n'importe quelle liste qui a des id.`);
  }

  // rechercherParNom
  const rechercherParNom = fonction(mod, 'rechercherParNom', fichier);
  const recherches = [['pomme', [1, 6]], ['MIEL', [11, 12]], ['chèvre', [8, 9, 10]], ['kiwi', []]];
  for (let i = 0; i < recherches.length; i++) {
    const texte = recherches[i][0];
    const attendus = recherches[i][1];
    const appel = `rechercherParNom(catalogue, "${texte}")`;
    catalogue = copie(produits);
    obtenu = appeler(rechercherParNom, 'rechercherParNom', [catalogue, texte], `avec "${texte}"`);
    exigerTableau(obtenu, appel);
    if (obtenu.length > 0 && typeof obtenu[0] === 'string') aRevoir(`${appel} doit renvoyer les produits entiers (les objets), pas seulement leurs noms.`);
    if (!memesIds(obtenu, attendus)) {
      const attendusTexte = attendus.length ? noms(attendus, produits) : 'aucun produit (tableau vide)';
      let aide = '';
      if (obtenu.length === 0 && attendus.length > 0) aide = ' Pensez à mettre le nom et le texte cherché en minuscules avec toLowerCase avant de comparer.';
      const enTrop = ids(obtenu).filter(function (id) { return attendus.indexOf(id) === -1; });
      if (enTrop.length > 0) aide = ' Des produits qui ne contiennent pas le texte sont renvoyés. indexOf renvoie -1 quand le texte est absent, et 0 quand il est au tout début : comparez avec !== -1.';
      aRevoir(`${appel} devrait trouver ${attendusTexte}. Votre fonction trouve : ${nomsObtenus(obtenu)}.${aide}`);
    }
  }

  // produitsDisponibles
  const produitsDisponibles = fonction(mod, 'produitsDisponibles', fichier);
  catalogue = copie(produits);
  obtenu = appeler(produitsDisponibles, 'produitsDisponibles', [catalogue], 'avec le catalogue');
  exigerTableau(obtenu, 'produitsDisponibles(catalogue)');
  if (catalogue.length !== produits.length) aRevoir('produitsDisponibles modifie le catalogue reçu (des produits ont disparu). Créez un nouveau tableau vide et ajoutez-y les produits avec push.');
  const attendus = [1, 3, 4, 5, 6, 7, 8, 9, 11, 12];
  if (!memesIds(obtenu, attendus)) {
    const liste = ids(obtenu);
    if (liste.indexOf(2) !== -1 || liste.indexOf(10) !== -1) aRevoir('produitsDisponibles renvoie aussi les produits en stock 0 (Poires Williams, Yaourt au lait de chèvre). Un produit est disponible si son stock est strictement supérieur à 0.');
    aRevoir(`produitsDisponibles devrait renvoyer 10 produits (tous sauf les Poires Williams et le Yaourt au lait de chèvre). Votre fonction en renvoie ${obtenu.length} : ${nomsObtenus(obtenu)}.`);
  }
}

// ---------------------------------------------------------------------------
// Exercice 4 : les modules
// ---------------------------------------------------------------------------

function verifierExercice4() {
  const fichier = 'exercice-4-fiche.js';
  const mod = charger(fichier);
  const produits = lireJson('produits.json');

  if (mod && typeof mod === 'object' && Object.keys(mod).length === 0) {
    aRevoir(`${fichier} n'exporte rien. Ajoutez module.exports = { ficheProduit } en bas du fichier.`);
  }
  if (typeof mod === 'function') {
    aRevoir(`${fichier} exporte la fonction seule. Écrivez module.exports = { ficheProduit }, avec les accolades.`);
  }
  const ficheProduit = fonction(mod, 'ficheProduit', fichier);

  const cas = [
    [4, 'Carottes (bio) : 1,90 € TTC / kg'],
    [6, 'Pommes de terre : 1,58 € TTC / kg'],
    [2, 'Poires Williams : 3,80 € TTC / kg (épuisé)'],
    [9, 'Tomme de chèvre : 23,21 € TTC / kg'],
    [12, "Miel d'acacia (bio) : 11,08 € TTC / pot"],
  ];
  for (let i = 0; i < cas.length; i++) {
    const produit = copie(produits).filter(function (p) { return p.id === cas[i][0]; })[0];
    const attendu = cas[i][1];
    const obtenu = appeler(ficheProduit, 'ficheProduit', [produit], `pour « ${produit.nom} »`);
    const appel = `ficheProduit pour « ${produit.nom} »`;
    if (obtenu === undefined) aRevoir(`${appel} ne renvoie rien (undefined). La fonction n'est pas encore écrite, ou il manque return.`);
    if (typeof obtenu !== 'string') aRevoir(`${appel} devrait renvoyer un texte, et renvoie ${decrire(obtenu)}.`);
    if (obtenu.trim() !== attendu) {
      let aide = '';
      if (/\d\.\d/.test(obtenu)) aide = ' Le prix doit s\'écrire avec une virgule : 1,90 et non 1.90.';
      else if (produit.bio && obtenu.indexOf('(bio)') === -1) aide = ' Il manque la mention (bio).';
      else if (!produit.bio && obtenu.indexOf('(bio)') !== -1) aide = ' Ce produit n\'est pas bio.';
      else if (produit.stock === 0 && obtenu.indexOf('(épuisé)') === -1) aide = ' Ce produit a un stock de 0 : il manque la mention (épuisé) à la fin.';
      else if (produit.stock > 0 && obtenu.indexOf('épuisé') !== -1) aide = ' Ce produit est en stock, il ne doit pas être marqué épuisé.';
      aRevoir(`${appel}, on attend "${attendu}" et votre fonction renvoie "${obtenu}".${aide}`);
    }
  }

  const source = lireSource(fichier);
  if (!/require\s*\(\s*['"]\.\/exercice-1-prix(\.js)?['"]\s*\)/.test(source)) {
    aRevoir(`${fichier} doit réutiliser prixTTC de l'exercice 1 au lieu de refaire le calcul. Importez-le en haut du fichier avec require('./exercice-1-prix').`);
  }

  // boutique.js : on le lance comme vous le feriez avec node boutique.js
  const cheminBoutique = path.join(DOSSIER, 'boutique.js');
  if (!fs.existsSync(cheminBoutique)) aRevoir('le fichier boutique.js est introuvable.');
  const lancement = spawnSync(process.execPath, [cheminBoutique], { cwd: DOSSIER, encoding: 'utf8', timeout: 5000 });
  if (lancement.error && lancement.error.code === 'ETIMEDOUT') aRevoir('boutique.js ne s\'arrête pas. Une boucle tourne sans fin ?');
  if (lancement.status !== 0) {
    const ligne = String(lancement.stderr || '').split('\n').filter(function (l) { return /^\w*Error: /.test(l); })[0];
    const explication = ligne ? traduireErreur(ligne.replace(/^\w*Error: /, '')) : 'lancez node boutique.js pour voir où.';
    aRevoir(`boutique.js plante quand on le lance : ${explication}`);
  }
  const sortie = String(lancement.stdout || '');
  if (sortie.trim() === '') aRevoir('boutique.js n\'affiche rien. Il doit afficher la fiche de chaque produit disponible avec console.log.');
  if (sortie.indexOf('Carottes (bio) : 1,90 € TTC / kg') === -1) aRevoir('boutique.js n\'affiche pas la fiche des Carottes. Il doit afficher, avec console.log, la fiche de chaque produit disponible.');
  if (sortie.indexOf('Poires Williams') !== -1 || sortie.indexOf('Yaourt au lait de chèvre') !== -1) aRevoir('boutique.js affiche aussi les produits épuisés. Utilisez produitsDisponibles de l\'exercice 3 pour ne garder que les produits en stock.');
  if (sortie.indexOf("Miel d'acacia (bio) : 11,08 € TTC / pot") === -1) aRevoir('boutique.js n\'affiche pas tous les produits disponibles (le Miel d\'acacia manque). Votre boucle doit aller jusqu\'au dernier.');
}

// ---------------------------------------------------------------------------
// Exercice 5 : bonus, map, filter et les erreurs
// ---------------------------------------------------------------------------

function verifierExercice5() {
  const fichier = 'exercice-5-bonus.js';
  const mod = charger(fichier);
  const produits = lireJson('produits.json');
  const source = lireSource(fichier);

  // Partie A : filter et map
  try {
    const produitsBio = fonction(mod, 'produitsBio', fichier);
    const catalogue = copie(produits);
    const bio = appeler(produitsBio, 'produitsBio', [catalogue], 'avec le catalogue');
    exigerTableau(bio, 'produitsBio(catalogue)');
    if (catalogue.length !== produits.length) aRevoir('produitsBio modifie le catalogue reçu. filter crée un nouveau tableau, renvoyez-le.');
    if (!memesIds(bio, [1, 4, 5, 7, 8, 10, 12])) {
      aRevoir(`produitsBio devrait renvoyer les 7 produits bio. Votre fonction renvoie : ${nomsObtenus(bio)}.`);
    }
    if (source.indexOf('.filter(') === -1) aRevoir('produitsBio donne le bon résultat, mais l\'exercice demande d\'utiliser filter.');

    const nomsDesProduits = fonction(mod, 'nomsDesProduits', fichier);
    const resultat = appeler(nomsDesProduits, 'nomsDesProduits', [copie(produits).slice(0, 3)], 'avec trois produits');
    exigerTableau(resultat, 'nomsDesProduits');
    const attendu = ['Pommes Reinette', 'Poires Williams', "Pruneaux d'Agen"];
    if (resultat.length === 3 && resultat.every(function (n) { return n === undefined; })) {
      aRevoir('nomsDesProduits renvoie un tableau de undefined. La fonction donnée à map doit renvoyer le nom : il manque return produit.nom.');
    }
    if (resultat.length !== 3 || resultat.some(function (n, i) { return n !== attendu[i]; })) {
      aRevoir(`nomsDesProduits pour les trois premiers produits devrait renvoyer ["${attendu.join('", "')}"]. Votre fonction renvoie ${JSON.stringify(resultat)}.`);
    }
    const vide = appeler(nomsDesProduits, 'nomsDesProduits', [[]], 'avec un tableau vide');
    exigerTableau(vide, 'nomsDesProduits([])');
    if (vide.length !== 0) aRevoir('nomsDesProduits([]) devrait renvoyer un tableau vide.');
    if (source.indexOf('.map(') === -1) aRevoir('nomsDesProduits donne le bon résultat, mais l\'exercice demande d\'utiliser map.');
  } catch (erreur) {
    if (erreur instanceof ARevoir) aRevoir(`partie A, ${erreur.message}`);
    throw erreur;
  }

  // Partie B : throw et try / catch
  try {
    verifierPartieB(mod, fichier, produits);
  } catch (erreur) {
    if (erreur instanceof ARevoir) aRevoir(`partie A OK. Partie B, ${erreur.message}`);
    throw erreur;
  }
}

function verifierPartieB(mod, fichier, produits) {
  const ajouterAuPanier = fonction(mod, 'ajouterAuPanier', fichier);
  function produit(id) {
    return copie(produits).filter(function (p) { return p.id === id; })[0];
  }

  // Un ajout valide : 2 bottes de radis (il en reste 3).
  let panier = [];
  let obtenu = appeler(ajouterAuPanier, 'ajouterAuPanier', [panier, produit(7), 2], 'pour 2 bottes de Radis');
  if (obtenu === undefined) aRevoir('ajouterAuPanier ne renvoie rien (undefined). La fonction n\'est pas encore écrite, ou il manque return panier.');
  exigerTableau(obtenu, 'ajouterAuPanier');
  const ligne = obtenu[obtenu.length - 1];
  if (obtenu.length !== 1 || !ligne || ligne.nom !== 'Radis' || ligne.prix !== 1.9 || ligne.quantite !== 2) {
    aRevoir(`après ajouterAuPanier([], radis, 2), le panier devrait contenir une seule ligne { nom: 'Radis', prix: 1.9, quantite: 2 }. Il contient ${JSON.stringify(obtenu)}.`);
  }

  // La limite exacte : 3 bottes de radis, tout le stock.
  obtenu = appeler(ajouterAuPanier, 'ajouterAuPanier', [[], produit(7), 3], 'pour 3 bottes de Radis (tout le stock)');
  exigerTableau(obtenu, 'ajouterAuPanier');
  if (obtenu.length !== 1) aRevoir('ajouterAuPanier doit accepter une quantité égale au stock (3 bottes de Radis quand il en reste 3).');

  // Les quantités refusées.
  const refus = [
    [7, 0, 'une quantité de 0'],
    [7, -1, 'une quantité de -1'],
    [7, 2.5, 'une quantité de 2.5 (pas un nombre entier)'],
    [7, 4, '4 bottes de Radis alors qu\'il en reste 3'],
    [2, 1, '1 kg de Poires Williams, dont le stock est à 0'],
  ];
  for (let i = 0; i < refus.length; i++) {
    panier = [{ nom: 'Carottes', prix: 1.8, quantite: 1 }];
    let erreurLevee = null;
    let aLeve = false;
    try {
      ajouterAuPanier(panier, produit(refus[i][0]), refus[i][1]);
    } catch (erreur) {
      aLeve = true;
      erreurLevee = erreur;
    }
    if (!aLeve) aRevoir(`ajouterAuPanier accepte ${refus[i][2]}. Elle doit refuser en levant une erreur : throw new Error('...').`);
    if (erreurLevee && erreurLevee.message === 'À compléter') aRevoir('la fonction ajouterAuPanier n\'est pas encore écrite.');
    const message = typeof erreurLevee === 'string' ? erreurLevee : (erreurLevee && erreurLevee.message);
    if (!message) aRevoir(`ajouterAuPanier refuse bien ${refus[i][2]}, mais l'erreur n'a pas de message. Écrivez throw new Error('un message clair').`);
    if (!(erreurLevee instanceof Error) && typeof erreurLevee !== 'string') aRevoir(`ajouterAuPanier refuse ${refus[i][2]}, mais l'erreur levée n'est pas une Error. Écrivez throw new Error('un message clair').`);
    if (!(erreurLevee instanceof Error) && typeof erreurLevee === 'string') {
      // On accepte throw 'texte', mais new Error est préférable. Pas de refus ici.
    } else if (/is not defined|Cannot read|is not a function/.test(message)) {
      aRevoir(`ajouterAuPanier plante avec ${refus[i][2]} au lieu de lever votre propre erreur : ${traduireErreur(erreurLevee)}`);
    }
    if (panier.length !== 1) aRevoir(`ajouterAuPanier refuse ${refus[i][2]}, mais la ligne a quand même été ajoutée au panier. Faites les vérifications avant le push.`);
  }

  // essayerAjout : ne plante jamais, renvoie un message.
  const essayerAjout = fonction(mod, 'essayerAjout', fichier);
  let message;
  try {
    message = essayerAjout([], produit(7), 2);
  } catch (erreur) {
    if (erreur && erreur.message === 'À compléter') aRevoir('la fonction essayerAjout n\'est pas encore écrite.');
    aRevoir(`essayerAjout plante pour 2 bottes de Radis : ${traduireErreur(erreur)}`);
  }
  if (message === undefined) aRevoir('essayerAjout ne renvoie rien (undefined). La fonction n\'est pas encore écrite, ou il manque return.');
  if (message !== '2 x Radis ajouté au panier') aRevoir(`essayerAjout([], radis, 2) devrait renvoyer "2 x Radis ajouté au panier", et renvoie ${decrire(message)}.`);

  try {
    message = essayerAjout([], produit(7), 4);
  } catch (erreur) {
    aRevoir('essayerAjout plante quand la quantité est trop grande. Elle ne doit jamais planter : appelez ajouterAuPanier dans un bloc try, et renvoyez le message dans le catch.');
  }
  if (typeof message !== 'string' || message.indexOf('Impossible : ') !== 0) {
    aRevoir(`essayerAjout([], radis, 4) devrait renvoyer un texte qui commence par "Impossible : ", suivi du message de l'erreur. Elle renvoie ${decrire(message)}.`);
  }
  if (message.length <= 'Impossible : '.length || /undefined/.test(message)) {
    aRevoir(`essayerAjout renvoie "${message}". Le message de l'erreur manque : dans le catch, utilisez erreur.message.`);
  }
}

// ---------------------------------------------------------------------------
// Lancement
// ---------------------------------------------------------------------------

const EXERCICES = [
  { numero: 1, titre: 'Le prix TTC', verifier: verifierExercice1 },
  { numero: 2, titre: 'Le panier et la livraison', verifier: verifierExercice2 },
  { numero: 3, titre: 'Le catalogue', verifier: verifierExercice3 },
  { numero: 4, titre: 'Les modules', verifier: verifierExercice4 },
  { numero: 5, titre: 'Bonus, map, filter et les erreurs', verifier: verifierExercice5 },
];

// Mode « un seul exercice », lancé par le mode principal ci-dessous.
function verifierUn(numero) {
  const exercice = EXERCICES.filter(function (e) { return e.numero === numero; })[0];
  let resultat;
  try {
    exercice.verifier();
    resultat = { ok: true };
  } catch (erreur) {
    if (erreur instanceof ARevoir) resultat = { ok: false, message: erreur.message };
    else resultat = { ok: false, message: `le vérificateur a rencontré un problème imprévu : ${traduireErreur(erreur)} Montrez ce message au formateur.` };
  }
  process.stdout.write('\n' + MARQUEUR + JSON.stringify(resultat) + '\n');
}

function verifierTout() {
  console.log('Vérification de l\'atelier 1 : JavaScript, les bases');
  console.log('');
  const resultats = {};
  let nbOk = 0;
  for (let i = 0; i < EXERCICES.length; i++) {
    const exercice = EXERCICES[i];
    const lancement = spawnSync(process.execPath, [__filename, '--exercice', String(exercice.numero)], {
      cwd: DOSSIER,
      encoding: 'utf8',
      timeout: DELAI_MS,
    });
    let resultat;
    if (lancement.error && lancement.error.code === 'ETIMEDOUT') {
      resultat = { ok: false, message: 'votre code ne s\'arrête pas. Une boucle tourne sans fin ? Vérifiez la condition de vos boucles while et for.' };
    } else {
      const lignes = String(lancement.stdout || '').split('\n').filter(function (l) { return l.indexOf(MARQUEUR) === 0; });
      if (lignes.length > 0) resultat = JSON.parse(lignes[lignes.length - 1].slice(MARQUEUR.length));
      else resultat = { ok: false, message: 'votre code arrête le programme (process.exit ?) avant la fin de la vérification.' };
    }
    if (!resultat.ok && exercice.numero === 2 && resultats[1] && !resultats[1].ok) {
      resultat.message += ' Ce fichier se sert de l\'exercice 1, qui n\'est pas encore OK : commencez par lui.';
    }
    if (!resultat.ok && exercice.numero === 4 && ((resultats[1] && !resultats[1].ok) || (resultats[3] && !resultats[3].ok))) {
      resultat.message += ' Cet exercice se sert des exercices 1 et 3, qui ne sont pas encore tous OK : commencez par eux.';
    }
    resultats[exercice.numero] = resultat;
    const entete = `Exercice ${exercice.numero} (${exercice.titre}) : `;
    if (resultat.ok) {
      nbOk++;
      console.log(entete + 'OK');
    } else {
      console.log(entete + 'À revoir : ' + resultat.message);
    }
  }
  console.log('');
  console.log(`${nbOk} exercice(s) OK sur ${EXERCICES.length}. Les exercices 1 et 2 sont indispensables, 3 et 4 souhaitables, 5 en bonus.`);
}

const position = process.argv.indexOf('--exercice');
if (position !== -1) verifierUn(Number(process.argv[position + 1]));
else verifierTout();
