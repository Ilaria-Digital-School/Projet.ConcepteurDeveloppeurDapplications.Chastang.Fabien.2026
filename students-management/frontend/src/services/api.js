/**
 * Service API pour communiquer avec le backend Django REST Framework.
 */

// L'URL de l'API est configurable via les variables d'environnement (Vite)
// Valeur par défaut : http://localhost:8000/api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Récupère la liste des étudiants (avec recherche optionnelle).
 * @param {string} search - Terme de recherche par nom ou prénom
 */
export async function fetchEtudiants(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await fetch(`${API_URL}/etudiants/${query}`);
  
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des étudiants');
  }
  return response.json();
}

/**
 * Récupère un étudiant spécifique par son ID.
 * @param {number|string} id 
 */
export async function fetchEtudiantById(id) {
  const response = await fetch(`${API_URL}/etudiants/${id}/`);
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération de l'étudiant #${id}`);
  }
  return response.json();
}

/**
 * Crée un nouvel étudiant.
 * @param {Object} etudiantData - { nom, prenom, email, telephone, filiere }
 */
export async function createEtudiant(etudiantData) {
  const response = await fetch(`${API_URL}/etudiants/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(etudiantData),
  });

  const data = await response.json();
  if (!response.ok) {
    // Si DRF retourne des erreurs de validation (ex: { email: ["..."] })
    throw { status: response.status, errors: data };
  }
  return data;
}

/**
 * Met à jour un étudiant existant.
 * @param {number|string} id 
 * @param {Object} etudiantData 
 */
export async function updateEtudiant(id, etudiantData) {
  const response = await fetch(`${API_URL}/etudiants/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(etudiantData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw { status: response.status, errors: data };
  }
  return data;
}

/**
 * Supprime un étudiant.
 * @param {number|string} id 
 */
export async function deleteEtudiant(id) {
  const response = await fetch(`${API_URL}/etudiants/${id}/`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(`Erreur lors de la suppression de l'étudiant #${id}`);
  }
  return true;
}

