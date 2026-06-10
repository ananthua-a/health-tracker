from fastapi import FastAPI,Depends,HTTPException,Request,UploadFile
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import select
from db import create_db_and_tables,get_session,Session
from models import UserCreate,User,FoodAnalysisResponse,AnalyzeImageResponse
from security import Hash_password,create_access_token,create_refresh_token,verify_password,get_current_user
from exception import global_exception_handler
from ai_service import analyze_meal_image
from nutrition_service import create_food_entry,get_macros
from service import get_today_calories
app =FastAPI()
import time

@app.on_event("startup")
def startup():
    create_db_and_tables()
app.add_exception_handler(
    Exception,global_exception_handler)

app.middleware("http")
async def logger(request:Request,call_next):
    start=time.time()
    response= await call_next(request)
    end=time.time()
    print(f"{request.method}{request.url.path}\n"
        f"{end-start}")
    return response
@app.get("/")
def root():
    return {
        "message":"Health-Tracker API"
    }


@app.post("/register",response_model=User)
def register(
    user_data: UserCreate,
    session: Session = Depends(get_session)
):
    existing_user = session.exec(
        select(User).where(
            User.username == user_data.username
        )
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    user = User(
        username=user_data.username,
        hashed_password=Hash_password(user_data.password)
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return user
    




@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends()
    ,
    session: Session = Depends(get_session)
):
    username = form_data.username
    statement = select(User).where(
        User.username == username
    )
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
    if not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
    access_token = create_access_token(
        {"sub": str(user.id)}
    )
    refresh_token=create_refresh_token({"sub":str(user.id)})

    return {
        "access_token": access_token,
        "refresh_token":refresh_token,
        "token_type": "bearer"
    }

@app.post("/analyze-image")
async def analyze_image(
    file: UploadFile,
    user_prompt: str | None = None,current_user:User=Depends(get_current_user),
    session:Session=Depends(get_session)
):

    image_bytes = await file.read()

    if current_user.id is None:
        raise HTTPException(
            status_code=400,
            detail="Authenticated user missing id"
        )

    foods=analyze_meal_image(
        image=image_bytes,
        mime_type=file.content_type or "application/octet-stream",
        user_prompt=user_prompt
    )
    response_foods = []
    for items in foods["foods"]:
        macros=get_macros(items["name"],items["quantity"])
        create_food_entry(
            owner_id=current_user.id,
            food_name=items["name"],
            quantity=items["quantity"],
            **macros,
            session=session
            
        )

    
        response_foods.append(
             FoodAnalysisResponse(
             food_name=items["name"],
              qty=items["quantity"],
             calories=macros["calories"],
             protein=macros["protein"],
             carbs=macros["carbs"],
             fat=macros["fat"]
             )
        )
    return AnalyzeImageResponse(
        foods=response_foods
    )
          

 
@app.get("/daily-calorie")
def daily_calories(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.id is None:
        raise HTTPException(
            status_code=400,
            detail="Authenticated user missing id"
        )

    total = get_today_calories(current_user.id, session)
    return {"total_calories": total}



#fin

