import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getToken } from './api';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function RouteContainer({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-animation">
      {children}
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="app-shell" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Loading…</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <RouteContainer>
              {isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
            </RouteContainer>
          }
        />
        <Route
          path="/register"
          element={
            <RouteContainer>
              {isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
            </RouteContainer>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RouteContainer>
              {isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
            </RouteContainer>
          }
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
