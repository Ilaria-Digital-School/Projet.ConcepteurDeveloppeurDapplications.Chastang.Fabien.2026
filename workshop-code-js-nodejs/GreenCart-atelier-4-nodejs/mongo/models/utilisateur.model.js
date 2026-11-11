// Schéma et modèle d'un utilisateur, pour le bonus JWT.
// Le mot de passe n'est jamais stocké en clair : seulement son empreinte bcrypt.
const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  motDePasseHash: { type: String, required: true },
  role: { type: String, default: 'client' },
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

module.exports = Utilisateur;
