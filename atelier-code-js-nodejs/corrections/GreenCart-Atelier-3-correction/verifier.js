// verifier.js : vérifie les exercices de l'atelier 3 (API GreenCart).
//
// Lancez d'abord le serveur dans un terminal (npm run dev),
// puis, dans un DEUXIÈME terminal :
//   node verifier.js              l'API est sur le port 3000
//   node verifier.js 3002         l'API est sur un autre port
//   node verifier.js 3002 3005    et la page d'accueil du bonus aussi
//
// Le vérificateur crée ses propres produits de test et les supprime à la fin.
// Vous pouvez le relancer autant de fois que vous voulez.
// Vous n'avez pas à lire ni à modifier ce fichier.

const fs = require('fs');
const path = require('path');

const PORT_API = Number(process.argv[2]) || Number(process.env.PORT) || 3000;
const PORT_ACCUEIL = Number(process.argv[3]) || Number(process.env.PORT_ACCUEIL) || 3001;

const FICHIER_ROUTES = 'routes/produit.routes.js';
const FICHIER_CONTROLEUR = 'controllers/produit.controller.js';

// Un produit correct, utilisé pour les tests.
const PRODUIT_TEST = {
  nom: 'Produit du vérificateur',
  categorie: 'legumes',
  prix: 2.5,
  unite: 'kg',
  stock: 10,
  bio: true,
  producteurId: 1
};

const resultats = [];
const idsCrees = [];
let original12 = null;

// ---------- Outils ----------

function noter(titre, probleme) {
  resultats.push({ titre, ok: !probleme, probleme });
}

// Envoie une requête et renvoie { statut, json, texte, type }, ou { panne }.
// Ne lance jamais d'erreur.
async function requete(methode, chemin, corps, port) {
  const options = { method: methode, headers: {}, signal: AbortSignal.timeout(3000) };
  if (corps !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(corps);
  }
  try {
    const reponse = await fetch(`http://localhost:${port || PORT_API}${chemin}`, options);
    const texte = await reponse.text();
    let json = null;
    try {
      json = JSON.parse(texte);
    } catch (e) {
      json = null;
    }
    return { statut: reponse.status, texte, json, type: reponse.headers.get('content-type') || '' };
  } catch (err) {
    if (err && (err.name === 'TimeoutError' || err.name === 'AbortError')) {
      return { panne: 'delai' };
    }
    return { panne: 'connexion' };
  }
}

// Explique en français pourquoi une réponse n'a pas le code attendu.
function expliquer(libelle, rep, attendu, fonction) {
  if (rep.panne === 'delai') {
    return `${libelle} ne répond pas (plus de 3 secondes). Un middleware oublie-t-il d'appeler next() ou de répondre ?`;
  }
  if (rep.panne === 'connexion') {
    return `${libelle} : le serveur ne répond plus. Il s'est peut-être arrêté. Regardez le terminal du serveur.`;
  }
  const debut = `${libelle} devait répondre ${attendu}, il répond ${rep.statut}`;
  if (rep.statut === 404 && (!rep.json || rep.json.message === 'Route introuvable')) {
    return `${debut} : la route existe-t-elle dans ${FICHIER_ROUTES} ?`;
  }
  if (rep.statut === 404 && attendu !== 404) {
    return `${debut} alors que le produit existe. Avez-vous converti l'id avec Number(req.params.id), comme dans afficherProduit ?`;
  }
  if (rep.statut === 501) {
    return `${debut} : la fonction ${fonction} de ${FICHIER_CONTROLEUR} est encore à compléter.`;
  }
  if (rep.statut === 500) {
    return `${debut} : le serveur a rencontré une erreur. Lisez le message dans le terminal du serveur.`;
  }
  if (rep.statut === 400 && (attendu === 200 || attendu === 201)) {
    return `${debut} : la validation refuse un produit correct. Relisez middlewares/validation.middleware.js.`;
  }
  if (rep.statut === 200 && attendu === 201) {
    return `${debut} : pour une création, le bon code est 201. Utilisez res.status(201).json(...).`;
  }
  if (rep.statut === 200 && attendu === 204) {
    return `${debut} : après une suppression, le bon code est 204. Utilisez res.status(204).send().`;
  }
  if (attendu === 404) {
    return `${debut} : quand le produit n'existe pas, répondez res.status(404).json({ message: 'Produit introuvable' }).`;
  }
  return `${debut}.`;
}

