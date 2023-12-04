from flask.cli import AppGroup
from .categories import seed_categories, undo_categories
from .users import seed_users, undo_users
from .shops import seed_shops, undo_shops
from .addresses import seed_addresses, undo_addresses
from .critters import seed_critters, undo_critters

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_critters()
        undo_shops()
        undo_addresses()
        undo_users()
        undo_categories()

    seed_categories()
    seed_users()
    seed_addresses()
    seed_shops()
    seed_critters()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_critters()
    undo_shops()
    undo_addresses()
    undo_users()
    undo_categories()
    # Add other undo functions here
