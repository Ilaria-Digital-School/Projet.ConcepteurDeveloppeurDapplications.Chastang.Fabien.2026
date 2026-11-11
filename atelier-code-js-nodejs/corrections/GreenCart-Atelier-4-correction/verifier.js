// Vérificateur de l'atelier 4. Il appelle votre API par HTTP, comme le ferait un client.
// Il marche avec la version MongoDB comme avec la version MySQL.
//
// Utilisation, depuis le dossier mongo ou mysql, serveur lancé :
//   node ../verifier.js
// Si votre serveur écoute sur un autre port :
//   node ../verifier.js http://localhost:4000
//
// Vous pouvez le relancer autant de fois que vous voulez.

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Adresse de l'API : argument, sinon variable API_URL, sinon PORT du fichier .env
// ---------------------------------------------------------------------------
function lirePortDuEnv() {
  try {
    const contenu = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
    const trouve = contenu.match(/^\s*PORT\s*=\s*(\d+)/m);
    return trouve ? trouve[1] : null;
  } catch (err) {
    return null;
  }
}

const BASE = (process.argv[2] || process.env.API_URL || `http://localhost:${process.env.PORT || lirePortDuEnv() || 3000}`).replace(/\/+$/, '');

const EMAIL_ADMIN = 'admin@greencart.test';
const MOT_DE_PASSE_ADMIN = 'greencart';

const NOMS_PRODUITS = [
  'Pommes Reinette', 'Poires Williams', "Pruneaux d'Agen", 'Carottes', 'Poireaux', 'Pommes de terre',
  'Radis', 'Fromage de chèvre frais', 'Tomme de chèvre', 'Yaourt au lait de chèvre', 'Miel de châtaignier', "Miel d'acacia",
];
const LEGUMES = ['Carottes', 'Poireaux', 'Pommes de terre', 'Radis'];
const NOMS_PRODUCTEURS = ['Ferme des Trois Chênes', 'Verger de Lucie', 'Chèvrerie du Plateau', 'Rucher Martin'];

let jeton = null; // rempli si le bonus JWT est fait
let idInexistant = '999999';

// ---------------------------------------------------------------------------
// Outils
// ---------------------------------------------------------------------------

// Une explication pour l'étudiant. Elle arrête l'exercice en cours.
class AReVoir extends Error {}

// Le serveur ne répond plus du tout
class ServeurMuet extends Error {}

function aRevoir(texte) {
  throw new AReVoir(texte);
}

// Appel HTTP qui ne plante jamais : renvoie { status, corps }
async function appel(methode, chemin, corps) {
  const options = { method: methode, headers: {} };
  if (corps !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(corps);
  }
  if (jeton) options.headers.Authorization = `Bearer ${jeton}`;
  if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) options.signal = AbortSignal.timeout(8000);

  let reponse;
  try {
    reponse = await fetch(BASE + chemin, options);
  } catch (err) {
    if (err && err.name === 'TimeoutError') {
      aRevoir(`${methode} ${chemin} : le serveur n'a pas répondu en 8 secondes. Un middleware oublie sans doute d'appeler next() ou de répondre (res.json, res.status).`);
    }
    throw new ServeurMuet('injoignable');
  }
  const texte = await reponse.text();
  let json = null;
  try {
    json = texte ? JSON.parse(texte) : null;
  } catch (err) {
    json = null;
  }
  return { status: reponse.status, corps: json, texte: texte };
}

// Appel sans jeton, pour tester la protection du bonus
async function appelSansJeton(methode, chemin, corps) {
  const sauvegarde = jeton;
  jeton = null;
  try {
    return await appel(methode, chemin, corps);
  } finally {
    jeton = sauvegarde;
  }
}

function messageServeur(rep) {
  if (rep.corps && typeof rep.corps.message === 'string') return ` Message du serveur : « ${rep.corps.message} ».`;
  return '';
}

