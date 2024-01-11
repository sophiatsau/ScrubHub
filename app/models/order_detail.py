from .db import db, environment, SCHEMA, add_prefix_for_prod

class OrderDetail(db.Model):
    __tablename__ = 'order_details'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    orderId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    critterId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("shops.id")), nullable=False)
    quantity = db.Column(db.String, nullable=False)
    unitPrice = db.Column(db.Date, nullable=True)

    order = db.relationship(
        "Order",
        back_populates="orderDetails"
    )

    critter = db.relationship(
        "Critter",
        back_populates="orderDetails"
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
