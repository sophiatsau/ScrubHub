from .db import db, environment, SCHEMA, add_prefix_for_prod


class Shop(db.Model):
    __tablename__ = 'shops'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(255), nullable=False)
    zipCode = db.Column(db.String(10), nullable=False)
    priceRange = db.Column(db.Integer, nullable=False)
    businessHours = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    phoneNumber = db.Column(db.String(13), unique=True)
    description = db.Column(db.Text)
    coverImageUrl = db.Column(db.String(255), nullable=False)
    businessImageUrl = db.Column(db.String(255), nullable=False)
    pickup = db.Column(db.Boolean, nullable=False)
    delivery = db.Column(db.Boolean, nullable=False)

    owner = db.relationship(
        "User",
        back_populates="stores",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "name": self.name,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "zipCode": self.zipCode,
            "priceRange": self.priceRange,
            "businessHours": self.businessHours,
            "email": self.email,
            "phoneNumber": self.phoneNumber,
            "description": self.description,
            "coverImageUrl": self.coverImageUrl,
            "businessImageUrl": self.businessImageUrl,
            "pickup": self.pickup,
            "delivery": self.delivery,
        }
