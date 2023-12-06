from flask import Blueprint, session, request
from app.models import Critter, db, Shop
from app.forms import CritterForm
from flask_login import current_user, login_required
from .utils import error_messages, error_message, get_unique_filename, upload_file_to_s3, remove_file_from_s3

critter_routes = Blueprint('critter', __name__)


@critter_routes.route('/')
def get_all_critters():
    """
    Returns all critters available as a list of dictionaries
    """
    critters = Critter.query.all()
    return {"critters": [critter.to_dict() for critter in critters]}, 200


@critter_routes.route('/current')
@login_required
def get_user_critters():
    """
    Returns all current user's critters as a list of dictionaries
    """
    return {"critters": current_user.get_critters()}, 200


@critter_routes.route('/<int:id>')
def get_one_critter(id):
    """
    Queries for and returns critter details by id
    TODO: add-ons for critters?
    ! Not in use
    """
    critter = Critter.query.get(id)
    if not critter:
        return error_message("critter", "Critter does not exist"), 404
    return critter.to_dict(scope="detailed")


@critter_routes.route('/<int:critterId>/edit', methods=['PUT'])
@login_required
def update_critter(critterId):
    """
    Edits an existing critter, returns edited critter as dictionary
    """
    critter = Critter.query.get(critterId)

    # errors
    if not critter:
        return error_message("critter", "Critter not found."), 404
    if critter.shop.userId != current_user.id:
        return error_message("user", "Authorization Error."), 403

    form = CritterForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        img = form.data["previewImageUrl"]

        # set new url if needed
        if type(img).__name__ == "FileStorage":
            img.filename = get_unique_filename(img.filename)
            upload = upload_file_to_s3(img)

            if "url" not in upload:
                # if no upload key, there was an error uploading.
                return upload, 500

            url = upload["url"]
        else:
            # string or None
            url = None if form.data["removePreview"] else critter.previewImageUrl

        # delete original image if they're different
        if critter.previewImageUrl and url is not critter.previewImageUrl:
            delete_success = remove_file_from_s3(critter.previewImageUrl)

            if delete_success is not True:
                print("🚀 ~ file: critter_routes.py:83 ~ delete_success:", delete_success)

        critter.name = form.name.data
        critter.species = form.species.data
        critter.price = form.price.data
        critter.category = form.category.data
        critter.description = form.description.data
        critter.stock = form.stock.data
        critter.previewImageUrl = url

        db.session.add(critter)
        db.session.commit()

        return critter.to_dict(scope="detailed"), 200
    elif form.errors:
        return error_messages(form.errors), 400
    else:
        return error_message("unknownError", "An unknown error occurred."), 500



@critter_routes.route("/<int:critterId>/delete", methods=["DELETE"])
@login_required
def delete_critter(critterId):
    """
    Deletes a critter and returns a message if successfully deleted
    """
    critter = Critter.query.get(critterId)
    if not critter:
        return error_message("critter", "Critter not found."), 404

    if critter.shop.userId != current_user.id:
        return error_message("user", "Authorization Error."), 403

    delete_success = remove_file_from_s3(critter.previewImageUrl)

    if delete_success is True:
        db.session.delete(critter)
        db.session.commit()
        return {"message": "Critter successfully deleted"}, 200
    else:
        return error_message("file", "File deletion error"), 401
