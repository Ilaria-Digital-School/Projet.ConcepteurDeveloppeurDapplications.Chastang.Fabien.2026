import React from 'react';

export default function StudentList({
  students,
  isLoading,
  onEditStudent,
  onDeleteStudent,
}) {
  // Formatage pédagogique de la date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  // Initiales pour l'avatar
  const getInitials = (nom, prenom) => {
    const n = nom ? nom.charAt(0).toUpperCase() : '';
    const p = prenom ? prenom.charAt(0).toUpperCase() : '';
    return `${p}${n}` || 'ET';
  };

  if (isLoading) {
    return (
      <div className="table-card">
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Chargement des étudiants...</p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3>Aucun étudiant trouvé</h3>
          <p>Aucun enregistrement ne correspond à vos critères de recherche.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="student-table">
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Adresse E-mail</th>
              <th>Téléphone</th>
              <th>Filière</th>
              <th>Date d'inscription</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className="student-cell">
                    <div className="student-avatar">
                      {getInitials(student.nom, student.prenom)}
                    </div>
                    <div>
                      <div className="student-name-strong">
                        {student.nom} {student.prenom}
                      </div>
                      <small style={{ color: 'var(--text-muted)' }}>ID #{student.id}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <a href={`mailto:${student.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {student.email}
                  </a>
                </td>
                <td>{student.telephone}</td>
                <td>
                  <span className="student-badge">{student.filiere}</span>
                </td>
                <td>{formatDate(student.date_creation)}</td>
                <td style={{ textAlign: 'right' }}>
                  <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className="btn-icon edit"
                      title="Modifier cet étudiant"
                      onClick={() => onEditStudent(student)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      className="btn-icon delete"
                      title="Supprimer cet étudiant"
                      onClick={() => onDeleteStudent(student)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

