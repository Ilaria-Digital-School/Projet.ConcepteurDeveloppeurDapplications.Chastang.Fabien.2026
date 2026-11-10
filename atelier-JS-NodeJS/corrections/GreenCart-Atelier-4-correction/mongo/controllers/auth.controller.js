// Bonus JWT : connexion. POST /api/auth/connexion avec { "email", "motDePasse" }
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const depot = require('../depot/utilisateurs');

const SECRET = process.env.JWT_SECRET || 'secret-de-developpement';

const connexion = async (req, res, next) => {
  try {
    const { email, motDePasse } = req.body || {};

    // On exige deux textes. Avec MongoDB, cela bloque aussi un objet comme { "$ne": null }
    if (typeof email !== 'string' || typeof motDePasse !== 'string') {
      return res.status(400).json({ message: 'Email et mot de passe obligatoires' });
    }

    // 1. Retrouver l'utilisateur par son email
    const utilisateur = await depot.trouverParEmail(email);

    // 2. Comparer le mot de passe reçu avec l'empreinte stockée
    const motDePasseOk = utilisateur ? await bcrypt.compare(motDePasse, utilisateur.motDePasseHash) : false;

    // Même message dans les deux cas : on ne révèle pas si l'email existe
    if (!motDePasseOk) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // 3. Fabriquer le jeton, valable 2 heures
    const token = jwt.sign(
      { id: String(utilisateur.id), email: utilisateur.email, role: utilisateur.role },
      SECRET,
      { expiresIn: '2h' }
    );
    res.json({ token: token });
  } catch (err) {
    next(err);
  }
};

module.exports = { connexion };
