import './MetricCard.css';

function MetricCard({ icon: Icon, label, value, unit, loading }) {
  return (
    <div className={`metric-card ${loading ? 'loading' : ''}`}>
      <div className="metric-header">
        <Icon size={20} className="metric-icon" />
        <span className="metric-label">{label}</span>
      </div>
      <div className="metric-value">
        {loading ? '-' : value}
      </div>
      <div className="metric-unit">{unit}</div>
    </div>
  );
}

export default MetricCard;
