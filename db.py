from sqlmodel import SQLModel,Session,create_engine

from config import DATABASE_URL
a=DATABASE_URL or ""

engine=create_engine(a)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():

   with Session(engine) as session:
       yield session




   