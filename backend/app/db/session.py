import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()
# In a real app, we'd use a .env file. For the hackathon, we can provide a default.
# Format: postgresql://user:password@localhost:5432/dbname
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL"
    # "postgresql://postgres:postgres@localhost:5432/gearguard"
)

# pool_pre_ping=True is highly recommended for PostgreSQL.
# it checks if the connection is alive before using it, preventing "Server closed connection" errors.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    pool_pre_ping=True
)

# This is our session factory. 
# autocommit=False: We want to manually call db.commit()
# autoflush=False: Prevents SQLAlchemy from sending queries to the DB before we are ready
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)