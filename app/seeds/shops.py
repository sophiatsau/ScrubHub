from app.models import db, Shop, Category, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
import random
from .utils import generate_address, generate_numbers

fake = Faker()

n = 10
SHOP_OWNERS = [1,2,3,4,5,2,2,2,2,1]
EMAILS = [fake.unique.email() for i in range(n)]
NUMBERS = generate_numbers(n)
SHOP_NAMES = [
    "Reptile Retail",
    "Hop Shop",
    "Roar Store",
    "Free Puppies",
    "Monkey Market",
    "Manatee Mart",
    "Shark Shed",
    "Rooster Reserve",
    "Aye-Aye Arsenal",
    "Kitten Box",
]

DESCRIPTIONS=[
    "Buy all sorts of reptiles here!",
    "We sell everything that hops, from rabbits to frogs!",
    "We sell lions!",
    "We sell puppies! Disclaimer: The 'Free' in 'Free Puppies' refers to your freedom to buy them.",
    "We sell monkeys!",
    "We sell manatees!",
    "We sell sharks!",
    "We sell chickens(male)!",
    "We sell aye-ayes!",
    "Last week, I came home from work to a cat and a litter of kittens in my bed. I don't have a cat. I opened this temporary shop in hopes of finding loving homes for them. Please help."
]

COVER_IMAGES=[
    "https://crittr-images.s3.us-west-1.amazonaws.com/turtle.webp",
    "https://crittr-images.s3.us-west-1.amazonaws.com/hop-cover.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/lion-cover.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/puppies-cover.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/monkey-cover.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/manatee-cover.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/shark-cover.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/rooster-cover.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/aye-aye-cover.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/kitten-cover.jpg",
]

SEARCH_IMAGES=[
    "https://crittr-images.s3.us-west-1.amazonaws.com/reptile-gang.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/hop-grid.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/lion-grid.webp",
    "https://crittr-images.s3.us-west-1.amazonaws.com/puppies-grid.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/monkey-grid.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/manatee-grid.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/shark-grid.webp",
    "https://crittr-images.s3.us-west-1.amazonaws.com/rooster-grid.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/aye-aye-grid.webp",
    "https://crittr-images.s3.us-west-1.amazonaws.com/kitten-grid.jpg",
]

PROFILE_IMAGES=[
    "https://crittr-images.s3.us-west-1.amazonaws.com/frilled-dragon.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/hop-square.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/lion-square.webp",
    "https://crittr-images.s3.us-west-1.amazonaws.com/puppies-square.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/monkey-square.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/manatee-square.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/shark-square.webp",
    "https://crittr-images.s3.us-west-1.amazonaws.com/rooster-square.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/aye-aye-square.jpg",
    "https://crittr-images.s3.us-west-1.amazonaws.com/kitten-square.jpg",
]

HOURS=[
'''Mon 08:00-17:00
Tue 08:00-17:00
Wed 08:00-17:00
Thu 08:00-17:00
Fri 08:00-17:00
Sat Closed
Sun Closed''',
'''Mon Closed
Tue 08:00-17:00
Wed 08:00-17:00
Thu 08:00-17:00
Fri 08:00-17:00
Sat 08:00-17:00
Sun Closed''',
'''Mon 09:00-14:00
Tue 09:00-14:00
Wed 09:00-14:00
Thu 09:00-14:00
Fri 09:00-14:00
Sat Closed
Sun Closed''',
]

# Adds shops
def seed_shops():
    [amphibian, arthropod, bird, cat, dog, marine, critter, mammal, rabbit, reptile, rodent] = Category.query.order_by(Category.name)

    associations = [
        [reptile,arthropod,bird],
        [amphibian,arthropod,rabbit,rodent,mammal,critter],
        [mammal],
        [dog],
        [mammal],
        [marine,mammal],
        [marine],
        [bird],
        [mammal],
        [cat]
    ]

    for i in range(n):
        [street_address, city, state, zip] = generate_address()

        new_shop = Shop(
            userId = SHOP_OWNERS[i],
            name=SHOP_NAMES[i],
            address=street_address,
            city=city,
            state=state,
            zipCode=zip,
            priceRange=random.randint(1,4),
            businessHours=random.choice(HOURS),
            email=EMAILS[i],
            phoneNumber=NUMBERS[i],
            description=DESCRIPTIONS[i],
            searchImageUrl=SEARCH_IMAGES[i],
            coverImageUrl=COVER_IMAGES[i],
            businessImageUrl=PROFILE_IMAGES[i],
            pickup=random.getrandbits(1),
            delivery=random.getrandbits(1),
        )
        new_shop.categories.extend(associations[i])
        db.session.add(new_shop)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_shops():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.shops RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM shops"))

    db.session.commit()