// Vérifie le code HTTP et explique en français si ce n'est pas le bon
function attendre(rep, codesAttendus, action) {
  if (codesAttendus.includes(rep.status)) return;
  const attendu = codesAttendus.join(' ou ');
  if (rep.status === 501) {
    aRevoir(`${action} : pas encore écrit (le serveur répond 501).${messageServeur(rep)}`);
  }
  if (rep.status === 404 && rep.corps && /Route introuvable/.test(rep.corps.message || '')) {
    aRevoir(`${action} : la route n'existe pas (404 « Route introuvable »). Vérifiez le fichier de routes et son app.use() dans app.js.`);
  }
  if (rep.status === 500) {
    aRevoir(`${action} : le serveur répond 500, une erreur s'est produite dans votre code. Regardez le terminal où tourne le serveur.${messageServeur(rep)}`);
  }
  if (rep.status === 401 && !codesAttendus.includes(401)) {
    aRevoir(`${action} : le serveur répond 401 (connexion requise). Si vous avez commencé le bonus, vérifiez la route POST /api/auth/connexion.`);
  }
  if (rep.status === 503) {
    aRevoir(`${action} : la base ne répond pas (503). Lancez "docker compose up -d".${messageServeur(rep)}`);
  }
  aRevoir(`${action} : le serveur répond ${rep.status}, on attendait ${attendu}.${messageServeur(rep)}`);
}

function memeId(a, b) {
  return a !== undefined && a !== null && String(a) === String(b);
}

function proche(a, b) {
  return typeof a === 'number' && Math.abs(a - b) < 0.001;
}

function euros(n) {
  return typeof n === 'number' ? n.toFixed(2).replace('.', ',') + ' €' : JSON.stringify(n);
}

async function listeProduits() {
  const rep = await appel('GET', '/api/produits');
  attendre(rep, [200], 'GET /api/produits');
  if (!Array.isArray(rep.corps)) aRevoir('GET /api/produits doit renvoyer un tableau JSON.');
  return rep.corps;
}

function trouverParNom(liste, nom) {
  for (let i = 0; i < liste.length; i++) {
    if (liste[i] && liste[i].nom === nom) return liste[i];
  }
  return null;
}

function produitDeTest(nom, prix, stock, producteurId) {
  return { nom: nom, categorie: 'epicerie', prix: prix, unite: 'pot', stock: stock, bio: false, producteurId: producteurId };
}

// ---------------------------------------------------------------------------
// Exercice 1 : lire les produits depuis la base
// ---------------------------------------------------------------------------
async function exercice1() {
  const produits = await listeProduits();
  for (let i = 0; i < NOMS_PRODUITS.length; i++) {
    if (!trouverParNom(produits, NOMS_PRODUITS[i])) {
      aRevoir(`GET /api/produits ne renvoie pas « ${NOMS_PRODUITS[i]} ». La liste doit venir de la base (${produits.length} produit(s) reçu(s)).`);
    }
  }
  const carottes = trouverParNom(produits, 'Carottes');
  if (carottes.id === undefined || carottes.id === null) aRevoir('Chaque produit doit avoir un champ "id".');
  if (typeof carottes.prix !== 'number') aRevoir(`Le prix doit être un nombre, pas ${JSON.stringify(carottes.prix)}.`);
  if (typeof carottes.bio !== 'boolean') aRevoir(`Le champ bio doit valoir true ou false, pas ${JSON.stringify(carottes.bio)}.`);
  if (carottes.producteurId === undefined) aRevoir('Chaque produit doit avoir un champ "producteurId".');

  // Filtre par catégorie
  let rep = await appel('GET', '/api/produits?categorie=legumes');
  attendre(rep, [200], 'GET /api/produits?categorie=legumes');
  if (!Array.isArray(rep.corps)) aRevoir('GET /api/produits?categorie=legumes doit renvoyer un tableau.');
  for (let i = 0; i < rep.corps.length; i++) {
    if (rep.corps[i].categorie !== 'legumes') {
      aRevoir(`GET /api/produits?categorie=legumes renvoie « ${rep.corps[i].nom} », qui n'est pas un légume. Le filtre n'est pas appliqué.`);
    }
  }
  for (let i = 0; i < LEGUMES.length; i++) {
    if (!trouverParNom(rep.corps, LEGUMES[i])) aRevoir(`GET /api/produits?categorie=legumes oublie « ${LEGUMES[i]} ».`);
  }

  // Tentative d'injection : la valeur doit être traitée comme un simple texte
  rep = await appel('GET', '/api/produits?categorie=' + encodeURIComponent("legumes' OR '1'='1"));
  if (rep.status === 200 && Array.isArray(rep.corps) && rep.corps.length > 0) {
    aRevoir("Avec ?categorie=legumes' OR '1'='1 vous renvoyez des produits : la valeur du client est collée dans la requête. Utilisez une requête paramétrée (des ? et un tableau de valeurs).");
  }
  if (rep.status !== 200 && rep.status !== 400) attendre(rep, [200, 400], 'GET /api/produits avec une catégorie bizarre');

  // Un produit par son id
  rep = await appel('GET', '/api/produits/' + encodeURIComponent(carottes.id));
  attendre(rep, [200], `GET /api/produits/${carottes.id}`);
  if (!rep.corps || rep.corps.nom !== 'Carottes') aRevoir(`GET /api/produits/${carottes.id} doit renvoyer le produit Carottes.`);

  rep = await appel('GET', '/api/produits/' + idInexistant);
  attendre(rep, [404], `GET /api/produits/${idInexistant} (produit qui n'existe pas)`);
}