function estProduit(objet) {
  return objet !== null && typeof objet === 'object' && !Array.isArray(objet) && typeof objet.id === 'number';
}

// ---------- Point de départ : le serveur et les routes d'exemple ----------

async function verifierDepart() {
  const titre = 'Point de départ (routes GET fournies)';
  const liste = await requete('GET', '/api/produits');

  if (liste.panne === 'connexion') {
    console.log('');
    console.log(`Le serveur ne répond pas sur http://localhost:${PORT_API}.`);
    console.log('Lancez-le dans un autre terminal avec : npm run dev');
    console.log('Attendez le message « Serveur GreenCart lancé », puis relancez : node verifier.js');
    console.log(`Si votre serveur tourne sur un autre port, donnez-le : node verifier.js 3002`);
    console.log('');
    return false;
  }
  if (liste.panne === 'delai') {
    noter(titre, 'GET /api/produits ne répond pas. Un middleware global oublie-t-il d\'appeler next() ? Regardez app.js et middlewares/journal.middleware.js.');
    return false;
  }
  if (liste.statut !== 200 || !Array.isArray(liste.json)) {
    noter(titre, `GET /api/produits devait renvoyer la liste des produits en JSON, il répond ${liste.statut}. Est-ce bien l'API GreenCart qui tourne sur le port ${PORT_API} ?`);
    return false;
  }

  const un = await requete('GET', '/api/produits/1');
  if (un.statut !== 200 || !estProduit(un.json) || un.json.id !== 1) {
    noter(titre, expliquer('GET /api/produits/1', un, 200, 'afficherProduit') + ' Cette route était fournie : l\'avez-vous modifiée ?');
    return true;
  }
  const absent = await requete('GET', '/api/produits/999999');
  if (absent.statut !== 404) {
    noter(titre, expliquer('GET /api/produits/999999', absent, 404, 'afficherProduit'));
    return true;
  }

  // On garde le produit 12 tel quel, pour le remettre en état à la fin si besoin.
  const douze = await requete('GET', '/api/produits/12');
  if (douze.statut === 200 && estProduit(douze.json)) {
    original12 = douze.json;
  }
  noter(titre, null);
  return true;
}

// ---------- Exercice 1 : filtrer par catégorie ----------

async function verifierExercice1() {
  const titre = 'Exercice 1 (indispensable) Filtrer par catégorie';

  const tous = await requete('GET', '/api/produits');
  if (!Array.isArray(tous.json) || tous.json.length < 12) {
    return noter(titre, 'GET /api/produits sans paramètre doit toujours renvoyer tout le catalogue (12 produits au départ).');
  }

  const rep = await requete('GET', '/api/produits?categorie=legumes');
  if (rep.statut !== 200 || !Array.isArray(rep.json)) {
    return noter(titre, expliquer('GET /api/produits?categorie=legumes', rep, 200, 'listerProduits') + ' La réponse doit être un tableau JSON.');
  }
  for (let i = 0; i < rep.json.length; i++) {
    const p = rep.json[i];
    if (!p || p.categorie !== 'legumes') {
      const nom = p && p.nom ? `${p.nom}, ${p.categorie}` : 'un élément qui n\'est pas un produit';
      return noter(titre, `GET /api/produits?categorie=legumes renvoie aussi d'autres produits (par exemple ${nom}). Dans listerProduits, lisez req.query.categorie et ne gardez que les produits de cette catégorie.`);
    }
  }
  const attendus = [4, 5, 6, 7];
  for (let i = 0; i < attendus.length; i++) {
    let trouve = false;
    for (let j = 0; j < rep.json.length; j++) {
      if (rep.json[j].id === attendus[i]) {
        trouve = true;
      }
    }
    if (!trouve) {
      return noter(titre, `GET /api/produits?categorie=legumes oublie le produit ${attendus[i]}. Il y a 4 légumes au départ : Carottes, Poireaux, Pommes de terre, Radis.`);
    }
  }

  const vide = await requete('GET', '/api/produits?categorie=bonbons');
  if (vide.statut !== 200 || !Array.isArray(vide.json) || vide.json.length !== 0) {
    return noter(titre, 'GET /api/produits?categorie=bonbons devait répondre 200 avec une liste vide [] : aucune catégorie ne s\'appelle bonbons.');
  }
  noter(titre, null);
}

