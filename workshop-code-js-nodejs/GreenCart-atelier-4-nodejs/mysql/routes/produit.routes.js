// routes/produit.routes.js : les chemins de l'API des produits (slides 23 à 25).
// Repris de l'atelier 3. Une route = une URL + une méthode HTTP + une action (slide 24).
// Les actions sont dans le contrôleur.
const express = require('express');
const router = express.Router();
const controleur = require('../controllers/produit.controller');
const validerProduit = require('../middlewares/validation.middleware');
// Bonus JWT : décommentez la ligne suivante, puis ajoutez verifierToken aux routes POST, PUT et DELETE
// const verifierToken = require('../middlewares/auth.middleware');

router.get('/', controleur.listerProduits);
router.get('/:id', controleur.afficherProduit);

// La validation est un middleware local (slide 29).
// Elle passe avant le contrôleur, seulement sur les routes qui reçoivent un produit.
router.post('/', validerProduit, controleur.creerProduit);
router.put('/:id', validerProduit, controleur.modifierProduit);
router.delete('/:id', controleur.supprimerProduit);

module.exports = router;
