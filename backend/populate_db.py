import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.db.session import engine, SessionLocal
from app.models.base import (
    Base, Company, Department, EquipmentCategory, 
    Team, User, UserRole, Workcenter, Equipment, 
    MaintenanceRequest, MaintenanceStage, RequestType
)
from argon2 import PasswordHasher

ph = PasswordHasher()

def populate():
    print("🚀 Resetting Database and Populating GearGuard Data...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # --- 1. COMPANY ---
        company = Company(id=uuid.uuid4(), name="My Company (San Francisco)")
        db.add(company)
        db.flush()

        # --- 2. DEPARTMENTS ---
        admin_dept = Department(id=uuid.uuid4(), name="Admin", company_id=company.id)
        it_dept = Department(id=uuid.uuid4(), name="IT Infrastructure", company_id=company.id)
        prod_dept = Department(id=uuid.uuid4(), name="Production", company_id=company.id)
        db.add_all([admin_dept, it_dept, prod_dept])
        db.flush()

        # --- 3. CATEGORIES ---
        cat_monitors = EquipmentCategory(id=uuid.uuid4(), name="Monitors")
        cat_laptops = EquipmentCategory(id=uuid.uuid4(), name="Laptops")
        cat_cnc = EquipmentCategory(id=uuid.uuid4(), name="CNC Machines")
        db.add_all([cat_monitors, cat_laptops, cat_cnc])
        db.flush()

        # --- 4. TEAMS ---
        it_team = Team(id=uuid.uuid4(), name="IT Support", company_id=company.id, description="Internal IT maintenance")
        mech_team = Team(id=uuid.uuid4(), name="Mechanical Team", company_id=company.id, description="Factory floor maintenance")
        db.add_all([it_team, mech_team])
        db.flush()

        # --- 5. WORKCENTERS ---
        wc_assembly = Workcenter(id=uuid.uuid4(), name="Assembly Line A", code="WC-01", company_id=company.id)
        db.add(wc_assembly)
        db.flush()

        # --- 6. USERS ---
        pwd = ph.hash("password123")
        admin = User(id=uuid.uuid4(), full_name="Mitchell Admin", email="admin@gearguard.com", 
                     hashed_password=pwd, role=UserRole.MANAGER, company_id=company.id, department_id=admin_dept.id)
        tech_it = User(id=uuid.uuid4(), full_name="Jose Mukari", email="jose@gearguard.com", 
                       hashed_password=pwd, role=UserRole.TECHNICIAN, company_id=company.id, team_id=it_team.id)
        tech_mech = User(id=uuid.uuid4(), full_name="Marc Demo", email="marc@gearguard.com", 
                         hashed_password=pwd, role=UserRole.TECHNICIAN, company_id=company.id, team_id=mech_team.id)
        employee = User(id=uuid.uuid4(), full_name="Tejas Modi", email="tejas@gearguard.com", 
                        hashed_password=pwd, role=UserRole.EMPLOYEE, company_id=company.id, department_id=admin_dept.id)
        db.add_all([admin, tech_it, tech_mech, employee])
        db.flush()

        # --- 7. EQUIPMENT ---
        monitor = Equipment(
            id=uuid.uuid4(), name='Samsung Monitor 15"', serial_number="MT/125/22FFFF87",
            category_id=cat_monitors.id, department_id=admin_dept.id, company_id=company.id,
            employee_id=employee.id, technician_id=tech_it.id, team_id=it_team.id,
            location="Office - Desk 12", purchase_date=datetime.now()
        )
        cnc_machine = Equipment(
            id=uuid.uuid4(), name="CNC Lathe X1", serial_number="CNC-99-001",
            category_id=cat_cnc.id, department_id=prod_dept.id, company_id=company.id,
            workcenter_id=wc_assembly.id, technician_id=tech_mech.id, team_id=mech_team.id,
            location="Floor 1", purchase_date=datetime.now()
        )
        db.add_all([monitor, cnc_machine])
        db.flush()

        # --- 8. MAINTENANCE REQUESTS (Fixed category_id) ---
        now = datetime.now(timezone.utc)

        # A. New Corrective
        db.add(MaintenanceRequest(
            id=uuid.uuid4(), subject="Monitor Flickering", request_type=RequestType.CORRECTIVE,
            stage=MaintenanceStage.NEW, priority=3, equipment_id=monitor.id, 
            team_id=it_team.id, category_id=cat_monitors.id, company_id=company.id, 
            created_by_id=employee.id
        ))

        # B. Overdue Preventive
        db.add(MaintenanceRequest(
            id=uuid.uuid4(), subject="Monthly CNC Oil Change", request_type=RequestType.PREVENTIVE,
            stage=MaintenanceStage.IN_PROGRESS, priority=2, equipment_id=cnc_machine.id, 
            team_id=mech_team.id, category_id=cat_cnc.id, technician_id=tech_mech.id, 
            company_id=company.id, created_by_id=admin.id, scheduled_date=now - timedelta(days=2)
        ))

        # C. Completed
        db.add(MaintenanceRequest(
            id=uuid.uuid4(), subject="Keyboard Replacement", request_type=RequestType.CORRECTIVE,
            stage=MaintenanceStage.REPAIRED, priority=1, equipment_id=monitor.id, 
            team_id=it_team.id, category_id=cat_monitors.id, technician_id=tech_it.id, 
            company_id=company.id, created_by_id=employee.id, duration=2
        ))

        # D. Scrap (Automation Test)
        # Note: We create this as "SCRAP" so the CNC machine starts as unusable in the Dashboard
        db.add(MaintenanceRequest(
            id=uuid.uuid4(), subject="Main Engine Failure", request_type=RequestType.CORRECTIVE,
            stage=MaintenanceStage.SCRAP, priority=3, equipment_id=cnc_machine.id, 
            team_id=mech_team.id, category_id=cat_cnc.id, technician_id=tech_mech.id, 
            company_id=company.id, created_by_id=admin.id
        ))

        db.commit()
        print("\n✅ Database Populated Successfully!")
        print(f"MANAGER: admin@gearguard.com / password123")

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate()