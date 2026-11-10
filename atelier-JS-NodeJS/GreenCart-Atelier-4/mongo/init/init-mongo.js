// Chargement des données GreenCart dans la base "greencart".
// Ce script est lancé une seule fois par MongoDB, au premier "docker compose up -d".
// Les noms des collections sont ceux que Mongoose déduit des modèles :
// Producteur -> producteurs, Produit -> produits, Commande -> commandes, Utilisateur -> utilisateurs.

const producteurs = [
  { id: 1, nom: 'Ferme des Trois Chênes', ville: 'Saint-Émilion' },
  { id: 2, nom: 'Verger de Lucie', ville: 'Agen' },
  { id: 3, nom: 'Chèvrerie du Plateau', ville: 'Millau' },
  { id: 4, nom: 'Rucher Martin', ville: 'Bazas' },
];

const produits = [
  { nom: 'Pommes Reinette', categorie: 'fruits', prix: 3.2, unite: 'kg', stock: 40, bio: true, producteur: 2 },
  { nom: 'Poires Williams', categorie: 'fruits', prix: 3.6, unite: 'kg', stock: 0, bio: false, producteur: 2 },
  { nom: "Pruneaux d'Agen", categorie: 'epicerie', prix: 7.9, unite: 'pot', stock: 25, bio: false, producteur: 2 },
  { nom: 'Carottes', categorie: 'legumes', prix: 1.8, unite: 'kg', stock: 60, bio: true, producteur: 1 },
  { nom: 'Poireaux', categorie: 'legumes', prix: 2.4, unite: 'botte', stock: 15, bio: true, producteur: 1 },
  { nom: 'Pommes de terre', categorie: 'legumes', prix: 1.5, unite: 'kg', stock: 120, bio: false, producteur: 1 },
  { nom: 'Radis', categorie: 'legumes', prix: 1.9, unite: 'botte', stock: 3, bio: true, producteur: 1 },
  { nom: 'Fromage de chèvre frais', categorie: 'cremerie', prix: 3.5, unite: 'piece', stock: 30, bio: true, producteur: 3 },
  { nom: 'Tomme de chèvre', categorie: 'cremerie', prix: 22.0, unite: 'kg', stock: 8, bio: false, producteur: 3 },
  { nom: 'Yaourt au lait de chèvre', categorie: 'cremerie', prix: 0.9, unite: 'piece', stock: 0, bio: true, producteur: 3 },
  { nom: 'Miel de châtaignier', categorie: 'epicerie', prix: 9.5, unite: 'pot', stock: 18, bio: false, producteur: 4 },
  { nom: "Miel d'acacia", categorie: 'epicerie', prix: 10.5, unite: 'pot', stock: 12, bio: true, producteur: 4 },
];

// 1. Les producteurs. On garde, pour chaque numéro du fichier commun, l'ObjectId créé par MongoDB.
const idsProducteurs = {};
for (let i = 0; i < producteurs.length; i++) {
  const p = producteurs[i];
  const resultat = db.producteurs.insertOne({ nom: p.nom, ville: p.ville });
  idsProducteurs[p.id] = resultat.insertedId;
}

// 2. Les produits, reliés à leur producteur par son ObjectId.
for (let i = 0; i < produits.length; i++) {
  const p = produits[i];
  db.produits.insertOne({
    nom: p.nom,
    categorie: p.categorie,
    prix: p.prix,
    unite: p.unite,
    stock: p.stock,
    bio: p.bio,
    producteurId: idsProducteurs[p.producteur],
  });
}

// 3. Un compte pour le bonus JWT. Mot de passe : greencart (haché avec bcrypt).
db.utilisateurs.insertOne({
  email: 'admin@greencart.test',
  motDePasseHash: '$2a$10$xmpWZGTbGVkbKWNbQt8p3OH6taKNLNgsq5fX3D9cXQX4np0VqyQHC',
  role: 'admin',
});

db.utilisateurs.createIndex({ email: 1 }, { unique: true });
db.createCollection('commandes');

print('GreenCart : ' + db.producteurs.countDocuments() + ' producteurs et ' + db.produits.countDocuments() + ' produits chargés.');
