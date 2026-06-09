import requests

from config import USDA_API_KEY

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





data = search_food("chicken")

food = data["foods"][0]

nutrients = food["foodNutrients"]

calories = get_nutrient(nutrients, 1008)
protein = get_nutrient(nutrients, 1003)
fat = get_nutrient(nutrients, 1004)
carbs = get_nutrient(nutrients, 1005)

print(calories)
print(protein)
print(fat)
print(carbs)
