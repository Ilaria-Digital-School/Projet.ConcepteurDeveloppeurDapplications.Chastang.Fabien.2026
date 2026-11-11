// depot/produits.js : les produits, version MongoDB (exercices 1 et 2).
// Il remplace le modèle en mémoire de l'atelier 3, avec les mêmes noms de fonctions :
// trouverTous, trouverParId, creer, remplacer, supprimer.
// Chaque fonction parle à la base avec le modèle Mongoose (cours, slides 38 et 39).
const mongoose = require('mongoose');
const Produit = require('../models/produit.model');
const Producteur = require('../models/producteur.model');

// Déjà écrite. Un id qui n'a pas la forme d'un ObjectId ne peut correspondre à rien.
function idValide(id) {
  return mongoose.isValidObjectId(id);
}

// Déjà écrite. Garde seulement les champs d'un produit, comme le modèle de l'atelier 3.
// Rien d'autre que ces champs ne part en base.
function champsProduit(donnees) {
  return {
    nom: donnees.nom,
    categorie: donnees.categorie,
    prix: donnees.prix,
    unite: donnees.unite || null,
    stock: donnees.stock,
    bio: donnees.bio === true,
    producteurId: donnees.producteurId || null
  };
}

// Exercice 1 : tous les produits, ou ceux d'une catégorie
async function trouverTous(filtres) {
  const critere = {};
  if (filtres && filtres.categorie) {
    // String() : on cherche toujours un texte, jamais un objet envoyé par le client
    critere.categorie = String(filtres.categorie);
  }
  return Produit.find(critere); // GET -> find() (slide 39)
}

// Exercice 1 : le produit qui a cet id, ou null
async function trouverParId(id) {
  if (!idValide(id)) return null;
  return Produit.findById(id);
}

// MongoDB ne vérifie pas que le producteur existe (pas de clé étrangère) : on le fait ici
async function verifierProducteur(producteurId) {
  if (!idValide(producteurId) || !(await Producteur.exists({ _id: producteurId }))) {
    const err = new Error("Le producteur indiqué n'existe pas");
    err.status = 400;
    throw err;
  }
}

// Exercice 2 : crée le produit et le renvoie, avec son id
async function creer(donnees) {
  const produit = champsProduit(donnees);
  await verifierProducteur(produit.producteurId);
  return Produit.create(produit); // POST -> create() (slide 39)
}

// Exercice 2 : remplace le produit, renvoie le produit modifié ou null
async function remplacer(id, donnees) {
  if (!idValide(id)) return null;
  const produit = champsProduit(donnees);
  await verifierProducteur(produit.producteurId);
  // new: true renvoie le document APRÈS modification
  return Produit.findByIdAndUpdate(id, produit, { new: true, runValidators: true });
}

// Exercice 2 : supprime le produit, renvoie true s'il existait
async function supprimer(id) {
  if (!idValide(id)) return false;
  const produit = await Produit.findByIdAndDelete(id);
  return produit !== null;
}

module.exports = { trouverTous, trouverParId, creer, remplacer, supprimer };
