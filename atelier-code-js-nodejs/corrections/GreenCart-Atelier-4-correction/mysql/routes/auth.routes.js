// routes/auth.routes.js : bonus JWT, la route de connexion.
const express = require('express');
const router = express.Router();
const controleur = require('../controllers/auth.controller');

router.post('/connexion', controleur.connexion);

module.exports = router;