// ---------- Exercice 2 : ajouter un produit ----------

async function verifierExercice2() {
  const titre = 'Exercice 2 (indispensable) Ajouter un produit (POST)';

  const rep = await requete('POST', '/api/produits', PRODUIT_TEST);
  if (rep.statut === 201 || rep.statut === 200) {
    if (estProduit(rep.json)) {
      idsCrees.push(rep.json.id);
    }
  }
  if (rep.statut !== 201) {
    return noter(titre, expliquer('POST /api/produits', rep, 201, 'creerProduit'));
  }
  if (!estProduit(rep.json)) {
    return noter(titre, 'POST /api/produits répond bien 201, mais sans le produit créé. Renvoyez le produit donné par Produit.creer(req.body), avec son id.');
  }
  if (rep.json.nom !== PRODUIT_TEST.nom || rep.json.prix !== PRODUIT_TEST.prix) {
    return noter(titre, 'POST /api/produits répond 201, mais le produit renvoyé n\'a pas le nom ou le prix envoyés. Passez bien req.body à Produit.creer().');
  }
  const relu = await requete('GET', `/api/produits/${rep.json.id}`);
  if (relu.statut !== 200) {
    return noter(titre, `Le produit créé (id ${rep.json.id}) n'est pas retrouvé par GET /api/produits/${rep.json.id}. Est-il bien ajouté avec Produit.creer() ?`);
  }
  noter(titre, null);
}

// ---------- Exercice 3 : modifier et supprimer ----------

async function verifierExercice3() {
  const titre = 'Exercice 3 (indispensable) Modifier et supprimer (PUT, DELETE)';

  // On travaille sur un produit créé par le vérificateur si POST marche,
  // sinon sur le produit 12, remis en état à la fin.
  let cible = idsCrees.length > 0 ? idsCrees[0] : null;
  let surDouze = false;
  if (cible === null) {
    if (!original12) {
      return noter(titre, 'Impossible de tester : le produit 12 est introuvable. Redémarrez le serveur pour retrouver le catalogue d\'origine.');
    }
    cible = 12;
    surDouze = true;
  }

  const modifie = { ...PRODUIT_TEST, nom: 'Produit du vérificateur modifié', prix: 3.1, stock: 7 };
  if (surDouze) {
    modifie.nom = original12.nom;
    modifie.categorie = original12.categorie;
    modifie.unite = original12.unite;
  }

  const put = await requete('PUT', `/api/produits/${cible}`, modifie);
  if (put.statut !== 200) {
    return noter(titre, expliquer(`PUT /api/produits/${cible}`, put, 200, 'modifierProduit'));
  }
  if (!estProduit(put.json) || put.json.id !== cible || put.json.prix !== 3.1) {
    return noter(titre, `PUT /api/produits/${cible} répond 200, mais pas avec le produit modifié. Renvoyez le produit donné par Produit.remplacer(), avec le même id.`);
  }
  const relu = await requete('GET', `/api/produits/${cible}`);
  if (!relu.json || relu.json.prix !== 3.1) {
    return noter(titre, `Après PUT /api/produits/${cible}, GET renvoie encore l'ancien prix. Utilisez bien Produit.remplacer(id, req.body).`);
  }

  const putAbsent = await requete('PUT', '/api/produits/999999', modifie);
  if (putAbsent.statut !== 404) {
    return noter(titre, expliquer('PUT /api/produits/999999 (produit qui n\'existe pas)', putAbsent, 404, 'modifierProduit'));
  }

  const delAbsent = await requete('DELETE', '/api/produits/999999');
  if (delAbsent.statut !== 404) {
    return noter(titre, expliquer('DELETE /api/produits/999999 (produit qui n\'existe pas)', delAbsent, 404, 'supprimerProduit'));
  }

  if (surDouze) {
    return noter(titre, 'PUT est correct. DELETE n\'a pas pu être testé en entier : il faut d\'abord que POST marche (exercice 2), pour que le vérificateur supprime son propre produit.');
  }

  const del = await requete('DELETE', `/api/produits/${cible}`);
  if (del.statut !== 204) {
    return noter(titre, expliquer(`DELETE /api/produits/${cible}`, del, 204, 'supprimerProduit'));
  }
  idsCrees.splice(idsCrees.indexOf(cible), 1);
  if (del.texte !== '') {
    return noter(titre, `DELETE /api/produits/${cible} répond 204, mais avec un contenu. Un 204 ne renvoie rien : res.status(204).send().`);
  }
  const apres = await requete('GET', `/api/produits/${cible}`);
  if (apres.statut !== 404) {
    return noter(titre, `Après DELETE, GET /api/produits/${cible} répond encore ${apres.statut}. Le produit doit être retiré avec Produit.supprimer(id).`);
  }
  noter(titre, null);
}

