from .db import db, environment, SCHEMA, add_prefix_for_prod

class OrderDetail(db.Model):
    __tablename__ = 'order_details'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    orderId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("orders.id")), nullable=False)
    critterId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("critters.id")), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unitPrice = db.Column(db.Numeric(18,2), nullable=True)

    order = db.relationship(
        "Order",
        back_populates="orderDetails"
    )

    critter = db.relationship(
        "Critter",
        back_populates="orderDetails"
    )

    @property
    def product(self):
        return self.product if self.order.purchasedAt else None

    @product.setter
    def product(self, critter):
        self.product = critter
        return self.product

    def checkout(self):
        self.product = self.critter.to_dict(scope="orders")

    def __getitem__(self, item):
        """Configures model to be conscriptable"""
        return getattr(self, item)

    def to_dict(self, scope=None):
        d = {
            "id": self.id,
            "orderId": self.orderId,
            "critterId": self.critterId,
            "quantity": self.quantity,
            "unitPrice": self.unitPrice,
            "product": self.product if self.product else self.critter.to_dict(),
        }

        return d
