-- Script d'initialisation de la base de données MySQL
-- Utilisé lors du premier démarrage du conteneur MySQL si nécessaire

CREATE DATABASE IF NOT EXISTS gestion_etudiants_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestion_etudiants_db;

-- Table des étudiants (créée automatiquement par les migrations Django)
-- Ce fichier sert de référence documentaire SQL et peut être monté dans docker-entrypoint-initdb.d
CREATE TABLE IF NOT EXISTS etudiants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telephone VARCHAR(25) NOT NULL,
    filiere VARCHAR(100) NOT NULL,
    date_creation DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion de données de démonstration pédagogiques
INSERT INTO etudiants (nom, prenom, email, telephone, filiere, date_creation)
SELECT 'DIOP', 'Awa', 'awa.diop@example.com', '+221 77 123 45 67', 'Génie Logiciel', NOW()
WHERE NOT EXISTS (SELECT 1 FROM etudiants WHERE email = 'awa.diop@example.com');

INSERT INTO etudiants (nom, prenom, email, telephone, filiere, date_creation)
SELECT 'FALL', 'Moussa', 'moussa.fall@example.com', '+221 70 987 65 43', 'Réseaux & Télécoms', NOW()
WHERE NOT EXISTS (SELECT 1 FROM etudiants WHERE email = 'moussa.fall@example.com');

INSERT INTO etudiants (nom, prenom, email, telephone, filiere, date_creation)
SELECT 'TRAORE', 'Fatou', 'fatou.traore@example.com', '+221 76 555 44 33', 'Cybersécurité', NOW()
WHERE NOT EXISTS (SELECT 1 FROM etudiants WHERE email = 'fatou.traore@example.com');

