from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Etudiant

class EtudiantAPITests(APITestCase):
    """
    Suite de tests automatisés pour valider le bon fonctionnement
    de l'ensemble des endpoints de l'API REST de gestion des étudiants.
    """

    def setUp(self):
        """Initialisation des données de test avant chaque test."""
        self.etudiant_initial = Etudiant.objects.create(
            nom="DUPONT",
            prenom="Jean",
            email="jean.dupont@test.com",
            telephone="0123456789",
            filiere="Informatique"
        )
        self.list_url = reverse('etudiant-list')
        self.detail_url = reverse('etudiant-detail', kwargs={'pk': self.etudiant_initial.pk})

    def test_lister_etudiants(self):
        """1. Vérifier la récupération de la liste des étudiants (GET /api/etudiants/)."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_creer_etudiant_succes(self):
        """2. Vérifier l'ajout d'un étudiant avec des données valides (POST /api/etudiants/)."""
        data = {
            "nom": "Sow",
            "prenom": "Aminata",
            "email": "aminata.sow@test.com",
            "telephone": "+221 77 111 22 33",
            "filiere": "Intelligence Artificielle"
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nom'], "SOW") # Nettoyage en majuscule
        self.assertEqual(response.data['email'], "aminata.sow@test.com")
        self.assertEqual(Etudiant.objects.count(), 2)

    def test_creer_etudiant_email_invalide(self):
        """3. Vérifier le rejet d'un e-mail mal formé (Validation)."""
        data = {
            "nom": "Kane",
            "prenom": "Ibrahima",
            "email": "email-pas-valide",
            "telephone": "0606060606",
            "filiere": "Systèmes & Réseaux"
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_creer_etudiant_champs_obligatoires(self):
        """4. Vérifier que tous les champs obligatoires sont exigés."""
        data = {
            "nom": "",
            "prenom": "Test"
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_recuperer_etudiant_par_id(self):
        """5. Vérifier la récupération d'un étudiant unique (GET /api/etudiants/<id>/)."""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.etudiant_initial.email)

    def test_modifier_etudiant(self):
        """6. Vérifier la modification complète d'un étudiant (PUT /api/etudiants/<id>/)."""
        update_data = {
            "nom": "DUPONT MODIFIE",
            "prenom": "Jean-Marc",
            "email": "jean.dupont@test.com",
            "telephone": "0987654321",
            "filiere": "Génie Logiciel Avancé"
        }
        response = self.client.put(self.detail_url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.etudiant_initial.refresh_from_db()
        self.assertEqual(self.etudiant_initial.prenom, "Jean-Marc")
        self.assertEqual(self.etudiant_initial.filiere, "Génie Logiciel Avancé")

    def test_supprimer_etudiant(self):
        """7. Vérifier la suppression d'un étudiant (DELETE /api/etudiants/<id>/)."""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Etudiant.objects.filter(pk=self.etudiant_initial.pk).exists())

    def test_recherche_etudiant(self):
        """8. Vérifier le filtrage de recherche par nom ou prénom (?search=...)."""
        Etudiant.objects.create(
            nom="BAH",
            prenom="Ousmane",
            email="ousmane.bah@test.com",
            telephone="0102030405",
            filiere="Cybersécurité"
        )
        # Recherche par nom "BAH"
        response = self.client.get(f"{self.list_url}?search=BAH")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nom'], "BAH")

        # Recherche par prénom "Jean"
        response = self.client.get(f"{self.list_url}?search=Jean")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['prenom'], "Jean")

