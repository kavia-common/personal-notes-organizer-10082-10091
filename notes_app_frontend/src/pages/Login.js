import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Login
 * Basic login page allowing users to enter username and password.
 * On success, persists user via AuthContext and redirects to main app.
 */
function Login({ onLoggedIn }) {
  const { login, loading, error } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', password: '' });
  const [localError, setLocalError] = useState('');

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      await login(form.username, form.password);
      if (onLoggedIn) onLoggedIn();
    } catch (err) {
      setLocalError(err?.message || 'Login failed');
    }
  };

  return (
    <div className="app" style={{ display: 'grid', gridTemplateRows: '1fr', placeItems: 'center' }}>
      <main className="content" style={{ maxWidth: 400, width: '100%' }}>
        <section className="editor" aria-label="Login form">
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: 'var(--color-primary)' }}>
            Sign in to Notes
          </div>

          {(error || localError) ? (
            <div className="helper" role="alert" style={{ color: '#b91c1c' }}>
              {error || localError}
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            <div className="row" style={{ gridTemplateColumns: '1fr' }}>
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={handleChange('username')}
                aria-label="Username"
                autoComplete="username"
              />
            </div>
            <div className="row" style={{ gridTemplateColumns: '1fr' }}>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange('password')}
                aria-label="Password"
                autoComplete="current-password"
              />
            </div>
            <div className="toolbar" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </form>
          <div className="helper" style={{ marginTop: 8 }}>
            Tip: Any non-empty username/password will sign you in (demo mode).
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
