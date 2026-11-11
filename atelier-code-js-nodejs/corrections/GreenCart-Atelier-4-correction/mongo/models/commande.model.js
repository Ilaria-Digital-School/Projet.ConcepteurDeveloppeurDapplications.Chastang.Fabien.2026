// Schéma et modèle d'une commande (cours Node.js et Express, slides 37 et 38).
// Les lignes sont rangées DANS la commande : c'est l'intérêt d'un document MongoDB.
const mongoose = require('mongoose');
const formatJson = require('./format-json');

const ligneSchema = new mongoose.Schema(
  {
    produitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true },
    quantite: { type: Number, required: true, min: 1 },
    prixUnitaireHT: { type: Number, required: true }, // le prix au moment de la commande
  },
  { _id: false }
);

const commandeSchema = new mongoose.Schema({
  client: { type: String, required: true, trim: true },
  statut: { type: String, enum: ['en_attente', 'validee', 'livree'], default: 'en_attente' },
  lignes: { type: [ligneSchema], required: true },
  totalHT: { type: Number, required: true },
  totalTTC: { type: Number, required: true },
  fraisLivraison: { type: Number, required: true },
  montantAPayer: { type: Number, required: true },
  creeLe: { type: Date, default: Date.now },
});

commandeSchema.set('toJSON', formatJson);

const Commande = mongoose.model('Commande', commandeSchema);

module.exports = Commande;
