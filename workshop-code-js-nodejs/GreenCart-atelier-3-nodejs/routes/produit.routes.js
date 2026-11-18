// routes/produit.routes.js : les chemins de l'API des produits (slides 23 à 25).
// Une route = une URL + une méthode HTTP + une action (slide 24).
// Les actions sont dans le contrôleur.
const express = require('express');
const router = express.Router();
const controleur = require('../controllers/produit.controller');

// Exercice 4.2 : retirez les // devant cette ligne quand vous en avez besoin.
const validerProduit = require('../middlewares/validation.middleware');

// Données en exemple : la liste et le détail d'un produit.
// Le chemin '/' veut dire /api/produits, car app.js monte ce fichier sur /api/produits.
router.get('/', controleur.listerProduits);
router.get('/:id', controleur.afficherProduit);

// Exercice 2 : la route POST qui ajoute un produit.
router.post('/', validerProduit, controleur.creerProduit);

// Exercice 3 : les routes PUT et DELETE sur un produit précis (/:id).
router.put('/:id', validerProduit, controleur.modifierProduit);
router.delete('/:id',  controleur.supprimerProduit);

module.exports = router;