// ---------------------------------------------------------------------------
// Exercice 2 : créer, modifier, supprimer un produit
// ---------------------------------------------------------------------------
// Lance un exercice précédent qui sert de base. S'il échoue, on explique pourquoi on ne peut pas tester.
async function prerequis(fonction, explication) {
  try {
    return await fonction();
  } catch (err) {
    if (err instanceof AReVoir) aRevoir(explication);
    throw err;
  }
}

async function exercice2() {
  const produits = await prerequis(listeProduits, "Impossible de tester : l'exercice 1 (GET /api/produits) doit d'abord fonctionner.");
  const carottes = trouverParNom(produits, 'Carottes');
  if (!carottes) aRevoir("Impossible de tester : l'exercice 1 (lire les produits) doit d'abord fonctionner.");

  // Ménage d'un essai précédent interrompu
  const ancien = trouverParNom(produits, '[Vérif] Produit temporaire');
  if (ancien) await appel('DELETE', '/api/produits/' + encodeURIComponent(ancien.id));

  // Créer
  let rep = await appel('POST', '/api/produits', produitDeTest('[Vérif] Produit temporaire', 4.5, 10, carottes.producteurId));
  attendre(rep, [201], 'POST /api/produits');
  const cree = rep.corps;
  if (!cree || cree.id === undefined || cree.id === null) aRevoir('POST /api/produits doit renvoyer le produit créé, avec son id.');
  if (cree.nom !== '[Vérif] Produit temporaire') aRevoir('POST /api/produits doit renvoyer le produit créé (le nom ne correspond pas).');
  const id = encodeURIComponent(cree.id);

  rep = await appel('GET', '/api/produits/' + id);
  attendre(rep, [200], 'GET du produit juste créé');

  // Créer un produit invalide
  rep = await appel('POST', '/api/produits', produitDeTest('', 'gratuit', 1, carottes.producteurId));
  attendre(rep, [400], 'POST /api/produits avec un produit invalide');

  // Sans unité : la validation de l'atelier 3 laisse passer, la base refuse. L'API doit répondre 400.
  const sansUnite = produitDeTest('[Vérif] Sans unité', 2, 1, carottes.producteurId);
  delete sansUnite.unite;
  rep = await appel('POST', '/api/produits', sansUnite);
  if (rep.status === 201 && rep.corps) await appel('DELETE', '/api/produits/' + encodeURIComponent(rep.corps.id));
  attendre(rep, [400], 'POST /api/produits sans unité (passez les données dans champsProduit)');

  // Modifier
  rep = await appel('PUT', '/api/produits/' + id, produitDeTest('[Vérif] Produit temporaire', 5, 7, carottes.producteurId));
  attendre(rep, [200], `PUT /api/produits/${cree.id}`);
  if (!rep.corps || !proche(rep.corps.prix, 5)) aRevoir('PUT /api/produits/:id doit renvoyer le produit APRÈS modification (prix 5 attendu).');
  rep = await appel('GET', '/api/produits/' + id);
  if (!rep.corps || rep.corps.stock !== 7) aRevoir("Après le PUT, le stock relu n'est pas 7 : la modification n'est pas enregistrée en base.");

  rep = await appel('PUT', '/api/produits/' + idInexistant, produitDeTest('[Vérif] Fantôme', 5, 7, carottes.producteurId));
  attendre(rep, [404], `PUT /api/produits/${idInexistant} (produit qui n'existe pas)`);

  // Supprimer
  rep = await appel('DELETE', '/api/produits/' + id);
  attendre(rep, [204, 200], `DELETE /api/produits/${cree.id}`);
  rep = await appel('GET', '/api/produits/' + id);
  if (rep.status !== 404) aRevoir("Après le DELETE, le produit existe encore : la suppression n'est pas faite en base.");

  rep = await appel('DELETE', '/api/produits/' + idInexistant);
  attendre(rep, [404], `DELETE /api/produits/${idInexistant} (produit qui n'existe pas)`);
}

