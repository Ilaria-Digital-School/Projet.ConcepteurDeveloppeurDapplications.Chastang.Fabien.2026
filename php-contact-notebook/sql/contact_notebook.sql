CREATE DATABASE contact_notebook DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

USE contact_notebook;

CREATE TABLE contacts (
	id int NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    phone varchar(20) NOT NULL,
    created_at datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	PRIMARY KEY (id),
	UNIQUE KEY id_UNIQUE (id)
);
