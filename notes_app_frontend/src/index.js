import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';

function RouterGate() {
  const { user } = useContext(AuthContext);
  const [path, setPath] = useState(window.location.pathname);

  // Basic hashless navigation handler
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // If user not logged in, always show Login page regardless of path,
  // but allow redirect back to original path after login.
  if (!user) {
    return (
      <Login
        onLoggedIn={() => {
          // After login, navigate to original path or home
          const target = path && path !== '/login' ? path : '/';
          if (window.location.pathname !== target) {
            window.history.replaceState({}, '', target);
          }
          // trigger rerender by updating state
          setPath(target);
        }}
      />
    );
  }

  // Simple "route": if /login and user is logged in, redirect home
  if (path === '/login') {
    if (window.location.pathname !== '/') {
      window.history.replaceState({}, '', '/');
    }
  }

  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterGate />
    </AuthProvider>
  </React.StrictMode>
);
