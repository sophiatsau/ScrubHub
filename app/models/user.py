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
    address = db.Column(db.String(255))
    city = db.Column(db.String(255))
    state = db.Column(db.String(255))
    zipCode = db.Column(db.String(10))

    shops = db.relationship(
        "Shop",
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    @property
    def password(self):
        return self.hashedPassword

    @password.setter
    def password(self, password):
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
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zipCode': self.zipCode,
        }

        # view shops - eager load
        d["shops"] = [shop.id for shop in self.shops]
        # view critters - only through shop
        # view reviews - lazy load
        return d

    def __getitem__(self, item):
        """Configures model to be conscriptable"""
        return getattr(self, item)
