from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import date

class Order(db.Model):
    __tablename__ = 'orders'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    shopId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("shops.id")), nullable=True)
    shopName = db.Column(db.String, nullable=False)
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
    def total_price(self):
        if self.orderStatus == "Bag":
            return sum([detail.critter.price * detail.quantity for detail in self.orderDetails])
        return sum([detail.unitPrice * detail.quantity for detail in self.orderDetails])

    def checkout(self):
        """
        Validates status of order, updates orderStatus, purchasedAt, and snapshots shopName + orderDetails info
        """
        status = self.check_status()
        if type(status).__name__ == 'dict':
            return status

        if self.orderType == "Delivery":
            self.orderStatus == "En Route"
        elif self.orderType == "Pickup":
            self.orderStatus == "Waiting for Pickup"
        else:
            return {"orderStatus": "Cannot check out"}
        self.purchasedAt = date.today()
        self.shopName = self.shop["name"]
        _ = [detail.checkout() for detail in self.orderDetails]

    def complete_order(self):
        self.orderStatus == "Completed"

    def check_status(self):
        """
        Confirms that shop and associate critters exist, have not been deleted
        """
        if self.orderStatus == "Bag":
            if not self.shop:
                return {"shop": "Shop does not exist"}
            for detail in self.orderDetails:
                if not detail.critter:
                    return {"critter": "Critter does not exist"}
        else:
            return self.orderStatus

    def __getitem__(self, item):
        """Configures model to be conscriptable"""
        return getattr(self, item)

    def to_dict(self, scope=None):
        d = {
            "id": self.id,
            "userId": self.userId,
            "shopId": self.shopId,
            "shopName": self.shopName or (self.shop["name"] if self.shop else None),
            "orderStatus": self.orderStatus,
            "orderType": self.orderType,
            "purchasedAt": self.purchasedAt,
            "orderDetails": [detail.to_dict() for detail in self.orderDetails],
            "totalPrice": self.total_price,
            # "_shop": self._shop,
            # "checkout": self.purchasedFrom
        }

        return d
