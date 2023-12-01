from flask import Blueprint, session, request
from app.models import Shop, db
from app.forms import ShopCreateForm
from flask_login import current_user, login_required
from .utils import error_messages, error_message, get_unique_filename, upload_file_to_s3, remove_file_from_s3

shop_routes = Blueprint('shop', __name__)


@shop_routes.route('/')
def get_all_shops():
    """
    Returns all shops available
    """
    shops = Shop.query.all()
    return {"shops": [shop.to_dict() for shop in shops]}

@shop_routes.route('/<int:id>')
def get_one_shop(id):
    """
    Queries for and returns shop details by id
    """
    shop = Shop.query.get(id)
    return shop.to_dict(scope="detailed")

@shop_routes.route('/new', methods=['POST'])
@login_required
def create_shop():
    """
    Creates a new shop and adds it to the database, returns new shop as dictionary
    """
    form = ShopCreateForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        images = {}

        for field in ["searchImageUrl","coverImageUrl","businessImageUrl"]:
            img = form.data[field]
            img.filename = get_unique_filename(img.filename)
            upload = upload_file_to_s3(img)
            print("🚀 ~ file: shop_routes.py:50 ~ upload:", upload)

            if "url" not in upload:
                # if no upload key, there was an error uploading.
                return upload, 500

            url = upload["url"]
            images[field]=url

        # form_data = {**form.data, **images, "userId": current_user.id}

        shop = Shop(
            **form.data, **images, userId=current_user.id
            )
        db.session.add(shop)
        db.session.commit()
        return shop.to_dict(scope="detailed")
    elif form.errors:
        return error_messages(form.errors), 400
    else:
        return error_message(), 500