// ---------------------------------------------------------------------------
// Exercice 3 : les producteurs
// ---------------------------------------------------------------------------
async function exercice3() {
  let rep = await appel('GET', '/api/producteurs');
  attendre(rep, [200], 'GET /api/producteurs');
  if (!Array.isArray(rep.corps)) aRevoir('GET /api/producteurs doit renvoyer un tableau JSON.');
  for (let i = 0; i < NOMS_PRODUCTEURS.length; i++) {
    if (!trouverParNom(rep.corps, NOMS_PRODUCTEURS[i])) aRevoir(`GET /api/producteurs ne renvoie pas « ${NOMS_PRODUCTEURS[i]} ».`);
  }
  const ferme = trouverParNom(rep.corps, 'Ferme des Trois Chênes');
  if (ferme.id === undefined || ferme.id === null) aRevoir('Chaque producteur doit avoir un champ "id".');
  const idFerme = encodeURIComponent(ferme.id);

  // Ménage d'un essai précédent interrompu
  const ancien = trouverParNom(rep.corps, '[Vérif] Ferme temporaire');
  if (ancien) await appel('DELETE', '/api/producteurs/' + encodeURIComponent(ancien.id));

  rep = await appel('GET', '/api/producteurs/' + idFerme);
  attendre(rep, [200], `GET /api/producteurs/${ferme.id}`);
  if (!rep.corps || rep.corps.ville !== 'Saint-Émilion') aRevoir(`GET /api/producteurs/${ferme.id} doit renvoyer la Ferme des Trois Chênes, avec sa ville.`);

  rep = await appel('GET', '/api/producteurs/' + idInexistant);
  attendre(rep, [404], `GET /api/producteurs/${idInexistant} (producteur qui n'existe pas)`);

  // Les produits d'un producteur
  rep = await appel('GET', `/api/producteurs/${idFerme}/produits`);
  attendre(rep, [200], `GET /api/producteurs/${ferme.id}/produits`);
  if (!Array.isArray(rep.corps)) aRevoir('GET /api/producteurs/:id/produits doit renvoyer un tableau.');
  for (let i = 0; i < LEGUMES.length; i++) {
    if (!trouverParNom(rep.corps, LEGUMES[i])) aRevoir(`GET /api/producteurs/${ferme.id}/produits oublie « ${LEGUMES[i]} ».`);
  }
  for (let i = 0; i < rep.corps.length; i++) {
    if (!memeId(rep.corps[i].producteurId, ferme.id)) {
      aRevoir(`GET /api/producteurs/${ferme.id}/produits renvoie « ${rep.corps[i].nom} », qui est d'un autre producteur.`);
    }
  }

  // Créer, refuser, modifier, supprimer
  rep = await appel('POST', '/api/producteurs', { nom: '[Vérif] Ferme temporaire', ville: 'Bordeaux' });
  attendre(rep, [201], 'POST /api/producteurs');
  if (!rep.corps || rep.corps.id === undefined || rep.corps.id === null) aRevoir('POST /api/producteurs doit renvoyer le producteur créé, avec son id.');
  const idNouveau = encodeURIComponent(rep.corps.id);

  rep = await appel('POST', '/api/producteurs', { nom: '' });
  attendre(rep, [400], 'POST /api/producteurs sans nom ni ville');

  rep = await appel('PUT', '/api/producteurs/' + idNouveau, { nom: '[Vérif] Ferme temporaire', ville: 'Libourne' });
  attendre(rep, [200], 'PUT /api/producteurs/:id');
  rep = await appel('GET', '/api/producteurs/' + idNouveau);
  if (!rep.corps || rep.corps.ville !== 'Libourne') aRevoir("Après le PUT, la ville relue n'est pas Libourne : la modification n'est pas enregistrée.");

  rep = await appel('DELETE', '/api/producteurs/' + idNouveau);
  attendre(rep, [204, 200], 'DELETE /api/producteurs/:id');
  rep = await appel('GET', '/api/producteurs/' + idNouveau);
  if (rep.status !== 404) aRevoir("Après le DELETE, le producteur existe encore : la suppression n'est pas faite en base.");
}

