import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, clearToken } from '../api';
import Navbar from '../components/Navbar';
import MetricsSection from '../components/MetricsSection';
import AnalyzeMealSection from '../components/AnalyzeMealSection';
import './Dashboard.css';

function Dashboard({ setIsAuthenticated }) {
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setMetricsLoading(true);
      const result = await apiFetch('/daily-macros');
      setMetrics(result.total_macros);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setMetricsLoading(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <Navbar onLogout={handleLogout} />
      <main className="dashboard-main">
        <MetricsSection metrics={metrics} loading={metricsLoading} onRefresh={loadMetrics} />
        <AnalyzeMealSection onMealAnalyzed={loadMetrics} />
      </main>
    </div>
  );
}

export default Dashboard;
