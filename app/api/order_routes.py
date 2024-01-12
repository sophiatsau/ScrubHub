from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Order, OrderDetail, Critter
from app.forms import OrderForm, OrderDetailForm
from .utils import error_messages, error_message

order_routes = Blueprint('orders', __name__)


@order_routes.route('/')
@login_required
def get_all_orders():
    """
    Returns all orders as a list of dictionaries. Use only for testing.
    """
    orders = Order.query.all()
    return {"orders": [order.to_dict() for order in orders]}, 200


@order_routes.route('/<int:orderId>')
@login_required
def get_order(orderId):
    """
    Returns a single order as a dictionary. Use only for testing.
    """
    order = Order.query.get(orderId)
    if not order:
        return error_message("order", "Order not found."), 404
    return {"order": order.to_dict()}, 200


@order_routes.route('/new', methods=['POST'])
@login_required
def start_order():
    """
    Creates a new Order and new OrderDetail, adds them to the database, and returns order as dictionary
    """
    form = OrderForm()

    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        order = Order(
            userId=current_user.id,
            shopId=form.shopId.data,
            orderStatus="Bag",
            orderType=form.orderType.data,
        )
        db.session.add(order)
        db.session.commit()

        return {"order": order.to_dict()}, 201
    elif form.errors:
        return error_messages(form.errors), 400
    else:
        return error_message(), 500


@order_routes.route('/<int:orderId>/add', methods=['PUT'])
@login_required
def add_to_order(orderId):
    """
    Creates a new OrderDetail, adds it to the database, and returns order detail as dictionary
    """
    order = Order.query.get(orderId)

    # confirm order exists
    if not order:
        return error_message("order", "Order not found."), 404
    # validate that current user is user who has the order
    if order.userId != current_user.id:
        return error_message("user", "Authorization Error."), 403

    form = OrderDetailForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        # confirm order detail does not already exist for that critter
        if form.critterId.data in [detail.critterId for detail in order.orderDetails]:
            return error_message("critter", "Critter has already been added to order."), 400

        # confirm critter exists & is from the same shop
        critter = Critter.query.get(form.critterId.data)
        if not critter:
            return error_message("critter", "Critter not found."), 404

        if critter.shopId != order.shopId:
            return error_message("shop", "Please add a critter from the same shop as the order"), 400

        # confirm critter has enough stock for order
        if critter.stock < form.quantity.data:
            return error_message("stock", "Please select a quantity between 1 and available stock"), 400

        detail = OrderDetail(
            orderId=orderId,
            critterId=form.critterId.data,
            quantity=form.quantity.data,
        )

        db.session.add(detail)
        db.session.commit()

        return {"order": order.to_dict()}, 200
    elif form.errors:
        return error_messages(form.errors), 400
    else:
        return error_message(), 500


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
    Updates order status to 'En Route' or 'Waiting for Pickup'  depending on if Order is Delivery or Pickup, updates purchasedAt. Sets order type. Updates critter stock and user balance.
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