// ---------------------------------------------------------------------------
// Exercice 4 : passer une commande
// ---------------------------------------------------------------------------

// Crée ou remet à zéro un produit de test, pour que le vérificateur puisse être relancé
async function preparerProduit(nom, prix, stock) {
  const produits = await prerequis(listeProduits, "Impossible de tester les commandes : l'exercice 1 (GET /api/produits) doit d'abord fonctionner.");
  const carottes = trouverParNom(produits, 'Carottes');
  if (!carottes) aRevoir("Impossible de tester les commandes : l'exercice 1 doit d'abord fonctionner.");
  const existant = trouverParNom(produits, nom);
  let rep;
  if (existant) {
    rep = await appel('PUT', '/api/produits/' + encodeURIComponent(existant.id), produitDeTest(nom, prix, stock, carottes.producteurId));
  } else {
    rep = await appel('POST', '/api/produits', produitDeTest(nom, prix, stock, carottes.producteurId));
  }
  if (rep.status !== 200 && rep.status !== 201) {
    aRevoir("Impossible de tester les commandes : l'exercice 2 (créer et modifier un produit) doit d'abord fonctionner.");
  }
  return rep.corps.id;
}

async function stockDe(id) {
  const rep = await appel('GET', '/api/produits/' + encodeURIComponent(id));
  return rep.corps ? rep.corps.stock : undefined;
}

function verifierMontants(commande, attendu, contexte) {
  const champs = ['totalHT', 'totalTTC', 'fraisLivraison', 'montantAPayer'];
  for (let i = 0; i < champs.length; i++) {
    const champ = champs[i];
    if (commande[champ] === undefined) aRevoir(`${contexte} : la commande renvoyée n'a pas de champ "${champ}".`);
    if (!proche(commande[champ], attendu[champ])) {
      aRevoir(`${contexte} : ${champ} vaut ${euros(commande[champ])}, on attendait ${euros(attendu[champ])}.`);
    }
  }
}

