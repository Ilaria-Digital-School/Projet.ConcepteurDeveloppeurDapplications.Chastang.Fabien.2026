-- Données GreenCart (identiques à _commun/producteurs.json et _commun/produits.json).
SET NAMES utf8mb4;

INSERT INTO producteurs (id, nom, ville) VALUES
  (1, 'Ferme des Trois Chênes', 'Saint-Émilion'),
  (2, 'Verger de Lucie', 'Agen'),
  (3, 'Chèvrerie du Plateau', 'Millau'),
  (4, 'Rucher Martin', 'Bazas');

INSERT INTO produits (id, nom, categorie, prix, unite, stock, bio, producteur_id) VALUES
  (1, 'Pommes Reinette', 'fruits', 3.20, 'kg', 40, TRUE, 2),
  (2, 'Poires Williams', 'fruits', 3.60, 'kg', 0, FALSE, 2),
  (3, 'Pruneaux d''Agen', 'epicerie', 7.90, 'pot', 25, FALSE, 2),
  (4, 'Carottes', 'legumes', 1.80, 'kg', 60, TRUE, 1),
  (5, 'Poireaux', 'legumes', 2.40, 'botte', 15, TRUE, 1),
  (6, 'Pommes de terre', 'legumes', 1.50, 'kg', 120, FALSE, 1),
  (7, 'Radis', 'legumes', 1.90, 'botte', 3, TRUE, 1),
  (8, 'Fromage de chèvre frais', 'cremerie', 3.50, 'piece', 30, TRUE, 3),
  (9, 'Tomme de chèvre', 'cremerie', 22.00, 'kg', 8, FALSE, 3),
  (10, 'Yaourt au lait de chèvre', 'cremerie', 0.90, 'piece', 0, TRUE, 3),
  (11, 'Miel de châtaignier', 'epicerie', 9.50, 'pot', 18, FALSE, 4),
  (12, 'Miel d''acacia', 'epicerie', 10.50, 'pot', 12, TRUE, 4);

-- Compte du bonus JWT. Mot de passe : greencart (haché avec bcrypt).
INSERT INTO utilisateurs (email, mot_de_passe_hash, role) VALUES
  ('admin@greencart.test', '$2a$10$xmpWZGTbGVkbKWNbQt8p3OH6taKNLNgsq5fX3D9cXQX4np0VqyQHC', 'admin');
