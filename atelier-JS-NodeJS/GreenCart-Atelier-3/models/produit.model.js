// models/produit.model.js : les données des produits (cours Node.js, slide 22).
//
// Dans le cours, le modèle parle à MongoDB avec Mongoose (slides 36 à 39).
// Ici, pas encore de base : les produits sont lus dans data/produits.json
// et gardés en mémoire, dans un tableau. Chaque redémarrage du serveur
// remet le catalogue d'origine. L'atelier 4 branchera une vraie base.
//
// Ce fichier est fourni complet. Vous n'avez pas à le modifier.

const fs = require('fs');
const path = require('path');

const fichier = path.join(__dirname, '..', 'data', 'produits.json');
const produits = JSON.parse(fs.readFileSync(fichier, 'utf8'));

// Renvoie le tableau de tous les produits.
const trouverTous = () => {
  return produits;
};

// Renvoie le produit qui a cet id, ou null s'il n'existe pas.
const trouverParId = (id) => {
  for (let i = 0; i < produits.length; i++) {
    if (produits[i].id === id) {
      return produits[i];
    }
  }
  return null;
};

// Calcule le prochain id libre : le plus grand id existant, plus 1.
const prochainId = () => {
  let max = 0;
  for (let i = 0; i < produits.length; i++) {
    if (produits[i].id > max) {
      max = produits[i].id;
    }
  }
  return max + 1;
};

// Ajoute un produit et le renvoie, avec son nouvel id.
const creer = (donnees) => {
  const produit = {
    id: prochainId(),
    nom: donnees.nom,
    categorie: donnees.categorie,
    prix: donnees.prix,
    unite: donnees.unite,
    stock: donnees.stock,
    bio: donnees.bio === true,
    producteurId: donnees.producteurId || null
  };
  produits.push(produit);
  return produit;
};

// Remplace entièrement le produit qui a cet id (c'est le sens de PUT).
// Renvoie le produit modifié, ou null s'il n'existe pas.
const remplacer = (id, donnees) => {
  for (let i = 0; i < produits.length; i++) {
    if (produits[i].id === id) {
      produits[i] = {
        id: id,
        nom: donnees.nom,
        categorie: donnees.categorie,
        prix: donnees.prix,
        unite: donnees.unite,
        stock: donnees.stock,
        bio: donnees.bio === true,
        producteurId: donnees.producteurId || null
      };
      return produits[i];
    }
  }
  return null;
};

// Supprime le produit qui a cet id.
// Renvoie true s'il a été supprimé, false s'il n'existait pas.
const supprimer = (id) => {
  for (let i = 0; i < produits.length; i++) {
    if (produits[i].id === id) {
      produits.splice(i, 1);
      return true;
    }
  }
  return false;
};

module.exports = { trouverTous, trouverParId, creer, remplacer, supprimer };
