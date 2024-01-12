from flask import Blueprint
from flask_login import login_required, current_user
from app.models import db, Order, OrderDetail
from app.forms import order_details_form, order_form
from .utils import error_messages, error_message

order_routes = Blueprint('orders', __name__)


@order_routes.route('/')
@login_required
def test():
    orders = Order.query.all()
    return {"orders": [order.to_dict() for order in orders]}, 200


@order_routes.route('/new', methods=['POST'])
@login_required
def start_order():
    """
    Creates a new Order and new OrderDetail, adds them to the database, and returns order as dictionary
    """
    return {"message": "route connected!"}, 201


@order_routes.route('/<int:orderId>/add', methods=['PUT'])
@login_required
def add_to_order(orderId):
    """
    Creates a new OrderDetail, adds it to the database, and returns order detail as dictionary
    """
    # validate that current user is user who has the order
    return {"message": "route connected!"}, 200


@order_routes.route('/<int:orderId>/details/<int:detailId>/update', methods=['PATCH'])
@login_required
def edit_order(orderId, detailId):
    """
    Updates quantity of existing OrderDetail and returns updated order detail as dictionary.
    """
    # validate that current user is user who has the order
    return {"message": "route connected!"}, 200


@order_routes.route('/<int:orderId>/details/<int:detailId>/delete', methods=['DELETE'])
@login_required
def remove_order(orderId, detailId):
    """
    Deletes existing OrderDetail and returns message if successful. If Order is empty after deletion, delete the entire Order
    """
    # validate that current user is user who has the order
    return {"message": "route connected!"}, 200


@order_routes.route('/<int:orderId>/checkout', methods=['PUT'])
@login_required
def checkout(orderId):
    """
    Updates order status to 'En Route' or 'Ready for Pickup'  depending on if Order is Delivery or Pickup, updates purchasedAt. Sets order type. Updates critter stock and user balance.
    TODO: Returns updated order status (might need to return shop's critter list > order?)
    """
    # validate that current user is user who has the order
    return {"message": "route connected!"}, 200


@order_routes.route('/<int:orderId>/completed', methods=['PATCH'])
@login_required
def complete_order(orderId):
    """
    Updates order status to 'Completed', returns updated order as dictionary
    """
    # validate that current user is user who has the order
    return {"message": "route connected!"}, 200
