from rest_framework import serializers
from .models import Etudiant

class EtudiantSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour le modèle Etudiant.
    Gère la conversion entre les objets Python et le format JSON,
    ainsi que la validation des données entrantes.
    """
    class Meta:
        model = Etudiant
        fields = [
            'id', 
            'nom', 
            'prenom', 
            'email', 
            'telephone', 
            'filiere', 
            'date_creation'
        ]
        read_only_fields = ['id', 'date_creation']

    def validate_nom(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Le nom ne peut pas être vide.")
        return val.upper()

    def validate_prenom(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Le prénom ne peut pas être vide.")
        return val.title()

    def validate_telephone(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Le numéro de téléphone est obligatoire.")
        return val

    def validate_filiere(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("La filière est obligatoire.")
        return val

