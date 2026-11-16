// Exercice 4, deuxième fichier : la boutique (souhaitable)
//
// Ce fichier est le programme principal. Lancez-le avec :  node boutique.js
// Il doit afficher la fiche de chaque produit disponible, une par ligne.
//
// Étape 1 : importez le catalogue (déjà fait pour vous).
const catalogue = require('./donnees/produits.json');

// Étape 2 : importez produitsDisponibles depuis exercice-3-catalogue.js
//           et ficheProduit depuis exercice-4-fiche.js

const { produitsDisponibles } = require('./exercice-3-catalogue');
const { ficheProduit } = require('./exercice-4-fiche');

// Étape 3 : affichez un titre, puis, la fiche de chaque produit disponible.

const disponibles = produitsDisponibles(catalogue);

console.log(`GreenCart : ${disponibles.length}\n`);

disponibles.forEach(disponible => console.log(ficheProduit(disponible)));
