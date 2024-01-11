from .db import db, environment, SCHEMA, add_prefix_for_prod

class Order(db.Model):
    __tablename__ = 'orders'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    shopId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("shops.id")), nullable=False)
    orderStatus = db.Column(db.String, nullable=False)
    purchasedAt = db.Column(db.Date, nullable=True)

    orderDetails = db.relationship(
        "OrderDetail",
        back_populates="order"
    )

    purchaser = db.relationship(
        "User",
        back_populates="orders"
    )

    shop = db.relationship(
        "Shop",
        back_populates="orders"
    )

    def __getitem__(self, item):
        """Configures model to be conscriptable"""
        return getattr(self, item)

    def to_dict(self, scope=None):
        d = {
            "id": self.id,
            "name": self.name,
            "species": self.species,
            "shopId": self.shopId,
            "price": self.price,
            "category": self.category,
            "previewImageUrl": self.previewImageUrl,
            "description": self.description,
            "stock": self.stock,
        }

        return d
