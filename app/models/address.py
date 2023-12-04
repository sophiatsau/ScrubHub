from .db import db, environment, SCHEMA, add_prefix_for_prod, format_address

class Address(db.Model):
    __tablename__ = 'addresses'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    fullAddress = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(255), nullable=False)
    zipCode = db.Column(db.String(10), nullable=False)

    user = db.relationship(
        "User",
        back_populates="addresses",
    )

    def __getitem__(self, item):
        """Configures model to be conscriptable"""
        return getattr(self, item)

    def to_dict(self, scope=None):
        d = {
            "id": self.id,
            "userId": self.userId,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zipCode': self.zipCode,
            'fullAddress': self.fullAddress,
        }

        return d
