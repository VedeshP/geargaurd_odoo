import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.session import engine, SessionLocal
from app.models.base import (
    Base, Company, Department, EquipmentCategory, 
    Team, User, UserRole, Workcenter, Equipment
)
from argon2 import PasswordHasher

ph = PasswordHasher()

def init_db():
    print("Creating tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding initial data...")

        # 1. Company
        sf_company = Company(id=uuid.uuid4(), name="My Company (San Francisco)")
        db.add(sf_company)
        db.flush()

        # 2. Department
        it_dept = Department(id=uuid.uuid4(), name="IT Admin", company_id=sf_company.id)
        prod_dept = Department(id=uuid.uuid4(), name="Production", company_id=sf_company.id)
        db.add_all([it_dept, prod_dept])
        db.flush()

        # 3. Workcenter (The new addition)
        assembly_line = Workcenter(
            id=uuid.uuid4(), 
            name="Main Assembly Line", 
            code="WC-01", 
            company_id=sf_company.id
        )
        db.add(assembly_line)
        db.flush()

        # 4. Equipment Category
        laptop_cat = EquipmentCategory(id=uuid.uuid4(), name="Laptops")
        cnc_cat = EquipmentCategory(id=uuid.uuid4(), name="CNC Machines")
        db.add_all([laptop_cat, cnc_cat])
        db.flush()

        # 5. Maintenance Team
        it_team = Team(id=uuid.uuid4(), name="IT Support", company_id=sf_company.id)
        mech_team = Team(id=uuid.uuid4(), name="Mechanics", company_id=sf_company.id)
        db.add_all([it_team, mech_team])
        db.flush()

        # 6. Admin User
        hashed_pwd = ph.hash("admin123")
        admin_user = User(
            id=uuid.uuid4(),
            full_name="Mitchell Admin",
            email="admin@gearguard.com",
            hashed_password=hashed_pwd,
            role=UserRole.MANAGER,
            company_id=sf_company.id,
            department_id=it_dept.id,
            team_id=it_team.id
        )
        db.add(admin_user)
        db.flush()

        # 7. Equipment (The "What")
        # Creating a machine linked to the Workcenter and Production Dept
        lathe_machine = Equipment(
            id=uuid.uuid4(),
            name="Industrial Lathe X1",
            serial_number="LAT-9922-01",
            category_id=cnc_cat.id,
            department_id=prod_dept.id,
            company_id=sf_company.id,
            workcenter_id=assembly_line.id, # Linked to Workcenter
            team_id=mech_team.id,           # Default Team
            technician_id=admin_user.id,    # Default Tech
            purchase_date=datetime.utcnow(),
            location="Floor 1, Zone B"
        )
        db.add(lathe_machine)

        db.commit()
        print("Successfully initialized database!")
        print(f"--- SEEDED IDS FOR TESTING ---")
        print(f"Admin Login: admin@gearguard.com / admin123")
        print(f"Company ID: {sf_company.id}")
        print(f"Workcenter ID: {assembly_line.id}")
        print(f"Equipment ID: {lathe_machine.id}")

    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()