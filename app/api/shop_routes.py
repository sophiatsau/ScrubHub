from flask import Blueprint, session, request
from app.models import Shop, db, Category, Critter
from app.forms import CritterForm, ShopForm
from flask_login import current_user, login_required
from .utils import error_messages, error_message, get_unique_filename, upload_file_to_s3, remove_file_from_s3

shop_routes = Blueprint('shop', __name__)


@shop_routes.route('/')
def get_all_shops():
    """
    Returns all shops available as a list of dictionaries
    """
    shops = Shop.query.all()
    return {"shops": [shop.to_dict() for shop in shops]}, 200


@shop_routes.route('/current')
@login_required
def get_user_shops():
    """
    Returns all current user's shops as a list of dictionaries
    """
    return {"shops": [shop.to_dict() for shop in current_user.shops]}, 200


@shop_routes.route('/<int:id>')
def get_one_shop(id):
    """
    Queries for and returns shop details by id
    """
    shop = Shop.query.get(id)
    if not shop:
        return error_message("shop", "Shop does not exist"), 404
    return {"shop": shop.to_dict(scope="detailed")}, 200


@shop_routes.route('/new', methods=['POST'])
@login_required
def create_shop():
    """
    Creates a new shop and adds it to the database, returns new shop as dictionary
    """
    form = ShopForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        images = {}

        category_list = form.data['categories'].split(',')
        categories = Category.query.filter(Category.name.in_(category_list)).all()

        # if not categories:
        #     return {"errors":"no cats"}, 400

        for field in ["searchImageUrl","coverImageUrl","businessImageUrl"]:
            img = form.data[field]
            img.filename = get_unique_filename(img.filename)
            upload = upload_file_to_s3(img)

            if "url" not in upload:
                # if no upload key, there was an error uploading.
                # delete previously uploaded urls to save space
                _ = [remove_file_from_s3(img) for img in images.values()]

                return upload, 500

            url = upload["url"]
            images[field]=url

        form_data = {**form.data, **images, "userId": current_user.id}

        del form_data['csrf_token']
        del form_data['categories']

        shop = Shop( **form_data)

        shop.categories.extend(categories)

        db.session.add(shop)
        db.session.commit()
        return {"shop": shop.to_dict(scope="detailed")}, 201
    elif form.errors:
        return error_messages(form.errors), 400
    else:
        return error_message("UnknownError", "An unknown error occurred."), 500


@shop_routes.route('/<int:shopId>/edit', methods=['PUT'])
@login_required
def update_shop(shopId):
    """
    Edits an existing shop, returns edited shop as dictionary
    """
    shop = Shop.query.get(shopId)

    # errors
    if not shop:
        return error_message("shop", "Shop not found."), 404
    if shop.userId != current_user.id:
        return error_message("user", "Authorization Error."), 403

    form = ShopForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        updated_data = {}
        delete_success = []

        for field in ["searchImageUrl","coverImageUrl","businessImageUrl"]:
            img = form.data[field]
            if not img:
                # don't set it to None
                delete_success.append(True)
                continue
            img.filename = get_unique_filename(img.filename)
            upload = upload_file_to_s3(img)

            if "url" not in upload:
                # if no upload key, there was an error uploading.
                # delete previously uploaded urls to save space
                _ = [remove_file_from_s3(img) for img in updated_data.values()]
                return upload, 500

            # delete original file
            delete = remove_file_from_s3(shop.to_dict(scope="detailed")[field])

            delete_success.append(delete)

            url = upload["url"]
            updated_data[field]=url

        shop.name = form.name.data
        shop.address = form.address.data
        shop.city = form.city.data
        shop.state = form.state.data
        shop.zipCode = form.zipCode.data
        shop.priceRange = form.priceRange.data
        shop.businessHours = form.businessHours.data
        shop.pickup = form.pickup.data
        shop.delivery = form.delivery.data
        shop.email = form.email.data
        shop.phoneNumber = form.phoneNumber.data
        shop.description = form.description.data

        shop.searchImageUrl = updated_data.get("searchImageUrl", shop.searchImageUrl)
        shop.coverImageUrl = updated_data.get("coverImageUrl", shop.coverImageUrl)
        shop.businessImageUrl = updated_data.get("businessImageUrl", shop.businessImageUrl)

        category_list = form.data['categories'].split(',')

        categories = Category.query.filter(Category.name.in_(category_list)).all()

        shop.categories = categories

        db.session.add(shop)
        db.session.commit()

        if [success for success in delete_success if success is not True]:
            print("🚀 ~ file: shop_routes.py:159 ~ delete_success not successful:", delete_success)

        return {"shop": shop.to_dict(scope="detailed")}, 200
    elif form.errors:
        return error_messages(form.errors), 400
    else:
        return error_message("UnknownError", "An unknown error occurred."), 500


@shop_routes.route("/<int:shopId>/delete", methods=["DELETE"])
@login_required
def delete_shop(shopId):
    """
    Deletes a shop and returns a message if successfully deleted
    """
    shop = Shop.query.get(shopId)
    if not shop:
        return error_message("shop", "Shop not found."), 404

    if shop.userId != current_user.id:
        return error_message("user", "Authorization Error."), 403

    delete1 = remove_file_from_s3(shop.searchImageUrl)
    delete2 = remove_file_from_s3(shop.coverImageUrl)
    delete3 = remove_file_from_s3(shop.businessImageUrl)

    if all([delete1,delete2,delete3]):
        db.session.delete(shop)
        db.session.commit()
        return {"message": "Shop successfully deleted"}, 200
    else:
        return error_message("file", "File deletion error"), 401


@shop_routes.route("/<int:shopId>/critters/new", methods=["POST"])
@login_required
def create_critter(shopId):
    """
    Creates a new critter and adds it to the database, returns new critter as dictionary
    """

    shop = Shop.query.get(shopId)
    if not shop:
        return error_message("shop", "Shop not found."), 404

    if shop.userId != current_user.id:
        return error_message("user", "Authorization Error."), 403

    form = CritterForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        img = form.data["previewImageUrl"]

        if img:
            img.filename = get_unique_filename(img.filename)
            upload = upload_file_to_s3(img)
            if "url" not in upload:
                # if no upload key, there was an error uploading.
                return upload, 500
            url = upload["url"]

        form_data = {**form.data, "previewImageUrl": url if img else None, "shopId": shopId,}

        del form_data['csrf_token']
        del form_data["removePreview"]

        critter = Critter(**form_data)

        db.session.add(critter)
        db.session.commit()
        return {"critter": critter.to_dict()}, 201
    elif form.errors:
        return error_messages(form.errors), 400
    else:
        return error_message("UnknownError", "An unknown error occurred."), 500
