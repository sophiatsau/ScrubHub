import os
import pathlib
import requests

from flask import Blueprint, jsonify, session, request, abort, redirect
from app.models import User, db
from app.forms import LoginForm, SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
from .utils import error_messages, error_message
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests

# when making Google account, there's a json file. Package wants to use the json file. We shouldn't upload this info to Github. These 2 packages are for creating temp json files.
from tempfile import NamedTemporaryFile
import json


# create & configure 'flow' object
# import credentials from .env
CLIENT_SECRET = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET')
CLIENT_ID = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
BASE_URL = os.getenv('BASE_URL') # for production

# lots of these are static values
client_secrets = {
    "web": {
        "client_id": CLIENT_ID,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth", # for initial request
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", # certificate provider
        "client_secret": CLIENT_SECRET,
        "redirect_uris": [
            "http://localhost:8000/api/auth/callback"
        ] # what we hit once we successfully log in. Every request contains redirect uri, Google checks every request.
    }
}

# generate temp file for json info
secrets = NamedTemporaryFile()
# property '.name' is file PATH to the temp file
# write client_secrets dictionary to temp file as json
with open(secrets.name, "w") as output:
    json.dump(client_secrets, output)

# allow http traffic for local dev
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

flow = Flow.from_client_secrets_file(
    client_secrets_file = secrets.name, # file location
    scopes = ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
    redirect_uri = "http://localhost:8000/api/auth/callback",
)

# delete temp file once flow obj is configured
secrets.close()


auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return error_message("user", 'Unauthenticated'), 401


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    return error_messages(form.errors), 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password'],
            firstName=form.firstName.data,
            lastName=form.lastName.data,
            balance=form.balance.data,
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()
    return error_messages(form.errors), 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return error_message("user", 'Unauthorized'), 403


# endpoints for oauth
# initialize flow
@auth_routes.route('/oauth_login')
def oauth_login():
    authorization_url, state = flow.authorization_url()


# redirect_uri
