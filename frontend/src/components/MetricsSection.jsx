import { Flame, Leaf, Wheat, Droplet, RotateCw } from 'lucide-react';
import MetricCard from './MetricCard';
import './MetricsSection.css';

function MetricsSection({ metrics, loading, onRefresh }) {
  const defaultMetrics = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  // Backend may return either { total_macros: { calories, protein, ... } }
  // or already the inner object. Support both shapes.
  const data = metrics || defaultMetrics;

  const totalCalories = Math.round((data.total_calories ?? data.calories ?? 0));
  const totalProtein = Number((data.total_protein ?? data.protein ?? 0).toFixed ? (data.total_protein ?? data.protein ?? 0) : (data.total_protein ?? data.protein ?? 0));
  const totalCarbs = Number((data.total_carbs ?? data.carbs ?? 0).toFixed ? (data.total_carbs ?? data.carbs ?? 0) : (data.total_carbs ?? data.carbs ?? 0));
  const totalFat = Number((data.total_fat ?? data.fat ?? 0).toFixed ? (data.total_fat ?? data.fat ?? 0) : (data.total_fat ?? data.fat ?? 0));

  return (
    <section className="metrics-section">
      <div className="metrics-header">
        <h2>Today's Nutrition</h2>
        <button className="btn-refresh" onClick={onRefresh} disabled={loading}>
          <RotateCw size={18} className={loading ? 'rotating' : ''} />
        </button>
      </div>

      <div className="metrics-grid">
        <MetricCard
          icon={Flame}
          label="Calories"
          value={totalCalories}
          unit="kcal"
          loading={loading}
        />
        <MetricCard
          icon={Leaf}
          label="Protein"
          value={totalProtein.toFixed(1)}
          unit="g"
          loading={loading}
        />
        <MetricCard
          icon={Wheat}
          label="Carbohydrates"
          value={totalCarbs.toFixed(1)}
          unit="g"
          loading={loading}
        />
        <MetricCard
          icon={Droplet}
          label="Fat"
          value={totalFat.toFixed(1)}
          unit="g"
          loading={loading}
        />
      </div>
    </section>
  );
}

export default MetricsSection;