async function exercice4() {
  const idConfiture = await preparerProduit('[Vérif] Confiture', 3.2, 50);
  const idPanier = await preparerProduit('[Vérif] Panier garni', 40, 5);

  // Commande simple, avec livraison payante
  let rep = await appel('POST', '/api/commandes', { client: 'Vérificateur', lignes: [{ produitId: idConfiture, quantite: 2 }] });
  attendre(rep, [201], 'POST /api/commandes (2 confitures à 3,20 € HT)');
  const commande = rep.corps || {};
  if (commande.id === undefined || commande.id === null) aRevoir('POST /api/commandes doit renvoyer la commande créée, avec son id.');
  verifierMontants(commande, { totalHT: 6.4, totalTTC: 6.75, fraisLivraison: 4.9, montantAPayer: 11.65 }, '2 confitures à 3,20 € HT');
  if (commande.statut !== 'en_attente') aRevoir(`Une nouvelle commande doit avoir le statut "en_attente", pas ${JSON.stringify(commande.statut)}.`);
  let stock = await stockDe(idConfiture);
  if (stock !== 48) aRevoir(`Après une commande de 2 confitures, le stock devrait passer de 50 à 48. Il vaut ${stock}.`);

  rep = await appel('GET', '/api/commandes/' + encodeURIComponent(commande.id));
  attendre(rep, [200], 'GET /api/commandes/:id');
  if (!rep.corps || rep.corps.client !== 'Vérificateur' || !Array.isArray(rep.corps.lignes) || rep.corps.lignes.length !== 1) {
    aRevoir('GET /api/commandes/:id doit renvoyer la commande enregistrée, avec son client et ses lignes.');
  }
  rep = await appel('GET', '/api/commandes/' + idInexistant);
  attendre(rep, [404], `GET /api/commandes/${idInexistant} (commande qui n'existe pas)`);

  // Livraison offerte à partir de 40 € TTC
  rep = await appel('POST', '/api/commandes', { client: 'Vérificateur', lignes: [{ produitId: idPanier, quantite: 1 }] });
  attendre(rep, [201], 'POST /api/commandes (1 panier à 40 € HT)');
  verifierMontants(rep.corps || {}, { totalHT: 40, totalTTC: 42.2, fraisLivraison: 0, montantAPayer: 42.2 }, '1 panier à 40 € HT (livraison offerte)');

  // Stock insuffisant : refusé, et le stock ne bouge pas
  rep = await appel('POST', '/api/commandes', { client: 'Vérificateur', lignes: [{ produitId: idPanier, quantite: 10 }] });
  if (rep.status === 201) aRevoir('Une commande de 10 paniers est acceptée alors qu\'il en reste 4. Vérifiez le stock avant d\'enregistrer.');
  attendre(rep, [409, 400, 422], 'POST /api/commandes avec un stock insuffisant');
  stock = await stockDe(idPanier);
  if (stock !== 4) aRevoir(`Après une commande refusée, le stock du panier devrait rester à 4. Il vaut ${stock}.`);

  // Tout ou rien : la première ligne est possible, la seconde non
  rep = await appel('POST', '/api/commandes', {
    client: 'Vérificateur',
    lignes: [{ produitId: idConfiture, quantite: 1 }, { produitId: idPanier, quantite: 10 }],
  });
  attendre(rep, [409, 400, 422], 'POST /api/commandes avec une seconde ligne impossible');
  stock = await stockDe(idConfiture);
  if (stock !== 48) {
    aRevoir(`Commande refusée, mais le stock de confiture est passé de 48 à ${stock}. Vérifiez toutes les lignes avant de retirer le moindre stock.`);
  }

  // Données invalides
  const invalides = [
    [{ client: 'Vérificateur', lignes: [{ produitId: idConfiture, quantite: 0 }] }, 'une quantité de 0'],
    [{ client: 'Vérificateur', lignes: [{ produitId: idConfiture, quantite: 1.5 }] }, 'une quantité de 1,5'],
    [{ client: 'Vérificateur', lignes: [{ produitId: idConfiture, quantite: -2 }] }, 'une quantité de -2'],
    [{ client: 'Vérificateur', lignes: [] }, 'aucune ligne'],
    [{ lignes: [{ produitId: idConfiture, quantite: 1 }] }, 'sans client'],
  ];
  for (let i = 0; i < invalides.length; i++) {
    rep = await appel('POST', '/api/commandes', invalides[i][0]);
    attendre(rep, [400], `POST /api/commandes avec ${invalides[i][1]}`);
  }
  stock = await stockDe(idConfiture);
  if (stock !== 48) aRevoir(`Des commandes invalides ont modifié le stock de confiture (${stock} au lieu de 48).`);

  rep = await appel('POST', '/api/commandes', { client: 'Vérificateur', lignes: [{ produitId: idInexistant, quantite: 1 }] });
  attendre(rep, [404, 400], 'POST /api/commandes avec un produit qui n\'existe pas');

  // La règle de l'atelier 1 : la TVA sur le total HT, sans arrondir ligne par ligne.
  // 2 x 3,20 + 3 x 10,50 = 37,90 € HT, soit 39,98 € TTC : la livraison reste due.
  // Arrondir le TTC de chaque ligne donnerait 6,76 + 33,24 = 40,00 € et l'offrirait à tort.
  const idMiel = await preparerProduit('[Vérif] Miel', 10.5, 50);
  rep = await appel('POST', '/api/commandes', {
    client: 'Vérificateur',
    lignes: [{ produitId: idConfiture, quantite: 2 }, { produitId: idMiel, quantite: 3 }],
  });
  attendre(rep, [201], 'POST /api/commandes (2 confitures à 3,20 € HT et 3 miels à 10,50 € HT)');
  const corps = rep.corps || {};
  if (proche(corps.totalTTC, 40)) {
    aRevoir('2 confitures et 3 miels : totalTTC vaut 40,00 €, on attendait 39,98 €. Additionnez les prix HT, puis appliquez la TVA une seule fois sur le total, comme à l\'atelier 1.');
  }
  verifierMontants(corps, { totalHT: 37.9, totalTTC: 39.98, fraisLivraison: 4.9, montantAPayer: 44.88 }, '2 confitures et 3 miels (juste sous le seuil de 40 €)');
}

