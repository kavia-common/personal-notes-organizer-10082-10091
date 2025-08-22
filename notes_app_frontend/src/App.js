import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import { NotesAPI } from './services/api';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import useDebounce from './hooks/useDebounce';

/**
 * PUBLIC_INTERFACE
 * App
 * The root component that composes the layout (navbar + sidebar + content),
 * handles data fetching, state management for notes, categories, search,
 * and wires CRUD actions to the backend via the NotesAPI service.
 */
function App() {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState(['All', 'Personal', 'Work', 'Ideas', 'Archive']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // note being edited or null
  const [error, setError] = useState('');

  const debouncedSearch = useDebounce(search, 250);

  // Initial load
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    NotesAPI.list()
      .then((data) => {
        if (!mounted) return;
        setNotes(data || []);
        // Derive categories from notes
        const derived = Array.from(
          new Set(['All', ...((data || []).map(n => n.category || 'Uncategorized'))])
        );
        setCategories(derived);
      })
      .catch((e) => setError(e?.message || 'Failed to load notes'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  // Derived filtered notes
  const filteredNotes = useMemo(() => {
    const byCategory = activeCategory === 'All'
      ? notes
      : notes.filter(n => (n.category || 'Uncategorized') === activeCategory);
    if (!debouncedSearch) return byCategory;
    const q = debouncedSearch.toLowerCase();
    return byCategory.filter(n =>
      (n.title || '').toLowerCase().includes(q) ||
      (n.content || '').toLowerCase().includes(q) ||
      (n.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }, [notes, activeCategory, debouncedSearch]);

  // PUBLIC_INTERFACE
  // Creates a new note (optimistic UI)
  const handleCreate = async () => {
    const draft = {
      title: 'Untitled note',
      content: '',
      category: activeCategory === 'All' ? 'Personal' : activeCategory,
      tags: [],
    };
    try {
      setError('');
      const created = await NotesAPI.create(draft);
      setNotes(prev => [created, ...prev]);
      setEditing(created);
      if (created?.category && !categories.includes(created.category)) {
        setCategories(prev => [...prev, created.category]);
      }
    } catch (e) {
      setError(e?.message || 'Failed to create note');
    }
  };

  // PUBLIC_INTERFACE
  // Saves updates to a note
  const handleSave = async (note) => {
    try {
      setError('');
      const saved = await NotesAPI.update(note.id, note);
      setNotes(prev => prev.map(n => (n.id === saved.id ? saved : n)));
      setEditing(null);
      // Update categories if changed
      if (saved?.category && !categories.includes(saved.category)) {
        setCategories(prev => [...prev, saved.category]);
      }
    } catch (e) {
      setError(e?.message || 'Failed to save note');
    }
  };

  // PUBLIC_INTERFACE
  // Deletes a note
  const handleDelete = async (id) => {
    try {
      setError('');
      await NotesAPI.remove(id);
      setNotes(prev => prev.filter(n => n.id !== id));
      if (editing?.id === id) setEditing(null);
    } catch (e) {
      setError(e?.message || 'Failed to delete note');
    }
  };

  // PUBLIC_INTERFACE
  // Opens a note in editor
  const handleEdit = (note) => {
    setEditing(note);
  };

  // PUBLIC_INTERFACE
  // Cancels editing
  const handleCancelEdit = () => {
    setEditing(null);
  };

  return (
    <div className="app">
      <NavBar
        onCreate={handleCreate}
        search={search}
        onSearch={setSearch}
        loading={loading}
      />
      <div className="layout">
        <Sidebar
          categories={categories}
          active={activeCategory}
          onSelect={setActiveCategory}
        />
        <main className="content">
          {error ? (
            <div className="editor" role="alert">
              <div className="helper">Error: {error}</div>
            </div>
          ) : null}

          {editing ? (
            <NoteEditor
              key={editing.id}
              note={editing}
              onSave={handleSave}
              onCancel={handleCancelEdit}
              onDelete={() => handleDelete(editing.id)}
            />
          ) : (
            <div className="editor">
              <div className="helper">
                Select a note to edit or create a new one.
              </div>
            </div>
          )}

          <NotesList
            notes={filteredNotes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {!filteredNotes.length && !loading ? (
            <div className="empty">No notes found. Try creating one!</div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default App;
