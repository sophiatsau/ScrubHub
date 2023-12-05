from app.models import db, Critter, environment, SCHEMA
from sqlalchemy.sql import text

# critters info
NAMES=["Turtle F", "Frilled Lizards 2yr M", "Snakes", "Frogs", "Kangaroo 1yr M"]
SPECIES=["Chrysemys picta", "Chlamydosaurus Kingii", "Pantherophis guttatus", "Dryophytes cinereus", "Osphranter rufus"]
CATEGORIES=["Reptile","Reptile","Reptile","Amphibians", "Other Mammals"]
PREVIEW_IMAGES=["https://crittr-images.s3.us-west-1.amazonaws.com/turtle.webp", None, None, "https://crittr-images.s3.us-west-1.amazonaws.com/hop-grid.jpg", "https://crittr-images.s3.us-west-1.amazonaws.com/hop-cover.jpg"]
DESCRIPTIONS=["A little turtle", None, "Hsssss", "Green. Comes in all genders and ages.", "He definitely did not kick a toddler in the face when I took him grocery shopping last week"]

# Adds critters
def seed_critters():
    # critters for demo user
    for i in range(3):
        new_critter = Critter(
            name=NAMES[i],
            species=SPECIES[i],
            shopId=1,
            # userId=1,
            price=(i+1)*15,
            category=CATEGORIES[i],
            previewImageUrl=PREVIEW_IMAGES[i],
            description=DESCRIPTIONS[i],
            stock=i*5,
        )
        db.session.add(new_critter)

    # seeders for shop 2
    for i in range(3,5):
        new_critter = Critter(
            name=NAMES[i],
            species=SPECIES[i],
            shopId=2,
            userId=2,
            price=(i)*15,
            category=CATEGORIES[i],
            previewImageUrl=PREVIEW_IMAGES[i],
            description=DESCRIPTIONS[i],
            stock=[10,1][i-3],
        )
        db.session.add(new_critter)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the critters table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_critters():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.critters RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM critters"))

    db.session.commit()
