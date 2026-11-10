// Crée un utilisateur, actif par défaut.
function creerUtilisateur(nom, email) {
  return { nom, email, actif: true };
}

// Garde seulement les utilisateurs actifs.
function filtrerActifs(utilisateurs) {
  return utilisateurs.filter((u) => u.actif);
}

module.exports = { creerUtilisateur, filtrerActifs };
