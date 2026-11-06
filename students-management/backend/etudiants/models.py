from django.db import models

class Etudiant(models.Model):
    """
    Modèle représentant un étudiant dans l'établissement.
    Correspond à la table 'etudiants' dans la base de données MySQL.
    """
    nom = models.CharField(
        max_length=100, 
        verbose_name="Nom",
        help_text="Nom de famille de l'étudiant"
    )
    prenom = models.CharField(
        max_length=100, 
        verbose_name="Prénom",
        help_text="Prénom de l'étudiant"
    )
    email = models.EmailField(
        max_length=150, 
        unique=True,
        verbose_name="Adresse e-mail",
        help_text="Adresse e-mail unique de l'étudiant"
    )
    telephone = models.CharField(
        max_length=25, 
        verbose_name="Téléphone",
        help_text="Numéro de téléphone de contact"
    )
    filiere = models.CharField(
        max_length=100, 
        verbose_name="Filière / Formation",
        help_text="Nom de la filière ou de la formation suivie"
    )
    date_creation = models.DateTimeField(
        auto_now_add=True, 
        verbose_name="Date d'enregistrement",
        help_text="Horodatage automatique de la création"
    )

    class Meta:
        db_table = 'etudiants'
        ordering = ['-date_creation']
        verbose_name = "Étudiant"
        verbose_name_plural = "Étudiants"

    def __str__(self):
        return f"{self.prenom} {self.nom} ({self.filiere})"

