from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import date

class Order(db.Model):
    __tablename__ = 'orders'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    shopId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("shops.id")), nullable=True)
    orderStatus = db.Column(db.String, nullable=False)
    orderType = db.Column(db.String, nullable=True)
    purchasedAt = db.Column(db.Date, nullable=True)

    orderDetails = db.relationship(
        "OrderDetail",
        back_populates="order",
        cascade="all, delete-orphan",
    )

    purchaser = db.relationship(
        "User",
        back_populates="orders"
    )

    shop = db.relationship(
        "Shop",
        back_populates="orders"
    )

    @property
    def boughtFrom(self):
        return self.boughtFrom if self.purchasedAt else None

    @boughtFrom.setter
    def boughtFrom(self, shop):
        self.boughtFrom = shop
        return self.boughtFrom

    def checkout(self):
        self.boughtFrom = self.shop.to_dict(scope="orders")
        self.purchasedAt = date.today()
        _ = [detail.checkout() for detail in self.orderDetails]

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
            "checkout": self.boughtFrom if self.boughtFrom else self.shop.to_dict(),
        }

        for details in self.orderDetails:
            d["orderDetails"].append(details.to_dict())
            d["totalPrice"] += details.unitPrice * details.quantity

        return d
