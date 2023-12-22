from app.models import db, Shop, environment, SCHEMA
from sqlalchemy.sql import text
import json

# Adds shops
def seed_shops():
    with open("app/seeds/data/shops.json", "r") as file:
        data = json.load(file)
        for shop in data:
            new_address = Shop(
                userId=shop["userId"],
                name=shop["name"],
                address=shop["address"],
                city=shop["city"],
                state=shop["state"],
                zipCode=shop["zipCode"],
                priceRange=shop["priceRange"],
                businessHours=shop["businessHours"],
                email=shop["email"],
                phoneNumber=shop["phoneNumber"],
                description=shop["description"],
                searchImageUrl=shop["searchImageUrl"],
                coverImageUrl=shop["coverImageUrl"],
                businessImageUrl=shop["businessImageUrl"],
                pickup=shop["pickup"],
                delivery=shop["delivery"],
            )

            db.session.add(new_address)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_shops():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.shops RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM shops"))

    db.session.commit()
