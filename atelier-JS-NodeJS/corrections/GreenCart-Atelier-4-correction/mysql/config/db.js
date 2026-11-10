// Connexion à MySQL avec mysql2 (version "promise", pour utiliser await).
// Ce fichier est déjà écrit : vous n'avez pas à le modifier.
const mysql = require('mysql2/promise');

// Un "pool" garde quelques connexions ouvertes et les prête à chaque requête.
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3318),
  user: process.env.DB_USER || 'greencart',
  password: process.env.DB_PASSWORD || 'greencart-dev',
  database: process.env.DB_NAME || 'greencart',
  connectionLimit: 10,
  connectTimeout: 3000,
  timezone: 'Z', // les dates sont en UTC, comme dans le conteneur MySQL
  // Les colonnes DECIMAL (prix) arrivent en nombres, pas en textes
  decimalNumbers: true,
  // Les colonnes BOOLEAN (bio) arrivent en true ou false, pas en 1 ou 0
  typeCast: (champ, suivant) => {
    if (champ.type === 'TINY' && champ.length === 1) {
      const valeur = champ.string();
      return valeur === null ? null : valeur === '1';
    }
    return suivant();
  },
});

async function connecter() {
  try {
    await pool.query('SELECT 1');
    console.log('Base MySQL connectée.');
  } catch (err) {
    console.log('La base MySQL ne répond pas. Avez-vous lancé "docker compose up -d" ? Au premier lancement, MySQL met environ 30 secondes à démarrer. Nouvel essai dans 5 secondes.');
    setTimeout(connecter, 5000);
  }
}

// Utilisé par la route GET /api/sante
async function estConnectee() {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (err) {
    return false;
  }
}

// Utilisé par le middleware d'erreur : traduit une erreur de MySQL en { status, message }.
// Renvoie null si l'erreur ne vient pas de la base.
function erreurDeLaBase(err) {
  // Clé étrangère : un produit pour un producteur qui n'existe pas
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return { status: 400, message: "Le producteur indiqué n'existe pas" };
  }
  // Colonne NOT NULL laissée vide (unité, producteur...)
  if (err.code === 'ER_BAD_NULL_ERROR') {
    const colonne = (err.message.match(/'(\w+)'/) || [])[1] || 'une colonne';
    return { status: 400, message: `Donnée refusée par la base, vérifiez : ${colonne}` };
  }
  // Valeur hors de la liste d'un ENUM (une unité inconnue par exemple)
  if (err.code === 'WARN_DATA_TRUNCATED' || err.code === 'ER_WARN_DATA_TRUNCATED' || err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
    return { status: 400, message: 'Donnée refusée par la base : une valeur ne fait pas partie des valeurs permises' };
  }
  // Clé étrangère : on supprime une ligne encore utilisée ailleurs
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return { status: 409, message: 'Suppression impossible : cet élément est encore utilisé (par un produit ou une commande)' };
  }
  // Contrainte CHECK : stock négatif ou quantité nulle
  if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
    return { status: 409, message: 'Opération refusée par la base : le stock ne peut pas devenir négatif' };
  }
  // La base ne répond pas
  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT' || err.code === 'PROTOCOL_CONNECTION_LOST') {
    return { status: 503, message: 'La base MySQL ne répond pas. Lancez "docker compose up -d".' };
  }
  return null;
}

module.exports = { pool, connecter, estConnectee, erreurDeLaBase, NOM_BASE: 'mysql' };
