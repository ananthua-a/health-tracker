import './FoodCard.css';

function FoodCard({ food }) {
  const quantity = Math.round(food.qty);
  const unit = food.unit || 'g';
  
  return (
    <div className="food-card">
      <div className="food-name">{food.food_name}</div>
      <div className="food-meta">
        <span className="food-qty">{quantity} {unit}</span>
        <span className="food-calories">{Math.round(food.calories)} kcal</span>
      </div>
    </div>
  );
}

export default FoodCard;
