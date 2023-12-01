from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from .utils import generate_address
import random

fake = Faker()
# fake.add_provider(person)

# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', password='password', firstName="Demo", lastName="User", balance=500.00, address="147 ESCANYO DR", city="SOUTH SAN FRANCISCO", state="CA", zipCode="94080-4137")
    marnie = User(
        username='marnie', email='marnie@aa.io', password='password', firstName="Marnie", lastName="May", balance=500.00, address="3151 Granville Lane", city="Belleville", state="NJ", zipCode="07109")
    bobbie = User(
        username='bobbie', email='bobbie@aa.io', password='password', firstName="Bobbie", lastName="Bruh", balance=500.00, address="385 Flinderation Road", city="Chicago", state="IL", zipCode="60631")

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)

    emails = [fake.unique.email() for i in range(5)]
    for i in range(5):
        [street_address, city, state, zip] = generate_address()


        new_user = User(
            username=f'user{i+1}',
            email=emails[i],
            password='password',
            firstName=fake.first_name(),
            lastName=fake.last_name(),
            balance=random.randint(10_000, 1_000_000)/100,
            address=street_address,
            city=city,
            state=state,
            zipCode=zip,
        )
        db.session.add(new_user)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
