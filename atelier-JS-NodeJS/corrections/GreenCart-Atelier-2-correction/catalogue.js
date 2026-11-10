// Catalogue GreenCart, copie de produits.json.
// Il est chargé par une balise script pour que la page marche
// même ouverte directement, sans serveur.
// Les prix sont HT, en euros.
const CATALOGUE = [
  {"id": 1, "nom": "Pommes Reinette", "categorie": "fruits", "prix": 3.2, "unite": "kg", "stock": 40, "bio": true, "producteurId": 2},
  {"id": 2, "nom": "Poires Williams", "categorie": "fruits", "prix": 3.6, "unite": "kg", "stock": 0, "bio": false, "producteurId": 2},
  {"id": 3, "nom": "Pruneaux d'Agen", "categorie": "epicerie", "prix": 7.9, "unite": "pot", "stock": 25, "bio": false, "producteurId": 2},
  {"id": 4, "nom": "Carottes", "categorie": "legumes", "prix": 1.8, "unite": "kg", "stock": 60, "bio": true, "producteurId": 1},
  {"id": 5, "nom": "Poireaux", "categorie": "legumes", "prix": 2.4, "unite": "botte", "stock": 15, "bio": true, "producteurId": 1},
  {"id": 6, "nom": "Pommes de terre", "categorie": "legumes", "prix": 1.5, "unite": "kg", "stock": 120, "bio": false, "producteurId": 1},
  {"id": 7, "nom": "Radis", "categorie": "legumes", "prix": 1.9, "unite": "botte", "stock": 3, "bio": true, "producteurId": 1},
  {"id": 8, "nom": "Fromage de chèvre frais", "categorie": "cremerie", "prix": 3.5, "unite": "piece", "stock": 30, "bio": true, "producteurId": 3},
  {"id": 9, "nom": "Tomme de chèvre", "categorie": "cremerie", "prix": 22, "unite": "kg", "stock": 8, "bio": false, "producteurId": 3},
  {"id": 10, "nom": "Yaourt au lait de chèvre", "categorie": "cremerie", "prix": 0.9, "unite": "piece", "stock": 0, "bio": true, "producteurId": 3},
  {"id": 11, "nom": "Miel de châtaignier", "categorie": "epicerie", "prix": 9.5, "unite": "pot", "stock": 18, "bio": false, "producteurId": 4},
  {"id": 12, "nom": "Miel d'acacia", "categorie": "epicerie", "prix": 10.5, "unite": "pot", "stock": 12, "bio": true, "producteurId": 4}
];
