// Exercice 4, deuxième fichier : la boutique (souhaitable). CORRIGÉ
//
// À retenir : ce fichier ne contient aucun calcul. Il assemble les
// modules des exercices 1, 3 et 4. Vous retrouverez cette idée à l'atelier
// Express, où server.js importe app.js.

const catalogue = require('./donnees/produits.json');
const { produitsDisponibles } = require('./exercice-3-catalogue');
const { ficheProduit } = require('./exercice-4-fiche');

const disponibles = produitsDisponibles(catalogue);

console.log('GreenCart : ' + disponibles.length + ' produits disponibles');
for (let i = 0; i < disponibles.length; i++) {
  console.log(ficheProduit(disponibles[i]));
}
