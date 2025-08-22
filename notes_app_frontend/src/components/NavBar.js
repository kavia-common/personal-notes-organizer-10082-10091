/**
 * PUBLIC_INTERFACE
 * NavBar
 * Top navigation bar with brand, global search, and primary action buttons.
 */
import React from 'react';

function NavBar({ onCreate, search, onSearch, loading }) {
  return (
    <header className="navbar" role="banner">
      <div className="brand" aria-label="Notes App">
        <div className="brand-badge">N</div>
        Notes
      </div>
      <div className="searchbar" role="search">
        <span className="icon" aria-hidden>🔎</span>
        <input
          type="search"
          placeholder="Search notes by title, content, or tag…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search notes"
        />
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={onCreate} disabled={loading}>
          + New note
        </button>
      </div>
    </header>
  );
}

export default NavBar;
