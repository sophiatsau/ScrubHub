from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashedPassword = db.Column(db.String(255), nullable=False)
    firstName = db.Column(db.String(40), nullable=False)
    lastName = db.Column(db.String(40), nullable=False)
    balance = db.Column(db.Numeric(12,2), default=0.00)

    addresses = db.relationship(
        "Address",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    shops = db.relationship(
        "Shop",
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    orders = db.relationship(
        "Order",
        back_populates="purchaser",
    )

    # critters = db.relationship(
    #     "Critter",
    #     back_populates="seller",
    #     cascade="all, delete-orphan",
    # )

    @property
    def password(self):
        return self.hashedPassword

    @password.setter
    def password(self, password):
        if password == 'OAUTH':
            # Prevents data breaches from exposing Oauth users bc the input password never hashes to OAUTH
            self.hashedPassword = 'OAUTH'
        else:
            self.hashedPassword = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        d = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'balance': self.balance,
            # 'orders': [],
            'bag': None,
        }

        # add shops, addresses
        d["shops"] = [shop.id for shop in self.shops]
        d["addresses"] = self.normalize_addresses()
        d["critters"] = [critter.id for shop in self.shops for critter in shop.critters]

        for order in self.orders:
            if order.orderStatus=="Bag":
                d["bag"] = order.to_dict()
                break
        #     else:
        #         d["orders"].append(order.id)

        return d

    def get_addresses(self):
        return [address.to_dict() for address in self.addresses]

    def normalize_addresses(self):
        return {address["id"]:address for address in self.get_addresses()}

    def get_shops(self):
        return [shop.to_dict() for shop in self.shops]

    def get_critters(self):
        return [critter.to_dict() for shop in self.shops for critter in shop.critters]

    def get_orders(self):
        return [order.to_dict() for order in self.orders]
    # TODO: can do pagination for orders, so that user defaults to seeing most recent orders, can choose to view more

    def __getitem__(self, item):
        """Configures model to be conscriptable"""
        return getattr(self, item)