// ---------- Exercice 4.1 : le journal ----------

function verifierJournal() {
  const titre = 'Exercice 4.1 (souhaitable) Middleware de journalisation';
  const fichier = path.join(__dirname, 'middlewares', 'journal.middleware.js');

  if (!fs.existsSync(fichier)) {
    return noter(titre, 'Le fichier middlewares/journal.middleware.js est introuvable.');
  }
  let journal;
  try {
    journal = require(fichier);
  } catch (err) {
    return noter(titre, 'Le fichier middlewares/journal.middleware.js ne se charge pas. Une faute de frappe ? Lancez node middlewares/journal.middleware.js pour voir l\'erreur.');
  }
  if (typeof journal !== 'function') {
    return noter(titre, 'middlewares/journal.middleware.js doit exporter la fonction : module.exports = journal.');
  }

  // On appelle le journal avec une fausse requête et on regarde ce qu'il affiche.
  let affiche = '';
  let suivant = false;
  const logOriginal = console.log;
  console.log = (...morceaux) => {
    affiche += morceaux.join(' ') + '\n';
  };
  try {
    const fausseRequete = { method: 'GET', url: '/api/test-du-journal', originalUrl: '/api/test-du-journal', path: '/api/test-du-journal', headers: {} };
    const fausseReponse = { on() {}, once() {}, statusCode: 200 };
    journal(fausseRequete, fausseReponse, () => {
      suivant = true;
    });
  } catch (err) {
    console.log = logOriginal;
    return noter(titre, 'Le journal provoque une erreur quand il reçoit une requête. Gardez-le simple : un console.log, puis next().');
  }
  console.log = logOriginal;

  if (!affiche.includes('GET') || !affiche.includes('/api/test-du-journal')) {
    return noter(titre, 'Le journal doit afficher la méthode et l\'URL de chaque requête, avec req.method et req.url (slide 27).');
  }
  if (!suivant) {
    return noter(titre, 'Le journal n\'appelle pas next() : toutes les requêtes resteraient bloquées (slide 27).');
  }

  // Le journal est-il branché dans app.js ?
  let app;
  try {
    app = require(path.join(__dirname, 'app.js'));
  } catch (err) {
    if (err && err.code === 'MODULE_NOT_FOUND' && /express/.test(String(err.message))) {
      return noter(titre, 'Express n\'est pas installé dans ce dossier. Lancez npm install, puis relancez le vérificateur.');
    }
    return noter(titre, 'app.js ne se charge pas. Une faute de frappe ? Regardez le terminal du serveur.');
  }
  const routeur = app && (app.router || app._router);
  const couches = routeur && routeur.stack ? routeur.stack : [];
  let branche = false;
  for (let i = 0; i < couches.length; i++) {
    if (couches[i].handle === journal) {
      branche = true;
    }
  }
  if (!branche) {
    return noter(titre, 'Le journal est écrit mais pas branché. Dans app.js, ajoutez app.use(journal) avant les routes (slide 29).');
  }
  noter(titre, null);
}

// ---------- Exercice 4.2 : la validation ----------

