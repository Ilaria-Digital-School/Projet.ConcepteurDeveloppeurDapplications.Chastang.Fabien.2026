import React from 'react';

export default function DeleteConfirmModal({
  isOpen,
  student,
  onClose,
  onConfirm,
  isDeleting,
}) {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h2>Confirmer la suppression</h2>
          <button className="close-btn" onClick={onClose} title="Fermer">
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: '1rem', color: '#334155' }}>
            Êtes-vous certain de vouloir supprimer l'étudiant suivant ?
          </p>
          <div
            style={{
              padding: '0.875rem 1rem',
              backgroundColor: '#fef2f2',
              borderRadius: '8px',
              border: '1px solid #fecaca',
              marginBottom: '1rem',
            }}
          >
            <div style={{ fontWeight: 700, color: '#991b1b' }}>
              {student.nom} {student.prenom}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#b91c1c' }}>
              {student.filiere} — {student.email}
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ⚠️ Cette action est irréversible et supprimera définitivement cet étudiant de la base de données.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Annuler
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={() => onConfirm(student.id)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
          </button>
        </div>
      </div>
    </div>
  );
}