// ---------------------------------------------------------------------------
// Exercice 5 (bonus) : connexion avec JWT
// ---------------------------------------------------------------------------
async function exercice5() {
  let rep = await appelSansJeton('POST', '/api/auth/connexion', { email: EMAIL_ADMIN, motDePasse: MOT_DE_PASSE_ADMIN });
  attendre(rep, [200], 'POST /api/auth/connexion avec le bon mot de passe');
  if (!rep.corps || typeof rep.corps.token !== 'string' || rep.corps.token.split('.').length !== 3) {
    aRevoir('POST /api/auth/connexion doit renvoyer { "token": "..." } avec un jeton JWT (trois morceaux séparés par des points).');
  }
  jeton = rep.corps.token;

  rep = await appelSansJeton('POST', '/api/auth/connexion', { email: EMAIL_ADMIN, motDePasse: 'mauvais' });
  attendre(rep, [401], 'POST /api/auth/connexion avec un mauvais mot de passe');

  const produits = await prerequis(listeProduits, "Impossible de finir le test : l'exercice 1 (GET /api/produits) doit d'abord fonctionner.");
  const carottes = trouverParNom(produits, 'Carottes');
  rep = await appelSansJeton('POST', '/api/produits', produitDeTest('[Vérif] Sans jeton', 1, 1, carottes.producteurId));
  if (rep.status === 201) {
    await appel('DELETE', '/api/produits/' + encodeURIComponent(rep.corps.id));
    aRevoir('POST /api/produits accepte une requête sans jeton. Placez verifierToken sur les routes POST, PUT et DELETE des produits.');
  }
  attendre(rep, [401], 'POST /api/produits sans jeton');

  const sauvegarde = jeton;
  jeton = 'faux.jeton.invalide';
  try {
    // un id qui n'existe pas : même si la route n'est pas protégée, rien n'est supprimé
    rep = await appel('DELETE', '/api/produits/' + idInexistant);
  } finally {
    jeton = sauvegarde;
  }
  attendre(rep, [401], 'DELETE /api/produits/:id avec un jeton invalide');

  rep = await appel('POST', '/api/produits', produitDeTest('[Vérif] Avec jeton', 1, 1, carottes.producteurId));
  attendre(rep, [201], 'POST /api/produits avec un jeton valide');
  await appel('DELETE', '/api/produits/' + encodeURIComponent(rep.corps.id));
}

