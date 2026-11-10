// routes/commande.routes.js : exercice 4.
const express = require('express');
const router = express.Router();
const controleur = require('../controllers/commande.controller');
const validerCommande = require('../middlewares/validation-commande.middleware');

// La validation de la commande est un middleware local, comme celle du produit.
router.post('/', validerCommande, controleur.passerCommande);
router.get('/:id', controleur.afficherCommande);

module.exports = router;
