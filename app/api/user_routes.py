from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import User, db
from .utils import error_messages, error_message


user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/add-balance', methods=["PATCH"])
@login_required
def add_to_balance():
    """
    Updates current user's balance
    """
    balance = request.get_json().get('balance')

    if not (type(balance)==int or type(balance)==float):
        return error_message("balance", "Balance must be a number"), 400

    elif (current_user.balance + balance >= 10**10):
        return error_message("balance", "The maximum balance is reached.")

    else:
        current_user.balance += balance
        db.session.add(current_user)
        db.session.commit()
    return {"user": current_user.to_dict()}, 200
