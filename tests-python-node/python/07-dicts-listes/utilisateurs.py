"""Des utilisateurs, sous forme de dictionnaires."""


def creer_utilisateur(nom, email):
    """Crée un utilisateur, actif par défaut."""
    return {"nom": nom, "email": email, "actif": True}


def filtrer_actifs(utilisateurs):
    """Garde seulement les utilisateurs actifs."""
    return [u for u in utilisateurs if u["actif"]]
