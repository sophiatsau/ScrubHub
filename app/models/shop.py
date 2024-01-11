from .db import db, environment, SCHEMA, add_prefix_for_prod, format_address
from .shop_category import shop_categories


class Shop(db.Model):
    __tablename__ = 'shops'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    zipCode = db.Column(db.String(10), nullable=False)
    priceRange = db.Column(db.Integer, nullable=False)
    businessHours = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phoneNumber = db.Column(db.String(14))
    description = db.Column(db.Text)
    searchImageUrl = db.Column(db.String(255), nullable=False)
    coverImageUrl = db.Column(db.String(255), nullable=False)
    businessImageUrl = db.Column(db.String(255), nullable=False)
    pickup = db.Column(db.Boolean, nullable=False)
    delivery = db.Column(db.Boolean, nullable=False)

    owner = db.relationship(
        "User",
        back_populates="shops",
    )

    categories = db.relationship(
        "Category",
        secondary=shop_categories,
        back_populates="shops",
    )

    critters = db.relationship(
        "Critter",
        back_populates="shop",
        cascade="all, delete-orphan",
    )

    orders = db.relationship(
        "Order",
        back_populates="shop",
    )

    def __getitem__(self, item):
        """Configures model to be conscriptable"""
        return getattr(self, item)

    @property
    def categories_names(self):
        return [cat.name for cat in self.categories]

    def to_dict(self, scope=None):
        d = {
            "id": self.id,
            "userId": self.userId,
            "name": self.name,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "zipCode": self.zipCode,
            "priceRange": self.priceRange,
            "businessHours": self.businessHours,
            "pickup": self.pickup,
            "delivery": self.delivery,
            "searchImageUrl": self.searchImageUrl,
            "categories": self.categories_names,
        }

        if scope=="detailed":
            d.update({
                "email": self.email,
                "phoneNumber": self.phoneNumber,
                "description": self.description,
                "coverImageUrl": self.coverImageUrl,
                "businessImageUrl": self.businessImageUrl,
                "formattedAddress": format_address(self),
                "critters": [critter.id for critter in self.critters],
                "crittersDetails": [critter.to_dict() for critter in self.critters],
            })
            # critters
            # reviews

        return d
