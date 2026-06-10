import './FoodCard.css';

function FoodCard({ food }) {
  return (
    <div className="food-card">
      <h4>{food.food_name}</h4>
      <p className="quantity">{food.qty}</p>
      <div className="macros">
        <div className="macro">
          <span className="label">Calories</span>
          <span className="value">{Math.round(food.calories)} kcal</span>
        </div>
        <div className="macro">
          <span className="label">Protein</span>
          <span className="value">{food.protein.toFixed(1)}g</span>
        </div>
        <div className="macro">
          <span className="label">Carbs</span>
          <span className="value">{food.carbs.toFixed(1)}g</span>
        </div>
        <div className="macro">
          <span className="label">Fat</span>
          <span className="value">{food.fat.toFixed(1)}g</span>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
