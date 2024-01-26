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
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
CLIENT_ID = os.getenv('CLIENT_ID')
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
            "http://localhost:5000/api/auth/callback",
            "https://crittr.onrender.com/api/auth/callback"
        ], # what we hit once we successfully log in. Every request contains redirect uri, Google checks every request.
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

redirect_uri = "http://localhost:5000/api/auth/callback" if os.getenv('NODE_ENV') != "production" else "https://crittr.onrender.com/api/auth/callback"

flow = Flow.from_client_secrets_file(
    client_secrets_file = secrets.name, # file location
    scopes = ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
    redirect_uri = os.getenv('REDIRECT_URI'),
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
        return current_user.to_dict(), 200
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
        return user.to_dict(), 200
    return error_messages(form.errors), 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}, 200


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
        return user.to_dict(), 201
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
    # generates random value for state variable + authorization_url
    # state variable – similar to csrf for OAUTH, random value
    authorization_url, state = flow.authorization_url()

    # double check auth url
    print("AUTH URL: ", authorization_url)
    # Ex: https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fcallback&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&state=A0eZyFD4WH6AfqSj7XcdypQ0cMhwr9&access_type=offline
    # Looks a lot like URL in 2nd line of flow chart
    # access_type=offline - shows Google Login screen for user
    # NO code_challenge_method or code_challenge

    session['state'] = state # saves state (random value) to session for later comparison
    # return authorization_url
    return redirect(authorization_url)
    # lines 2, 3 of flow chart
    # no nonce value sent


# redirect_uri
@auth_routes.route('/callback')
def callback():
    # authorization (req is line 6 of flowchart, res is 7)
    flow.fetch_token(authorization_response=request.url)

    # CSRF protection for Oauth
    # request is from flask
    if not session["state"] == request.args["state"]:
        abort(500) # if state doesn't match

    credentials = flow.credentials
    request_session = requests.session() # module not from flask
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session) # this code is very short lived, we send code back to Google

    # verify JWT signature sent with object from OpenID Connect
    # tests values for sub, aud, iat, exp in JWT CLAIMS section? (no nonce value, else server would return nonce in JWT claims to be verified too)
    # id_token: imported from google oauth package
    # returns dictionary including google account name, email
    id_info = id_token.verify_oauth2_token(
        id_token = credentials._id_token,
        request = token_request,
        audience = CLIENT_ID
    )

    # generate new session for newly authenticated user
    # creates a new user if email isn't already in system
    temp_email = id_info.get('email')

    user_exists = User.query.filter(User.email == temp_email).first()

    if not user_exists:
        user_exists = User(
            username = id_info.get("name"),
            email = temp_email,
            password = 'OAUTH',
            firstName = id_info.get('given_name'),
            lastName = id_info.get('family_name'),
        )

        db.session.add(user_exists)
        db.session.commit()

    login_user(user_exists)
    # add this to Render variables, base_url is deployed url. final redirect, flow chart line 8
    return redirect(f"{BASE_URL}/")
    # return
