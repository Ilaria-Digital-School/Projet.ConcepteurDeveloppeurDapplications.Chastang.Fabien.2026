// Exercice 4 : les modules (souhaitable). CORRIGÉ
//
// À retenir : l'essentiel de l'exercice est l'aller-retour
// module.exports (dans un fichier) et require (dans l'autre), comme app.js
// et server.js dans le cours Node.js (slide 14). La mise en forme du prix
// est un exercice de String en plus.

// Étape 1 : l'import. Le chemin commence par ./ et l'extension .js est facultative.
const { prixTTC } = require('./exercice-1-prix');

// Étape 2 : la fiche.
// À retenir : toFixed(2) garantit deux décimales (1.9 devient "1.90").
// replace('.', ',') est à la slide 46. Les gabarits `${...}` marchent aussi
// bien que la concaténation avec +.
function ficheProduit(produit) {
  const prix = prixTTC(produit.prix).toFixed(2).replace('.', ',');
  let fiche = produit.nom;
  if (produit.bio) {
    fiche = fiche + ' (bio)';
  }
  fiche = fiche + ' : ' + prix + ' € TTC / ' + produit.unite;
  if (produit.stock === 0) {
    fiche = fiche + ' (épuisé)';
  }
  return fiche;
}

// Étape 3 : l'export. Piège fréquent : module.exports = ficheProduit, sans
// accolades. boutique.js fait alors un require avec accolades et reçoit
// undefined. Le vérificateur l'explique.
module.exports = { ficheProduit };

if (require.main === module) {
  const carottes = { id: 4, nom: 'Carottes', categorie: 'legumes', prix: 1.8, unite: 'kg', stock: 60, bio: true, producteurId: 1 };
  console.log(ficheProduit(carottes)); // Carottes (bio) : 1,90 € TTC / kg
}
