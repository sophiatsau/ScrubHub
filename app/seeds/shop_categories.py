from app.models import db, shop_categories, environment, SCHEMA
from sqlalchemy.sql import text
import json

# Adds shop_categories
def seed_shop_categories():
    with open("app/seeds/data/shop_categories.json", "r") as file:
        data = json.load(file)
        db.session.execute(db.insert(shop_categories).values(data))

        db.session.commit()


def undo_shop_categories():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.shop_categories RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM shop_categories"))

    db.session.commit()