async function verifierValidation() {
  const titre = 'Exercice 4.2 (souhaitable) Middleware de validation';

  const essai = await requete('POST', '/api/produits', PRODUIT_TEST);
  if (estProduit(essai.json) && (essai.statut === 201 || essai.statut === 200)) {
    idsCrees.push(essai.json.id);
  }
  if (essai.statut !== 201) {
    if (essai.statut === 400) {
      return noter(titre, 'POST /api/produits refuse un produit correct (400). Relisez vos règles dans middlewares/validation.middleware.js.');
    }
    return noter(titre, 'Faites d\'abord l\'exercice 2 : POST /api/produits doit accepter un produit correct (201).');
  }
  const cible = essai.json.id;

  const cas = [
    { libelle: 'sans nom', corps: { ...PRODUIT_TEST, nom: '' } },
    { libelle: 'avec la catégorie « bonbons »', corps: { ...PRODUIT_TEST, categorie: 'bonbons' } },
    { libelle: 'avec le prix « abc »', corps: { ...PRODUIT_TEST, prix: 'abc' } },
    { libelle: 'avec un prix de -2', corps: { ...PRODUIT_TEST, prix: -2 } },
    { libelle: 'avec un stock de -1', corps: { ...PRODUIT_TEST, stock: -1 } },
    { libelle: 'avec un stock de 2.5', corps: { ...PRODUIT_TEST, stock: 2.5 } }
  ];

  for (let i = 0; i < cas.length; i++) {
    const rep = await requete('POST', '/api/produits', cas[i].corps);
    if (estProduit(rep.json) && (rep.statut === 201 || rep.statut === 200)) {
      idsCrees.push(rep.json.id);
    }
    const libelle = `POST /api/produits ${cas[i].libelle}`;
    if (rep.statut !== 400) {
      if (rep.statut === 201) {
        return noter(titre, `${libelle} devait répondre 400, il répond 201 : le produit invalide a été accepté. Le middleware validerProduit vérifie-t-il cette règle, et est-il placé dans la route POST (slide 29) ?`);
      }
      return noter(titre, expliquer(libelle, rep, 400, 'creerProduit'));
    }
    if (!rep.json || typeof rep.json.message !== 'string') {
      return noter(titre, `${libelle} répond bien 400, mais sans message en JSON. Répondez res.status(400).json({ message: '...' }).`);
    }
  }

  const put = await requete('PUT', `/api/produits/${cible}`, { ...PRODUIT_TEST, prix: 'abc' });
  if (put.statut !== 400) {
    return noter(titre, `PUT /api/produits/${cible} avec le prix « abc » devait répondre 400, il répond ${put.statut || 'rien'}. Placez aussi validerProduit dans la route PUT.`);
  }
  noter(titre, null);
}

// ---------- Exercice 4.3 : les erreurs ----------

async function verifierErreurs() {
  const titre = 'Exercice 4.3 (souhaitable) Route introuvable et middleware d\'erreur';

  const inconnue = await requete('GET', '/api/route-qui-n-existe-pas');
  if (inconnue.panne) {
    return noter(titre, expliquer('GET /api/route-qui-n-existe-pas', inconnue, 404, ''));
  }
  if (inconnue.statut !== 404) {
    return noter(titre, `GET /api/route-qui-n-existe-pas devait répondre 404, il répond ${inconnue.statut}.`);
  }
  if (!inconnue.json || typeof inconnue.json.message !== 'string') {
    return noter(titre, 'Une route inconnue répond bien 404, mais en HTML (« Cannot GET »). Ajoutez à la fin de app.js un middleware qui répond res.status(404).json({ message: \'Route introuvable\' }).');
  }

  const panne = await requete('GET', '/api/panne');
  if (panne.panne === 'delai') {
    return noter(titre, 'GET /api/panne ne répond pas. Le middleware d\'erreur doit répondre avec res.status(500).json(...).');
  }
  if (panne.panne) {
    return noter(titre, expliquer('GET /api/panne', panne, 500, ''));
  }
  if (panne.statut !== 500) {
    return noter(titre, `GET /api/panne devait répondre 500, il répond ${panne.statut}. Le middleware d'erreur doit être le DERNIER app.use() de app.js (slide 32).`);
  }
  if (!panne.json || typeof panne.json.message !== 'string') {
    return noter(titre, 'GET /api/panne répond bien 500, mais en HTML et pas en JSON. Écrivez le middleware d\'erreur et branchez-le en dernier dans app.js (slide 32).');
  }
  noter(titre, null);
}

// ---------- Exercice 5 : bonus, la page d'accueil avec http ----------

