import React, { useState, useEffect } from 'react';

export default function StudentModal({
  isOpen,
  onClose,
  onSubmit,
  studentToEdit,
}) {
  const isEditing = Boolean(studentToEdit);

  const initialFormData = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    filiere: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        nom: studentToEdit.nom || '',
        prenom: studentToEdit.prenom || '',
        email: studentToEdit.email || '',
        telephone: studentToEdit.telephone || '',
        filiere: studentToEdit.filiere || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Réinitialise l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est obligatoire.';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est obligatoire.';
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse e-mail est obligatoire.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse e-mail valide.";
    }
    if (!formData.telephone.trim()) newErrors.telephone = 'Le numéro de téléphone est obligatoire.';
    if (!formData.filiere.trim()) newErrors.filiere = 'La filière est obligatoire.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData, studentToEdit?.id);
      onClose();
    } catch (err) {
      if (err.errors) {
        // Associe les erreurs retournées par l'API Django
        const apiErrors = {};
        for (const [key, val] of Object.entries(err.errors)) {
          apiErrors[key] = Array.isArray(val) ? val.join(' ') : String(val);
        }
        setErrors(apiErrors);
      } else {
        setErrors({ general: "Une erreur est survenue lors de l'enregistrement." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Modifier l'étudiant" : 'Ajouter un nouvel étudiant'}</h2>
          <button className="close-btn" onClick={onClose} title="Fermer">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.general && (
              <div className="error-text" style={{ marginBottom: '1rem', fontWeight: 600 }}>
                {errors.general}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nom">Nom *</label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  className={`form-control ${errors.nom ? 'error' : ''}`}
                  placeholder="Ex: DIOP"
                  value={formData.nom}
                  onChange={handleChange}
                  autoFocus
                />
                {errors.nom && <p className="error-text">{errors.nom}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="prenom">Prénom *</label>
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  className={`form-control ${errors.prenom ? 'error' : ''}`}
                  placeholder="Ex: Awa"
                  value={formData.prenom}
                  onChange={handleChange}
                />
                {errors.prenom && <p className="error-text">{errors.prenom}</p>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Adresse e-mail *</label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="Ex: awa.diop@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="telephone">Téléphone *</label>
              <input
                id="telephone"
                name="telephone"
                type="tel"
                className={`form-control ${errors.telephone ? 'error' : ''}`}
                placeholder="Ex: +221 77 123 45 67"
                value={formData.telephone}
                onChange={handleChange}
              />
              {errors.telephone && <p className="error-text">{errors.telephone}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="filiere">Filière / Formation *</label>
              <input
                id="filiere"
                name="filiere"
                type="text"
                className={`form-control ${errors.filiere ? 'error' : ''}`}
                placeholder="Ex: Génie Logiciel, Cybersécurité..."
                value={formData.filiere}
                onChange={handleChange}
                list="filieres-suggestions"
              />
              <datalist id="filieres-suggestions">
                <option value="Génie Logiciel" />
                <option value="Réseaux & Télécoms" />
                <option value="Cybersécurité" />
                <option value="Intelligence Artificielle" />
                <option value="Systèmes d'Information" />
              </datalist>
              {errors.filiere && <p className="error-text">{errors.filiere}</p>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

