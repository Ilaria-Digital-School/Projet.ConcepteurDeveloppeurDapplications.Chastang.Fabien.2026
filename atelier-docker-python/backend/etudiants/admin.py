from django.contrib import admin
from .models import Etudiant

@admin.register(Etudiant)
class EtudiantAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom', 'prenom', 'email', 'telephone', 'filiere', 'date_creation')
    search_fields = ('nom', 'prenom', 'email', 'filiere')
    list_filter = ('filiere', 'date_creation')
    ordering = ('-date_creation',)

