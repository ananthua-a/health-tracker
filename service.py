from datetime import date
from sqlmodel import select,Session
from models import FoodEntry


def get_today_calories(owner_id: int, session: Session):

    today = date.today()

    statement = select(FoodEntry).where(
        FoodEntry.owner_id == owner_id,
        FoodEntry.created_at >= today
    )

    foods = session.exec(statement).all()

    total = 0

    for food in foods:
        total += food.calories

    return total
