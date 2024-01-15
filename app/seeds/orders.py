from app.models import db, Order, OrderDetail, environment, SCHEMA
from sqlalchemy.sql import text
import json
from datetime import date
from random import choice, randint

# Adds orders
def seed_orders():
    with open("app/seeds/data/orders.json", "r") as file:
        data = json.load(file)
        for order in data:
            new_order = Order(
                userId=order["userId"],
                shopId=order["shopId"],
                orderStatus=order["orderStatus"],
                orderType=order["orderType"],
                purchasedAt=date(*order["purchasedAt"]),
            )

            db.session.add(new_order)

    db.session.commit()


# remove orders table
def undo_orders():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.orders RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM orders"))

    db.session.commit()
