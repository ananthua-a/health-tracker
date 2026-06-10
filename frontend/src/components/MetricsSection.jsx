import './MetricsSection.css';

function MetricsSection({ metrics, loading }) {
  const defaultMetrics = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  const data = metrics || defaultMetrics;
  const totalCalories = Math.round(data.total_calories ?? data.calories ?? 0);
  const totalProtein = Number((data.total_protein ?? data.protein ?? 0) || 0).toFixed(1);
  const totalCarbs = Number((data.total_carbs ?? data.carbs ?? 0) || 0).toFixed(1);
  const totalFat = Number((data.total_fat ?? data.fat ?? 0) || 0).toFixed(1);
  const goalCalories = 2000;

  return (
    <section className="metrics-section">
      <div className="calorie-summary">
        <div className="calorie-header">
          <span className="calorie-label">Today's Calories</span>
          <div className="calorie-display">
            <div className="calorie-value">{loading ? '--' : totalCalories}</div>
            <div className="calorie-unit">kcal</div>
          </div>
        </div>
      </div>

      <div className="macro-row">
        <div className="macro-item">
          <span className="macro-label">Protein</span>
          <span className="macro-value">{loading ? '0.0g' : `${totalProtein}g`}</span>
        </div>
        <div className="macro-item">
          <span className="macro-label">Carbs</span>
          <span className="macro-value">{loading ? '0.0g' : `${totalCarbs}g`}</span>
        </div>
        <div className="macro-item">
          <span className="macro-label">Fat</span>
          <span className="macro-value">{loading ? '0.0g' : `${totalFat}g`}</span>
        </div>
      </div>
    </section>
  );
}

export default MetricsSection;
