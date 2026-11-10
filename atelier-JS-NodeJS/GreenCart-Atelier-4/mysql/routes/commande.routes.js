// routes/commande.routes.js : exercice 4. Déjà écrites.
const express = require('express');
const router = express.Router();
const controleur = require('../controllers/commande.controller');

router.post('/', controleur.passerCommande);
router.get('/:id', controleur.afficherCommande);

module.exports = router;
