from sqlmodel import SQLModel,Field


class User(SQLModel,table=True):
    id:int | None=Field(default=None,primary_key=True)
    username:str=Field(unique=True,index=True)
    hashed_password:str




class UserCreate(SQLModel):
    username:str
    password:str



class FoodEntry(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    food_name: str
    calories: float
    protein: float
    carbs: float
    fat: float

    owner_id: int = Field(foreign_key="user.id")

    