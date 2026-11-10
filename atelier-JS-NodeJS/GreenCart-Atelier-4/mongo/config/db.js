// Connexion à MongoDB avec Mongoose (cours Node.js et Express, slide 36).
// Ce fichier est déjà écrit : vous n'avez pas à le modifier.
const mongoose = require('mongoose');

const URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27118/greencart';

// Si la base ne répond pas, une requête échoue au bout de 3 secondes au lieu d'attendre.
mongoose.set('bufferTimeoutMS', 3000);

async function connecter() {
  try {
    await mongoose.connect(URI, { serverSelectionTimeoutMS: 3000 });
    console.log('Base MongoDB connectée.');
  } catch (err) {
    console.log('La base MongoDB ne répond pas. Avez-vous lancé "docker compose up -d" ? Nouvel essai dans 5 secondes.');
    setTimeout(connecter, 5000);
  }
}

// Utilisé par la route GET /api/sante
async function estConnectee() {
  return mongoose.connection.readyState === 1;
}

// Utilisé par le middleware d'erreur : traduit une erreur de MongoDB en { status, message }.
// Renvoie null si l'erreur ne vient pas de la base.
function erreurDeLaBase(err) {
  // Un identifiant qui n'a pas la forme d'un ObjectId MongoDB
  if (err.name === 'CastError') {
    return { status: 400, message: `Valeur invalide pour ${err.path}` };
  }
  // Une règle du schéma Mongoose n'est pas respectée (unité absente, producteur manquant...)
  if (err.name === 'ValidationError') {
    return { status: 400, message: 'Donnée refusée par la base, vérifiez : ' + Object.keys(err.errors).join(', ') };
  }
  // La base ne répond pas
  if (err.name === 'MongooseServerSelectionError' || /buffering timed out/.test(err.message)) {
    return { status: 503, message: 'La base MongoDB ne répond pas. Lancez "docker compose up -d".' };
  }
  return null;
}

module.exports = { connecter, estConnectee, erreurDeLaBase, NOM_BASE: 'mongo' };
