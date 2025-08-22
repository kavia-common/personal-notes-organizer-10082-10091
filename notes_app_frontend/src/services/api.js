/**
 * PUBLIC_INTERFACE
 * NotesAPI
 * Lightweight API client for Notes backend. Uses environment variable
 * REACT_APP_API_BASE_URL to construct endpoints. Expected backend routes:
 * - GET    /notes
 * - POST   /notes
 * - PUT    /notes/:id
 * - DELETE /notes/:id
 *
 * If REACT_APP_API_BASE_URL is not set, defaults to '' (same origin).
 */
export const API_BASE =
  (process.env.REACT_APP_API_BASE_URL || '').replace(/\/+$/, '');

async function http(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export const NotesAPI = {
  /** List notes (array) */
  async list() {
    return http('/notes', { method: 'GET' });
  },
  /** Create note; body: {title, content, category, tags[]} */
  async create(body) {
    return http('/notes', { method: 'POST', body: JSON.stringify(body) });
  },
  /** Update note by id */
  async update(id, body) {
    return http(`/notes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
  /** Delete note by id */
  async remove(id) {
    return http(`/notes/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
};
