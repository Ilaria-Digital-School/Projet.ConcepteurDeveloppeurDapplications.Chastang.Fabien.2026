import React from 'react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
          </svg>
        </div>
        <div>
          <h1>Gestion des Étudiants</h1>
          <p>Plateforme académique de suivi et d'administration</p>
        </div>
      </div>
    </header>
  );
}

