from .db import db, environment, SCHEMA, add_prefix_for_prod
from .shop_category import shop_categories


class Category(db.Model):
    __tablename__ = 'categories'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    name = db.Column(db.String(50), primary_key=True)

    shops = db.relationship(
        "Shop",
        secondary=shop_categories,
        back_populates="categories",
    )

    critters = db.relationship(
        "Critter",
        back_populates="categoryObj"
    )

    def get_shops(self):
        return [shop.to_dict() for shop in self.shops]

    def get_critters(self):
        return [critter.to_dict() for critter in self.critters]

    def __getitem__(self, item):
        """Configures model to be conscriptable"""
        return getattr(self, item)