// ---------------------------------------------------------------------------
// Programme principal
// ---------------------------------------------------------------------------
const EXERCICES = [
  ['Exercice 1 (indispensable), lire les produits', exercice1],
  ['Exercice 2 (indispensable), créer, modifier, supprimer un produit', exercice2],
  ['Exercice 3 (souhaitable), les producteurs', exercice3],
  ['Exercice 4 (souhaitable), passer une commande', exercice4],
  ['Exercice 5 (bonus), connexion avec JWT', exercice5],
];

async function principal() {
  console.log(`Vérification de l'atelier 4 sur ${BASE}\n`);

  if (typeof fetch !== 'function') {
    console.log('À revoir : votre Node est trop ancien. Il faut Node 18 ou plus (tapez node -v).');
    return;
  }

  // 1. Le serveur et la base répondent-ils ?
  let sante;
  try {
    sante = await appel('GET', '/api/sante');
  } catch (err) {
    console.log(`Le serveur ne répond pas sur ${BASE}.`);
    console.log('Lancez-le dans un autre terminal, depuis le dossier mongo ou mysql : npm run dev');
    console.log("S'il écoute sur un autre port : node ../verifier.js http://localhost:<port>");
    return;
  }
  if (!sante.corps || sante.corps.api !== 'ok') {
    console.log(`Un serveur répond sur ${BASE}, mais ce n'est pas l'API GreenCart de l'atelier 4 (pas de route GET /api/sante).`);
    console.log('Vérifiez que vous avez lancé npm run dev dans le dossier mongo ou mysql.');
    return;
  }
  const base = sante.corps.base === 'mongo' ? 'MongoDB' : 'MySQL';
  if (sante.corps.connectee !== true) {
    console.log(`Le serveur répond, mais la base ${base} ne répond pas.`);
    console.log('Lancez-la depuis le dossier de votre version : docker compose up -d');
    console.log('Docker Desktop doit être ouvert. Au premier lancement, MySQL met environ 30 secondes à démarrer.');
    return;
  }
  console.log(`Serveur et base ${base} joignables.\n`);
  idInexistant = sante.corps.base === 'mongo' ? 'ffffffffffffffffffffffff' : '999999';

  // 2. Si le bonus est fait, on se connecte pour pouvoir créer et modifier des produits
  try {
    const rep = await appel('POST', '/api/auth/connexion', { email: EMAIL_ADMIN, motDePasse: MOT_DE_PASSE_ADMIN });
    if (rep.status === 200 && rep.corps && typeof rep.corps.token === 'string') jeton = rep.corps.token;
  } catch (err) {
    // pas grave, le bonus n'est pas fait
  }

  // 3. Les exercices, un par un
  let reussis = 0;
  for (let i = 0; i < EXERCICES.length; i++) {
    const titre = EXERCICES[i][0];
    try {
      await EXERCICES[i][1]();
      console.log(`${titre} : OK`);
      reussis++;
    } catch (err) {
      if (err instanceof AReVoir) {
        console.log(`${titre} : À revoir : ${err.message}`);
      } else if (err instanceof ServeurMuet) {
        console.log(`${titre} : À revoir : le serveur a cessé de répondre pendant le test. Regardez le terminal où tourne npm run dev : une erreur l'a sans doute arrêté.`);
        console.log('\nVérification interrompue. Relancez le serveur, puis le vérificateur.');
        return;
      } else {
        console.log(`${titre} : À revoir : une réponse du serveur n'a pas la forme attendue (${err && err.message ? err.message : 'erreur inconnue'}).`);
      }
    }
  }

  console.log(`\nBilan : ${reussis} exercice(s) sur ${EXERCICES.length} OK.`);
  if (reussis < EXERCICES.length) console.log('Corrigez le premier « À revoir », puis relancez : node ../verifier.js');
}

principal().catch((err) => {
  console.log('Le vérificateur a rencontré un problème inattendu : ' + (err && err.message ? err.message : err));
});
