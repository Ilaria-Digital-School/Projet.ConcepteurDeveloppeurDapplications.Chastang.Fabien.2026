// Schéma et modèle d'un producteur (cours Node.js et Express, slides 37 et 38).
const mongoose = require('mongoose');
const formatJson = require('./format-json');

const producteurSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  ville: { type: String, required: true, trim: true },
});

producteurSchema.set('toJSON', formatJson);

const Producteur = mongoose.model('Producteur', producteurSchema);

module.exports = Producteur;
