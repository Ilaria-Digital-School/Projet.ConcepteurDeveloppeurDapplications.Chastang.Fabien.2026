import React from 'react';

export default function SearchBar({ searchTerm, onSearchChange, onOpenAddModal }) {
  return (
    <div className="controls-card">
      <div className="search-box">
        <span className="search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher par nom, prénom ou filière..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button 
            type="button" 
            className="clear-search-btn" 
            onClick={() => onSearchChange('')}
            title="Effacer la recherche"
          >
            ✕
          </button>
        )}
      </div>

      <button className="btn-primary" onClick={onOpenAddModal}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Ajouter un étudiant
      </button>
    </div>
  );
}

