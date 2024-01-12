from .db import db, environment, SCHEMA, add_prefix_for_prod

class Order(db.Model):
    __tablename__ = 'orders'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    shopId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("shops.id")), nullable=False)
    orderStatus = db.Column(db.String, nullable=False)
    orderType = db.Column(db.String, nullable=True)
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
            "userId": self.userId,
            "shopId": self.shopId,
            "orderStatus": self.orderStatus,
            "orderType": self.orderType,
            "purchasedAt": self.purchasedAt,
            "orderDetails": [],
            "totalPrice": 0,
        }

        for details in self.orderDetails:
            d["orderDetails"].append(details.to_dict())
            d["totalPrice"] += details.unitPrice * details.quantity

        return d
