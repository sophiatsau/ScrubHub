from flask import Blueprint, session, request
from app.models import Shop, db
from app.forms import ShopCreateForm
from flask_login import current_user, login_required
from .utils import error_messages, error_message

shop_routes = Blueprint('shop', __name__)


@shop_routes('/')
def get_all_shops():
    """
    Returns all shops available
    """
    shops = Shop.query.all()
    return {"shops": [shop.to_dict() for shop in shops]}

@shops_routes('/:id')
def get_one_shop(id):
    """
    Queries for and returns shop details by id
    """
    shop = Shop.query.get(id)
    return shop.to_dict(scope="detailed")

@shop_routes('/new', methods=['POST'])
@login_required
def create_shop():
    """
    Creates a new shop and adds it to the database, returns new shop as dictionary
    """
    form = ShopCreateForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():

        shop = Shop()
        db.session.add(shop)
        db.session.commit()
        return shop.to_dict(scope="detailed")
    elif form.errors:
        return error_messages(form.errors), 400
    else:
        return error_message(), 500
