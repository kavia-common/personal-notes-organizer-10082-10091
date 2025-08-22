/**
 * PUBLIC_INTERFACE
 * NotesList
 * Displays a grid of note cards. Each card shows title, snippet, meta, and actions.
 */
import React from 'react';

function NoteCard({ note, onEdit, onDelete }) {
  const { title, content, category, tags = [], updatedAt, createdAt } = note;
  const date = updatedAt || createdAt;
  const formatted = date ? new Date(date).toLocaleString() : '';

  return (
    <article className="note-card" aria-label={`Note: ${title || 'Untitled'}`}>
      <div className="note-title">{title || 'Untitled'}</div>
      <div className="note-meta">
        {category || 'Uncategorized'} • {formatted}
      </div>
      <div className="note-snippet">{(content || '').slice(0, 160)}</div>
      {!!tags.length && (
        <div className="note-tags">
          {tags.map((t, idx) => (
            <span key={`${t}-${idx}`} className="tag">#{t}</span>
          ))}
        </div>
      )}
      <div className="note-actions">
        <button className="btn" onClick={() => onEdit(note)}>Edit</button>
        <button className="btn btn-accent" onClick={() => onDelete(note.id)}>Delete</button>
      </div>
    </article>
  );
}

function NotesList({ notes, onEdit, onDelete }) {
  return (
    <section className="notes-grid" aria-live="polite">
      {notes.map((n) => (
        <NoteCard key={n.id} note={n} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </section>
  );
}

export default NotesList;
