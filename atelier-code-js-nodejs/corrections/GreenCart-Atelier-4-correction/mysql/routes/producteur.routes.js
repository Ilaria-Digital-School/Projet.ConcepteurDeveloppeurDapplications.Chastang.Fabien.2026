// routes/producteur.routes.js : exercice 3, sur le modèle de produit.routes.js.
const express = require('express');
const router = express.Router();
const controleur = require('../controllers/producteur.controller');
const validerProducteur = require('../middlewares/validation-producteur.middleware');

router.get('/', controleur.listerProducteurs);
router.get('/:id', controleur.afficherProducteur);
router.get('/:id/produits', controleur.listerProduitsDuProducteur);
router.post('/', validerProducteur, controleur.creerProducteur);
router.put('/:id', validerProducteur, controleur.modifierProducteur);
router.delete('/:id', controleur.supprimerProducteur);

module.exports = router;
