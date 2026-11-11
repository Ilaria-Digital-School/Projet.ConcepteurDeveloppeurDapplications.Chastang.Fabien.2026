// Exercice 3 : le catalogue (souhaitable). CORRIGÉ
//
// À retenir : trois parcours de tableau d'objets avec for, comme les
// exercices 16, 31 et 32 du cours (slides 92 et 96). find, filter et
// includes font la même chose plus court : vous les verrez en bonus.

// Renvoie l'élément de la liste qui a cet id, ou null.
// À retenir : un else { return null } dans la boucle arrêterait la
// recherche dès le premier élément. Le return null va après la boucle.
function trouverParId(liste, id) {
  for (let i = 0; i < liste.length; i++) {
    if (liste[i].id === id) {
      return liste[i];
    }
  }
  return null;
}

// Renvoie les produits dont le nom contient le texte, sans tenir compte des
// majuscules.
// À retenir : toLowerCase et indexOf sont aux slides 44 et 45.
// includes marche aussi, même s'il n'est pas dans le cours.
// Piège fréquent : ne mettre en minuscules que le nom, ou que le texte.
function rechercherParNom(catalogue, texte) {
  const resultat = [];
  const cherche = texte.toLowerCase();
  for (let i = 0; i < catalogue.length; i++) {
    const nom = catalogue[i].nom.toLowerCase();
    if (nom.indexOf(cherche) !== -1) {
      resultat.push(catalogue[i]);
    }
  }
  return resultat;
}

// Renvoie les produits dont le stock est supérieur à 0.
// À retenir : on construit un nouveau tableau. Un splice sur le catalogue
// le modifierait, et sauterait un élément quand deux produits épuisés se
// suivent. Le vérificateur repère cette modification.
function produitsDisponibles(catalogue) {
  const disponibles = [];
  for (let i = 0; i < catalogue.length; i++) {
    if (catalogue[i].stock > 0) {
      disponibles.push(catalogue[i]);
    }
  }
  return disponibles;
}

module.exports = { trouverParId, rechercherParNom, produitsDisponibles };

if (require.main === module) {
  const catalogue = require('./donnees/produits.json');
  const producteurs = require('./donnees/producteurs.json');
  console.log(trouverParId(catalogue, 9));
  console.log(trouverParId(producteurs, 4));
  console.log(trouverParId(catalogue, 99));
  console.log(rechercherParNom(catalogue, 'pomme'));
  console.log(produitsDisponibles(catalogue).length); // 10
}
