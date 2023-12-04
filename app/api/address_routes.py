from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Address, db
from app.forms import AddressForm
from .utils import error_messages, error_message

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
    form = AddressForm()

    form["csrf_token"].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        address = Address(
            fullAddress=form.fullAddress.data,
            address=form.address.data,
            city=form.city.data,
            state=form.state.data,
            zipCode=form.zipCode.data,
            userId=current_user.id,
        )
        db.session.add(address)
        db.session.commit()
        return address.to_dict(), 201
    elif form.errors:
        return error_messages(form.errors), 400
    else:
        return error_message(), 500
