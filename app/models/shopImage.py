# from .db import db, environment, SCHEMA, add_prefix_for_prod, format_address


# class ShopImage(db.Model):
#     __tablename__ = "shop_images"

#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     shopId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("shops.id")))
#     searchImageUrl = db.Column(db.String(255), nullable=False)
#     coverImageUrl = db.Column(db.String(255), nullable=False)
#     businessImageUrl = db.Column(db.String(255), nullable=False)
