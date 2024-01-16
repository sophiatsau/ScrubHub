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


@order_routes.route('/current')
@login_required
def get_user_orders():
    """
    Returns details of all of current user's orders as a list of dictionaries
    """
    return {"orders": current_user.get_orders()}, 200


@order_routes.route('/new', methods=['POST'])
@login_required
def start_order():
    """
    Creates a new Order and new OrderDetail, adds them to the database, and returns order as dictionary
    """
    # cannot have 2 existing orders in bag
    existing_order = current_user.to_dict()["bag"]

    if existing_order:
        return error_message("order", "Order already in progress"), 400

    form = OrderForm()

    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        # create order
        order = Order(
            userId=current_user.id,
            shopId=form.shopId.data,
            orderStatus="Bag",
            orderType=form.orderType.data,
        )

        db.session.add(order)

        # validate, create, add detail
        critter = Critter.query.get(form.critterId.data)
        if not critter:
            return error_message("critter", "Critter not found."), 404

        if critter.shopId != order.shopId:
            return error_message("shop", "Please add a critter from the same shop as the order"), 400
        if critter.stock < form.quantity.data:
            return error_message("stock", "Please select a quantity between 1 and available stock"), 400

        detail = OrderDetail(
            orderId=order.id,
            critterId=form.critterId.data,
            quantity=form.quantity.data,
        )
        db.session.add(detail)
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
    # error handling
    detail = OrderDetail.query.get(detailId)
    if not detail or detail.orderId != orderId:
        return error_message("orderDetails", "Order Details not found"), 404
    # validate that current user is user who has the order
    if detail.order.userId != current_user.id:
        return error_message("user", "Authorization Error."), 403

    # update data
    form = OrderDetailForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        # confirm same critter
        if form.critterId.data != detail.critterId:
            return error_message("critter", "Cannot update critterId"), 400

        # confirm critter exists & is from the same shop
        critter = Critter.query.get(form.critterId.data)
        if not critter:
            return error_message("critter", "Critter not found."), 404
        if critter.shopId != detail.order.shopId:
            return error_message("critter", "Critter is not from the same shop."), 400

        # confirm critter has enough stock for order
        if critter.stock < form.quantity.data:
            return error_message("stock", "Please select a quantity between 1 and available stock"), 400

        detail.quantity = form.quantity.data

        db.session.add(detail)
        db.session.commit()

        return {"order": detail.order.to_dict()}, 200
    elif form.errors:
        return error_messages(form.errors), 400
    else:
        return error_message(), 500


@order_routes.route('/<int:orderId>/delete', methods=['DELETE'])
@login_required
def empty_bag(orderId):
    """
    Deletes existing Order and returns message if successful. Can only delete Order if its order status is "Bag".
    """
    order = Order.query.get(orderId)

    # confirm order exists
    if not order:
        return error_message("order", "Order not found."), 404
    # validate that current user is user who has the order
    if order.userId != current_user.id:
        return error_message("user", "Authorization Error."), 403
    if order.orderStatus != "Bag":
        return error_message("orderStatus", "Cannot empty bag"), 400

    db.session.delete(order)
    db.session.commit()

    return {"message": "Bag has been emptied"}, 200


@order_routes.route('/<int:orderId>/details/<int:detailId>/delete', methods=['DELETE'])
@login_required
def remove_order(orderId, detailId):
    """
    Deletes existing OrderDetail and returns message if successful. If Order is empty after deletion, delete the entire Order
    """
    # error handling
    detail = OrderDetail.query.get(detailId)
    if not detail or detail.orderId != orderId:
        return error_message("orderDetails", "Order Details not found"), 404
    if detail.order.userId != current_user.id:
        return error_message("user", "Authorization Error."), 403
    if detail.order.orderStatus != "Bag":
        return error_message("orderStatus", "Cannot delete order detail"), 403

    # deletion
    order = detail.order
    if len(order.orderDetails) > 1:
        db.session.delete(detail)
        db.session.commit()
        return {"order": order.to_dict()}, 200
    else:
        db.session.delete(order)
        db.session.commit()
        return {"message": "Bag has been emptied"}, 200


@order_routes.route('/<int:orderId>/checkout', methods=['PUT'])
@login_required
def checkout(orderId):
    """
    Updates order status to 'En Route' or 'Waiting for Pickup'  depending on if Order is Delivery or Pickup, updates purchasedAt. Updates critter stock and user balance.
    TODO: Returns updated order status (might need to return shop's critter list > order?)
    """
    order = Order.query.get(orderId)

    # validations
    if not order:
        return error_message("order", "Order not found."), 404
    if order.userId != current_user.id:
        return error_message("user", "Authorization Error."), 403
    if order.orderStatus != "Bag":
        return error_message("orderStatus", "Order has already been made"), 400

    # check, deduct user balance
    if current_user.balance < order.total_price:
        return error_message("balance", "Your balance is too low to make this purchase."), 400
    else:
        current_user.balance -= order.total_price

    # returns (error_field, message) if fail
    # if successful, updates order + order details info
    checkout_fail = order.checkout()
    if checkout_fail:
        return error_message(*checkout_fail), 400

    # don't commit until all actions are confirmed to be valid
    db.session.add(order)
    db.session.commit()
    return {"order": order.to_dict()}, 200


@order_routes.route('/<int:orderId>/complete', methods=['PATCH'])
@login_required
def complete_order(orderId):
    """
    Updates order status to 'Completed', returns updated order as dictionary
    """
    order = Order.query.get(orderId)

    # validations
    if not order:
        return error_message("order", "Order not found."), 404
    if order.userId != current_user.id:
        return error_message("user", "Authorization Error."), 403
    if order.orderStatus in ("En Route", "Waiting for Pickup"):
        order.complete_order()
        db.session.commit()
        return {"order": order.to_dict()}, 200

    return error_message("orderStatus", "Cannot complete order"), 400
