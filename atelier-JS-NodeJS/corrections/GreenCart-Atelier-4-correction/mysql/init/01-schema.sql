-- Schéma relationnel GreenCart. Lancé une seule fois par MySQL, au premier "docker compose up -d".
SET NAMES utf8mb4;

CREATE TABLE producteurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  ville VARCHAR(100) NOT NULL
);

CREATE TABLE produits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  categorie ENUM('fruits', 'legumes', 'cremerie', 'epicerie') NOT NULL,
  prix DECIMAL(8, 2) NOT NULL,             -- prix HT en euros
  unite ENUM('kg', 'piece', 'botte', 'pot') NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  bio BOOLEAN NOT NULL DEFAULT FALSE,
  producteur_id INT NOT NULL,
  CONSTRAINT chk_produits_stock CHECK (stock >= 0),   -- la base refuse un stock négatif
  CONSTRAINT fk_produits_producteur FOREIGN KEY (producteur_id) REFERENCES producteurs (id)
);

CREATE TABLE commandes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client VARCHAR(100) NOT NULL,
  statut ENUM('en_attente', 'validee', 'livree') NOT NULL DEFAULT 'en_attente',
  total_ht DECIMAL(10, 2) NOT NULL,
  total_ttc DECIMAL(10, 2) NOT NULL,
  frais_livraison DECIMAL(10, 2) NOT NULL,
  montant_a_payer DECIMAL(10, 2) NOT NULL,
  cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Une ligne = un produit dans une commande
CREATE TABLE lignes_commande (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commande_id INT NOT NULL,
  produit_id INT NOT NULL,
  quantite INT NOT NULL,
  prix_unitaire_ht DECIMAL(8, 2) NOT NULL,  -- le prix au moment de la commande
  CONSTRAINT chk_lignes_quantite CHECK (quantite >= 1),
  CONSTRAINT fk_lignes_commande FOREIGN KEY (commande_id) REFERENCES commandes (id) ON DELETE CASCADE,
  CONSTRAINT fk_lignes_produit FOREIGN KEY (produit_id) REFERENCES produits (id)
);

-- Pour le bonus JWT
CREATE TABLE utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe_hash VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'client'
);
