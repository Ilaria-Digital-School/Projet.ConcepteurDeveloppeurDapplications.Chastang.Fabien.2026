// depot/commandes.js : les commandes, version MySQL (exercice 4).
const { pool } = require('../config/db');

// Retire le stock de chaque ligne et enregistre la commande, dans UNE transaction :
// soit tout est fait, soit rien (ROLLBACK).
async function creer(commande) {
  // Une transaction se fait sur UNE connexion : on en emprunte une au pool
  const connexion = await pool.getConnection();
  try {
    await connexion.beginTransaction();

    // 1. Retirer le stock. "AND stock >= ?" empêche le stock de devenir négatif :
    //    si le stock manque, aucune ligne n'est modifiée (affectedRows vaut 0).
    for (let i = 0; i < commande.lignes.length; i++) {
      const ligne = commande.lignes[i];
      const [resultat] = await connexion.execute(
        'UPDATE produits SET stock = stock - ? WHERE id = ? AND stock >= ?',
        [ligne.quantite, ligne.produitId, ligne.quantite]
      );
      if (resultat.affectedRows === 0) {
        const err = new Error('Stock insuffisant, la commande est annulée');
        err.status = 409;
        throw err;
      }
    }

    // 2. La commande elle-même
    const [resultat] = await connexion.execute(
      'INSERT INTO commandes (client, total_ht, total_ttc, frais_livraison, montant_a_payer) VALUES (?, ?, ?, ?, ?)',
      [commande.client, commande.totalHT, commande.totalTTC, commande.fraisLivraison, commande.montantAPayer]
    );
    const commandeId = resultat.insertId;

    // 3. Ses lignes, reliées par commande_id (clé étrangère)
    for (let i = 0; i < commande.lignes.length; i++) {
      const ligne = commande.lignes[i];
      await connexion.execute(
        'INSERT INTO lignes_commande (commande_id, produit_id, quantite, prix_unitaire_ht) VALUES (?, ?, ?, ?)',
        [commandeId, ligne.produitId, ligne.quantite, ligne.prixUnitaireHT]
      );
    }

    await connexion.commit(); // tout est bon : on valide
    return trouverParId(commandeId);
  } catch (err) {
    await connexion.rollback(); // un problème : on annule tout ce qui a été fait
    throw err;
  } finally {
    connexion.release(); // on rend la connexion au pool, dans tous les cas
  }
}

async function trouverParId(id) {
  const [commandes] = await pool.execute(
    `SELECT id, client, statut, total_ht AS totalHT, total_ttc AS totalTTC,
            frais_livraison AS fraisLivraison, montant_a_payer AS montantAPayer, cree_le AS creeLe
     FROM commandes WHERE id = ?`,
    [id]
  );
  if (commandes.length === 0) return null;

  const [lignes] = await pool.execute(
    'SELECT produit_id AS produitId, quantite, prix_unitaire_ht AS prixUnitaireHT FROM lignes_commande WHERE commande_id = ? ORDER BY id',
    [id]
  );
  const commande = commandes[0];
  commande.lignes = lignes;
  return commande;
}

module.exports = { creer, trouverParId };