async function verifierBonus() {
  const titre = `Exercice 5 (bonus) Page d'accueil avec http (port ${PORT_ACCUEIL})`;
  if (PORT_ACCUEIL === PORT_API) {
    return noter(titre, 'La page d\'accueil et l\'API ne peuvent pas utiliser le même port. Donnez deux ports différents.');
  }

  const rep = await requete('GET', '/', undefined, PORT_ACCUEIL);
  if (rep.panne === 'connexion') {
    return noter(titre, `Rien ne répond sur le port ${PORT_ACCUEIL}. Pour tester le bonus, lancez node accueil-http.js dans un troisième terminal.`);
  }
  if (rep.panne === 'delai') {
    return noter(titre, 'La page d\'accueil ne répond pas. Chaque chemin de votre fonction doit se terminer par res.end(...).');
  }
  if (rep.statut !== 200) {
    return noter(titre, `GET / devait répondre 200, il répond ${rep.statut}. Testez req.url === '/' et req.method === 'GET'.`);
  }
  if (!rep.type.includes('text/html')) {
    return noter(titre, 'GET / répond, mais pas en HTML. Utilisez res.writeHead(200, { \'Content-Type\': \'text/html; charset=utf-8\' }).');
  }
  if (!rep.texte.includes('GreenCart')) {
    return noter(titre, 'La page ne contient pas le titre GreenCart.');
  }
  const noms = ['Ferme des Trois Chênes', 'Verger de Lucie', 'Chèvrerie du Plateau', 'Rucher Martin'];
  for (let i = 0; i < noms.length; i++) {
    if (!rep.texte.includes(noms[i])) {
      return noter(titre, `La page ne cite pas le producteur « ${noms[i]} ». Parcourez tout le tableau producteurs avec une boucle for.`);
    }
  }
  const autre = await requete('GET', '/page-qui-n-existe-pas', undefined, PORT_ACCUEIL);
  if (autre.statut !== 404) {
    return noter(titre, `GET /page-qui-n-existe-pas devait répondre 404, il répond ${autre.statut || 'rien'}. Ajoutez un else avec res.writeHead(404, ...).`);
  }
  noter(titre, null);
}

// ---------- Remise en état ----------

async function nettoyer() {
  let restants = 0;
  for (let i = 0; i < idsCrees.length; i++) {
    const rep = await requete('DELETE', `/api/produits/${idsCrees[i]}`);
    if (rep.statut !== 204 && rep.statut !== 200) {
      const relu = await requete('GET', `/api/produits/${idsCrees[i]}`);
      if (relu.statut === 200) {
        restants++;
      }
    }
  }
  if (original12) {
    const actuel = await requete('GET', '/api/produits/12');
    if (actuel.json && JSON.stringify(actuel.json) !== JSON.stringify(original12)) {
      await requete('PUT', '/api/produits/12', original12);
    }
  }
  return restants;
}

// ---------- Programme principal ----------

async function principal() {
  if (typeof fetch !== 'function') {
    console.log('Ce vérificateur demande Node 18 ou plus. Tapez node -v pour voir votre version.');
    return;
  }

  console.log(`Vérification de l'atelier 3, API sur http://localhost:${PORT_API}`);
  console.log('');

  const serveurOk = await verifierDepart();
  if (serveurOk) {
    await verifierExercice1();
    await verifierExercice2();
    await verifierExercice3();
  }
  verifierJournal();
  if (serveurOk) {
    await verifierValidation();
    await verifierErreurs();
  }
  await verifierBonus();
  let restants = 0;
  if (serveurOk) {
    restants = await nettoyer();
  }

  let nbOk = 0;
  for (let i = 0; i < resultats.length; i++) {
    const r = resultats[i];
    if (r.ok) {
      nbOk++;
      console.log(`${r.titre} : OK`);
    } else {
      console.log(`${r.titre} : À revoir : ${r.probleme}`);
    }
  }
  console.log('');
  if (!serveurOk) {
    console.log('Les exercices 1, 2, 3, 4.2 et 4.3 n\'ont pas pu être vérifiés : l\'API ne répond pas.');
  }
  if (restants > 0) {
    console.log(`Note : ${restants} produit(s) de test restent en mémoire, car DELETE ne marche pas encore. Ils disparaissent quand le serveur redémarre.`);
  }
  console.log(`Résultat : ${nbOk} sur ${resultats.length} OK.`);
}

principal()
  .catch(() => {
    console.log('Le vérificateur a rencontré un problème inattendu. Relancez-le. Si cela continue, appelez le formateur.');
  })
  .finally(() => {
    process.exitCode = 0;
  });
