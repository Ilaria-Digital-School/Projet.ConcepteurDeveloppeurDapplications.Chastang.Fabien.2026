// depot/produits.js : les produits, version MongoDB (exercices 1 et 2).
// Il remplace le modèle en mémoire de l'atelier 3, avec les mêmes noms de fonctions :
// trouverTous, trouverParId, creer, remplacer, supprimer.
// Chaque fonction parle à la base avec le modèle Mongoose Produit (cours, slides 38 et 39).
// Le contrôleur controllers/produit.controller.js appelle déjà ces fonctions : ne changez pas leurs noms.
const mongoose = require('mongoose');
const Produit = require('../models/produit.model');
const Producteur = require('../models/producteur.model');
const aEcrire = require('./a-ecrire');

// Déjà écrite. Un id qui n'a pas la forme d'un ObjectId ne peut correspondre à rien.
// Utilisez-la au début de trouverParId, remplacer et supprimer : if (!idValide(id)) return null;
function idValide(id) {
  return mongoose.isValidObjectId(id);
}

// Déjà écrite. Garde seulement les champs d'un produit, comme le modèle de l'atelier 3.
// Utilisation : const produit = champsProduit(donnees);
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

// Déjà écrite. MongoDB ne vérifie pas que le producteur existe (pas de clé étrangère).
// Appelez-la dans creer et remplacer : await verifierProducteur(produit.producteurId);
async function verifierProducteur(producteurId) {
  if (!idValide(producteurId) || !(await Producteur.exists({ _id: producteurId }))) {
    const err = new Error("Le producteur indiqué n'existe pas");
    err.status = 400;
    throw err;
  }
}

// Exercice 1 : renvoie tous les produits, ou seulement ceux d'une catégorie.
// filtres.categorie vaut par exemple 'legumes', ou undefined s'il n'y a pas de filtre.
async function trouverTous(filtres) {
  throw aEcrire('trouverTous', 'depot/produits.js');
}

// Exercice 1 : renvoie le produit qui a cet id, ou null s'il n'existe pas.
async function trouverParId(id) {
  throw aEcrire('trouverParId', 'depot/produits.js');
}

// Exercice 2 : crée le produit et le renvoie (avec son id).
// donnees est le corps de la requête : passez-le d'abord dans champsProduit.
async function creer(donnees) {
  throw aEcrire('creer', 'depot/produits.js');
}

// Exercice 2 : remplace le produit et renvoie sa version APRÈS modification, ou null s'il n'existe pas.
async function remplacer(id, donnees) {
  throw aEcrire('remplacer', 'depot/produits.js');
}

// Exercice 2 : supprime le produit. Renvoie true s'il existait, false sinon.
async function supprimer(id) {
  throw aEcrire('supprimer', 'depot/produits.js');
}

module.exports = { trouverTous, trouverParId, creer, remplacer, supprimer };
