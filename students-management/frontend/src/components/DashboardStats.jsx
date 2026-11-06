import React from 'react';

export default function DashboardStats({ students }) {
  const totalStudents = students.length;

  // Calcul du nombre de filières uniques
  const distinctFilieres = new Set(
    students.map((s) => s.filiere?.trim()).filter(Boolean)
  ).size;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div className="stat-details">
          <h3>{totalStudents}</h3>
          <p>Total Étudiants</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon purple">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <div className="stat-details">
          <h3>{distinctFilieres}</h3>
          <p>Filières Actives</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <div className="stat-details">
          <h3>En ligne</h3>
          <p>Statut du Système</p>
        </div>
      </div>
    </div>
  );
}

