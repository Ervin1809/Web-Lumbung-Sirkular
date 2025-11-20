# app/database.py
from sqlmodel import SQLModel, create_engine, Session

# Nama file database nanti akan muncul otomatis (lumbung.db)
SQLITE_FILE_NAME = "lumbung_sirkular.db"
sqlite_url = f"sqlite:///{SQLITE_FILE_NAME}"

# connect_args check_same_thread=False dibutuhkan khusus untuk SQLite di FastAPI
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session