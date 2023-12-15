from app.models import db, Address, environment, SCHEMA
from sqlalchemy.sql import text
from .utils import generate_address
import json

# Adds addresses
def seed_addresses():
    with open("app/seeds/data/addresses.json", "r") as file:
        data = json.load(file)
        for address in data:
            new_address = Address(
                userId=address["userId"],
                name=address["name"],
                address=address["address"],
                city=address["city"],
                state=address["state"],
                zipCode=address["zipCode"],
                fullAddress=address["fullAddress"],
            )
            # print(new_address.to_dict())

            db.session.add(new_address)

    # [street_address, city, state, zip, fullAddress] = generate_address()

    # for i in range(5):
    #     new_address = Address(
    #         userId=i+1,
    #         name="Home",
    #         address=street_address,
    #         city=city,
    #         state=state,
    #         zipCode=zip,
    #         fullAddress=fullAddress,
    #     )
    #     db.session.add(new_address)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the addresses table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_addresses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.addresses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM addresses"))

    db.session.commit()
