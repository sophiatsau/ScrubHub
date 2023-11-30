from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
# from faker.providers import person
import random

fake = Faker()
# fake.add_provider(person)

# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', password='password', first_name="Demo", last_name="User", balance=500.00, address="147 ESCANYO DR", city="SOUTH SAN FRANCISCO", state="CA", zip_code="94080-4137")
    marnie = User(
        username='marnie', email='marnie@aa.io', password='password', first_name="Marnie", last_name="May", balance=500.00, address="3151 Granville Lane", city="Belleville", state="NJ", zip_code="07109")
    bobbie = User(
        username='bobbie', email='bobbie@aa.io', password='password', first_name="Bobbie", last_name="Bruh", balance=500.00, address="385 Flinderation Road", city="Chicago", state="IL", zip_code="60631")

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)

    emails = [fake.unique.email() for i in range(5)]
    for i in range(5):
        full_address = fake.address()
        [street_address, city_state_zip] = full_address.split('\n')
        [city, state_zip] = city_state_zip.split(', ')
        [state, zip] = state_zip.split(' ')

        new_user = User(
            username=f'Demo{i}',
            email=emails[i],
            password='password',
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            balance=random.randint(10_000, 1_000_000)/100,
            address=street_address,
            city=city,
            state=state,
            zip_code=zip,
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
