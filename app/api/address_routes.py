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
    return {'addresses': current_user.get_addresses()}, 200


@address_routes.route('/new', methods=["POST"])
@login_required
def create_address():
    """
    Creates a new address for the user and returns new address in a dictionary
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
            name=form.name.data,
            userId=current_user.id,
        )
        db.session.add(address)
        db.session.commit()
        return address.to_dict(), 201
    elif form.errors:
        return error_messages(form.errors), 400
    else:
        return error_message(), 500


@address_routes.route('/<int:id>/edit', methods=["PUT"])
@login_required
def edit_address(id):
    """
    Edits an existing address for the user and returns updated address in a dictionary
    """
    # handle 404, 403 errors
    address = Address.query.get(id)

    if not address:
        return error_message("address", "Address not found."), 404
    if address.userId != current_user.id:
        return error_message("user", "Authorization Error."), 403

    form = AddressForm()
    form["csrf_token"].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        address.fullAddress=form.fullAddress.data
        address.address=form.address.data
        address.city=form.city.data
        address.state=form.state.data
        address.zipCode=form.zipCode.data
        address.name=form.name.data

        db.session.add(address)
        db.session.commit()
        return address.to_dict(), 200
    elif form.errors:
        return error_messages(form.errors), 400
    else:
        return error_message(), 500


@address_routes.route('/<int:id>/delete', methods=["DELETE"])
@login_required
def delete_address(id):
    """
    Deletes an address and returns a message if successfully deleted
    """
    address = Address.query.get(id)
    if not address:
        return error_message("address", "Address not found."), 404

    if address.userId != current_user.id:
        return error_message("user", "Authorization Error."), 403

    db.session.delete(address)
    db.session.commit()
    return {"message": "Address successfully deleted."}, 200
