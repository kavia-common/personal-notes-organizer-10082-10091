/**
 * PUBLIC_INTERFACE
 * Sidebar
 * Renders note categories and allows filtering by category.
 */
import React from 'react';

function Sidebar({ categories, active, onSelect }) {
  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="section-title">Categories</div>
      <nav className="category-list" aria-label="Note categories">
        {categories.map((c) => (
          <button
            key={c}
            className={`category-item ${c === active ? 'active' : ''}`}
            onClick={() => onSelect(c)}
            aria-current={c === active ? 'page' : undefined}
          >
            <span aria-hidden>🗂</span>
            <span>{c}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
