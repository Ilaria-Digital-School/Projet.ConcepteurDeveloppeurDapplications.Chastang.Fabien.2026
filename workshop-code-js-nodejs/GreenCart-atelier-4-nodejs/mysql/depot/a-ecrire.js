// Fabrique l'erreur 501 « pas encore écrit » des fonctions du dépôt.
// Quand toutes vos fonctions sont écrites, ce fichier ne sert plus.
function aEcrire(fonction, fichier) {
  const err = new Error(`Fonction à écrire : ${fonction}() dans ${fichier}`);
  err.status = 501;
  return err;
}

module.exports = aEcrire;
