import requests
from fastapi import Depends
from models import FoodEntry
from db import get_session
from config import USDA_API_KEY
from sqlmodel import Session
def search_food(food_name:str):
    url = "https://api.nal.usda.gov/fdc/v1/foods/search"
    params={
        "query":food_name,
        "api_key":USDA_API_KEY,
        "dataType":["Foundation", "SR Legacy"]
    }
    response=requests.get(url,params=params)
    data=response.json()
    return data


def get_nutrient(food_nutrients, nutrient_id):

    for nutrient in food_nutrients:

        if nutrient["nutrientId"] == nutrient_id:
            return nutrient["value"]

    return 0









# calories = get_nutrient(nutrients, 1008)
# protein = get_nutrient(nutrients, 1003)
# fat = get_nutrient(nutrients, 1004)
# carbs = get_nutrient(nutrients, 1005)

def get_macros(food_name:str,qty:float):
    data=search_food(food_name)
    food=data["foods"][0]
    nutrients=food["foodNutrients"]

    calories = get_nutrient(nutrients, 1008)
    protein = get_nutrient(nutrients, 1003)
    fat = get_nutrient(nutrients, 1004)
    carbs = get_nutrient(nutrients, 1005)

    factor=qty/100

    return {
        "calories": round(calories * factor, 2),
        "protein": round(protein * factor, 2),
        "fat": round(fat * factor, 2),
        "carbs": round(carbs * factor, 2)}

        
    

def create_food_entry(
        owner_id:int,
        food_name:str,
        quantity:float,
        calories:float,
        protein:float,
        carbs:float,
        fat:float,
        session:Session
 ):
    food_entry=FoodEntry(
        owner_id=owner_id,
        food_name=food_name,
        qty=quantity,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fat=fat)
    session.add(food_entry)
    session.commit()
    session.refresh(food_entry)

    return food_entry


    

        

    








    
    




