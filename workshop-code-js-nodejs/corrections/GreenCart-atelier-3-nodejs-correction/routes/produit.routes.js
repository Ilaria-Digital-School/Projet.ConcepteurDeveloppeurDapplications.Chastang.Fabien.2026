// routes/produit.routes.js : les chemins de l'API des produits (slides 23 à 25).
// Une route = une URL + une méthode HTTP + une action (slide 24).
// Les actions sont dans le contrôleur.
const express = require('express');
const router = express.Router();
const controleur = require('../controllers/produit.controller');
const validerProduit = require('../middlewares/validation.middleware');

// Données en exemple : la liste et le détail d'un produit.
router.get('/', controleur.listerProduits);
router.get('/:id', controleur.afficherProduit);

// CORRIGÉ 2 et 4.2 : la validation est un middleware local (slide 29).
// Elle passe avant le contrôleur, seulement sur les routes qui reçoivent un produit.
router.post('/', validerProduit, controleur.creerProduit);

// CORRIGÉ 3 et 4.2
router.put('/:id', validerProduit, controleur.modifierProduit);
router.delete('/:id', controleur.supprimerProduit);

module.exports = router;
