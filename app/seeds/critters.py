from app.models import db, Critter, environment, SCHEMA
from sqlalchemy.sql import text
import json

# Adds critters
def seed_critters():
    with open("app/seeds/data/critters.json", "r") as file:
        data = json.load(file)
        db.session.execute(db.insert(Critter.__table__).values(data))

        db.session.commit()

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the critters table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_critters():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.critters RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM critters"))

    db.session.commit()
