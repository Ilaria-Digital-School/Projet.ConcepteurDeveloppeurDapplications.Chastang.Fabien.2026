<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class TaskSeeder extends Seeder
{
    // Run the database seeds
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        Task::truncate();
        Schema::enableForeignKeyConstraints();

        $tasks = [
            [
                'title' => 'Créer la page d’accueil',
                'description' => 'Développer la structure principale de la page d’accueil.',
            ],
            [
                'title' => 'Configurer la base de données',
                'description' => 'Créer et configurer les tables nécessaires.',
            ],
            [
                'title' => 'Créer le formulaire de connexion',
                'description' => 'Mettre en place le formulaire d’authentification.',
            ],
            [
                'title' => 'Développer le CRUD des projets',
                'description' => 'Ajouter la création, lecture, modification et suppression des projets.',
            ],
            [
                'title' => 'Ajouter la validation des formulaires',
                'description' => 'Valider les données envoyées par les utilisateurs.',
            ],
            [
                'title' => 'Créer les routes API',
                'description' => 'Définir les routes nécessaires pour l’API.',
            ],
            [
                'title' => 'Tester les endpoints',
                'description' => 'Vérifier le fonctionnement des différents endpoints.',
            ],
            [
                'title' => 'Ajouter la pagination',
                'description' => 'Mettre en place la pagination sur la liste des tâches.',
            ],
            [
                'title' => 'Corriger les bugs',
                'description' => 'Identifier et corriger les erreurs détectées.',
            ],
            [
                'title' => 'Préparer le déploiement',
                'description' => 'Configurer l’application pour la mise en production.',
            ],
        ];

        foreach ($tasks as $task) Task::create($task);
    }
}
