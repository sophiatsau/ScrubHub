from flask import Blueprint
from flask_login import login_required, current_user
from app.models import Address

address_routes = Blueprint('addresses', __name__)


@address_routes.route('/current')
@login_required
def view_user_addresses():
    """
    Query for all of user's addresses and returns them in a list of dictionaries
    """
    return {'addresses': current_user.get_addresses()}


@address_routes.route('/new', methods=["POST"])
@login_required
def create_address():
    """
    Creates a new address for the use and returns new address in a dictionary
    """
    address = Address()
    return address.to_dict
