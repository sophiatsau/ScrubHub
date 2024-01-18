from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, OrderDetail, Critter
from app.forms import OrderDetailForm
from .utils import error_messages, error_message

order_detail_routes = Blueprint('order_details', __name__)


@order_detail_routes.route('/<int:detailId>/update', methods=['PATCH'])
@login_required
def edit_order(detailId):
    """
    Updates quantity of existing OrderDetail and returns updated order detail as dictionary.
    """
    # error handling
    detail = OrderDetail.query.get(detailId)
    if not detail:
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


@order_detail_routes.route('/<int:detailId>/delete', methods=['DELETE'])
@login_required
def remove_order(detailId):
    """
    Deletes existing OrderDetail and returns message if successful. If Order is empty after deletion, delete the entire Order
    """
    # error handling
    detail = OrderDetail.query.get(detailId)
    if not detail:
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
