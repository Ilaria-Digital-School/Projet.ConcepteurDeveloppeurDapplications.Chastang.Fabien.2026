// Bonus JWT : connexion. POST /api/auth/connexion avec { "email", "motDePasse" }
// Compte de test chargé dans la base : admin@greencart.test, mot de passe greencart
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const depot = require('../depot/utilisateurs');

const SECRET = process.env.JWT_SECRET || 'secret-de-developpement';

const connexion = async (req, res, next) => {
  try {
    const { email, motDePasse } = req.body || {};

    // Bonus : remplacez la ligne res.status(501) par ces étapes (voir l'énoncé, exercice 5).
    //
    // 1. Si email ou motDePasse n'est pas un texte (typeof ... !== 'string') : 400
    //
    // 2. const utilisateur = await depot.trouverParEmail(email);
    //
    // 3. Comparer le mot de passe reçu avec l'empreinte stockée :
    //      const motDePasseOk = utilisateur ? await bcrypt.compare(motDePasse, utilisateur.motDePasseHash) : false;
    //    Si ce n'est pas bon : 401 avec { message: 'Email ou mot de passe incorrect' }
    //
    // 4. Fabriquer le jeton et le renvoyer :
    //      const token = jwt.sign({ id: String(utilisateur.id), email: utilisateur.email, role: utilisateur.role }, SECRET, { expiresIn: '2h' });
    //      res.json({ token: token });

    res.status(501).json({ message: 'À écrire (bonus) : connexion dans controllers/auth.controller.js' });
  } catch (err) {
    next(err);
  }
};

module.exports = { connexion };
