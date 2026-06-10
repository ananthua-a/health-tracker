from sqlmodel import SQLModel,Field
from datetime import datetime

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
    qty:float
    calories: float
    protein: float
    carbs: float
    fat: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

    owner_id: int = Field(foreign_key="user.id")

    

class FoodAnalysisResponse(SQLModel):
    food_name:str
    qty:float

    calories:float
    protein:float

    carbs:float
    fat:float





class AnalyzeImageResponse(SQLModel):
    foods: list[FoodAnalysisResponse]



class UserProfile(SQLModel, table=True):

    id: int | None = Field(default=None, primary_key=True)

    age: int
    weight: float      # kg
    height: float      # cm
    gender: str
    activity_level: str

    owner_id: int = Field(foreign_key="user.id")


    
        