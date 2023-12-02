from .db import db, environment, SCHEMA, add_prefix_for_prod

shop_categories = db.Table(
    'shop_categories',
    db.Model.metadata,
    db.Column('shopId', db.Integer, db.ForeignKey(add_prefix_for_prod('shops.id')), primary_key=True),
    db.Column('categoryId', db.Integer, db.ForeignKey(add_prefix_for_prod('categories.name')), primary_key=True)
)

if environment == "production":
    shop_categories.schema = SCHEMA
