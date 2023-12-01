from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField
from wtforms.validators import DataRequired, Email, ValidationError, Length, NumberRange, Optional
from app.models import User
from .utils import is_valid_us_zip


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')

class SignUpForm(FlaskForm):
    username = StringField(
        'username', validators=[DataRequired(), Length(4,40,"Username must be between 4 - 40 characters long"), username_exists])
    email = StringField('email', validators=[DataRequired(), Email("Email is invalid"), user_exists])
    password = StringField('password', validators=[DataRequired()])
    firstName = StringField(validators=[DataRequired(), Length(1,40,"First name must be between 1 - 40 characters long")])
    lastName = StringField(validators=[DataRequired(), Length(1,40,"Last name must be between 1 - 40 characters long")])
    balance = DecimalField(validators=[Optional(), NumberRange(0, 10_000_000_000)])
    address = StringField(validators=[Length(max=255)])
    city = StringField(validators=[Length(max=255)])
    state = StringField(validators=[Length(max=255)])
    zipCode = StringField(validators=[Optional(), is_valid_us_zip])
