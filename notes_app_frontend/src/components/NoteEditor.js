/**
 * PUBLIC_INTERFACE
 * NoteEditor
 * Editor form for creating/updating a single note.
 * Props:
 * - note: { id, title, content, category, tags[] }
 * - onSave(note)
 * - onCancel()
 * - onDelete()
 */
import React, { useMemo, useState } from 'react';

const CATEGORIES = ['Personal', 'Work', 'Ideas', 'Archive', 'Uncategorized'];

function parseTags(input) {
  return (input || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

function NoteEditor({ note, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState({
    title: note.title || '',
    content: note.content || '',
    category: note.category || 'Personal',
    tags: note.tags || [],
  });
  const [busy, setBusy] = useState(false);
  const tagsInput = useMemo(() => form.tags.join(', '), [form.tags]);

  const disabled = busy || !form.title.trim();

  const handleChange = (field) => (e) => {
    if (field === 'tags') {
      setForm((f) => ({ ...f, tags: parseTags(e.target.value) }));
    } else {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    }
  };

  const handleSave = async () => {
    try {
      setBusy(true);
      await onSave({ ...note, ...form });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="editor" aria-label="Note editor">
      <div className="row">
        <input
          type="text"
          placeholder="Note title"
          value={form.title}
          onChange={handleChange('title')}
          aria-label="Title"
        />
        <select
          value={form.category}
          onChange={handleChange('category')}
          aria-label="Category"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="row" style={{ gridTemplateColumns: '1fr' }}>
        <textarea
          placeholder="Write your note..."
          value={form.content}
          onChange={handleChange('content')}
          aria-label="Content"
        />
      </div>

      <div className="row" style={{ gridTemplateColumns: '1fr' }}>
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tagsInput}
          onChange={handleChange('tags')}
          aria-label="Tags"
        />
      </div>

      <div className="toolbar">
        {onDelete && note?.id ? (
          <button className="btn btn-accent" onClick={onDelete} disabled={busy}>
            Delete
          </button>
        ) : null}
        <button className="btn" onClick={onCancel} disabled={busy}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={disabled}>
          Save
        </button>
      </div>
    </section>
  );
}

export default NoteEditor;
