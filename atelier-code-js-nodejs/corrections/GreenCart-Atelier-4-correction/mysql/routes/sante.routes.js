// GET /api/sante : le serveur répond-il, la base est-elle joignable ?
// Utilisée par verifier.js. Déjà écrite.
const express = require('express');
const { estConnectee, NOM_BASE } = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  const connectee = await estConnectee();
  res.status(connectee ? 200 : 503).json({ api: 'ok', base: NOM_BASE, connectee: connectee });
});

module.exports = router;
