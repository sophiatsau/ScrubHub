from .db import db, environment, SCHEMA, add_prefix_for_prod

class Critter(db.Model):
    __tablename__ = 'critters'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(255), nullable=False)
    species = db.Column(db.String(255))
    shopId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("shops.id")), nullable=False)
    price = db.Column(db.Numeric(18,2), nullable=False)
    category = db.Column(db.String, db.ForeignKey(add_prefix_for_prod("categories.name")),nullable=False)
    previewImageUrl = db.Column(db.String(255))
    description = db.Column(db.String(255))
    stock = db.Column(db.Integer, nullable=False)

    shop = db.relationship(
        "Shop",
        back_populates="critters",
    )

    categoryObj = db.relationship(
        "Category",
        back_populates="critters"
    )

    # seller = db.relationship(
    #     "User",
    #     back_populates="critters",
    # )

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

        # if scope=="detailed":
        #     # use for bonus features
        #     d.update({
        #         # stuff
        #     })

        return d
