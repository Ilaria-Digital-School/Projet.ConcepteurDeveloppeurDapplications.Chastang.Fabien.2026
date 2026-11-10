// Schéma et modèle d'un produit (cours Node.js et Express, slides 37 et 38).
const mongoose = require('mongoose');
const formatJson = require('./format-json');

const produitSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  categorie: { type: String, required: true, enum: ['fruits', 'legumes', 'cremerie', 'epicerie'] },
  prix: { type: Number, required: true, min: 0 }, // prix HT en euros
  unite: { type: String, required: true, enum: ['kg', 'piece', 'botte', 'pot'] },
  stock: { type: Number, required: true, min: 0 },
  bio: { type: Boolean, default: false },
  // Le lien vers le producteur : son ObjectId (l'équivalent d'une clé étrangère)
  producteurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producteur', required: true },
});

produitSchema.set('toJSON', formatJson);

const Produit = mongoose.model('Produit', produitSchema);

module.exports = Produit;
