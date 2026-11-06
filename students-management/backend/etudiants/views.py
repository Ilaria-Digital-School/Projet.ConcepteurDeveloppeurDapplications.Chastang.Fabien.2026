from rest_framework import viewsets, filters
from django.db.models import Q
from .models import Etudiant
from .serializers import EtudiantSerializer

class EtudiantViewSet(viewsets.ModelViewSet):
    """
    API ViewSet pour gérer le cycle de vie complet des étudiants :
    - GET /api/etudiants/ : liste des étudiants (avec filtrage/recherche)
    - POST /api/etudiants/ : création d'un étudiant
    - GET /api/etudiants/<id>/ : détails d'un étudiant
    - PUT /api/etudiants/<id>/ : modification complète d'un étudiant
    - PATCH /api/etudiants/<id>/ : modification partielle
    - DELETE /api/etudiants/<id>/ : suppression d'un étudiant
    """
    serializer_class = EtudiantSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom', 'prenom', 'email', 'filiere']

    def get_queryset(self):
        """
        Retourne la liste des étudiants avec support de la recherche
        par nom, prénom ou filière via le paramètre '?search='.
        """
        queryset = Etudiant.objects.all()
        recherche = self.request.query_params.get('search', None)
        
        if recherche:
            terme = recherche.strip()
            queryset = queryset.filter(
                Q(nom__icontains=terme) |
                Q(prenom__icontains=terme) |
                Q(email__icontains=terme) |
                Q(filiere__icontains=terme)
            )
            
        return queryset

