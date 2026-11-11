// routes/produit.routes.js : les chemins de l'API des produits (slides 23 à 25).
// Repris de l'atelier 3. Une route = une URL + une méthode HTTP + une action (slide 24).
// Les actions sont dans le contrôleur.
const express = require('express');
const router = express.Router();
const controleur = require('../controllers/produit.controller');
const validerProduit = require('../middlewares/validation.middleware');
const verifierToken = require('../middlewares/auth.middleware'); // bonus

router.get('/', controleur.listerProduits);
router.get('/:id', controleur.afficherProduit);

// La validation est un middleware local (slide 29), seulement sur les routes qui reçoivent un produit.
// Bonus : verifierToken est un middleware local lui aussi, placé avant la validation.
router.post('/', verifierToken, validerProduit, controleur.creerProduit);
router.put('/:id', verifierToken, validerProduit, controleur.modifierProduit);
router.delete('/:id', verifierToken, controleur.supprimerProduit);

module.exports = router;
