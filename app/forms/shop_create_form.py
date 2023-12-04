from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TextAreaField, BooleanField
from wtforms.validators import DataRequired, Email, ValidationError, Length, NumberRange, Optional
from flask_wtf.file import FileField, FileAllowed

from app.models import Shop
from .utils import is_valid_us_zip
from ..api.utils import ALLOWED_EXTENSIONS

def shop_email_exists(form, field):
    # Checking if shop with same email exists
    email = field.data
    shop = Shop.query.filter(Shop.email == email).first()
    if shop:
        raise ValidationError('Email is in use: each shop must have a unique email.')

def shop_number_exists(form, field):
    # Checking if shop with same number exists
    number = field.data
    shop = Shop.query.filter(Shop.phoneNumber == number).first()
    if shop:
        raise ValidationError('Phone number is in use: each shop\'s phone number must be unique.')

class ShopCreateForm(FlaskForm):
    name = StringField(validators=[DataRequired(), Length(1,100,"Store must have a name between 1-100 characters long")])
    address = StringField(validators=[Length(max=255), DataRequired()])
    city = StringField(validators=[Length(max=255), DataRequired()])
    state = StringField(validators=[Length(max=255), DataRequired()])
    zipCode = StringField(validators=[is_valid_us_zip, DataRequired()])
    priceRange = IntegerField(validators=[DataRequired(), NumberRange(1,5, "Please select a price range for your critters")])
    businessHours = StringField(validators=[DataRequired(), Length(max=255)])
    email = StringField(validators=[DataRequired(), Email("Email is invalid"), shop_email_exists])
    phoneNumber = StringField(validators=[Optional(), Length(min=14, max=14), shop_number_exists])
    description = TextAreaField(validators=[Optional(), Length(max=5000)])
    coverImageUrl = FileField(validators=[DataRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    businessImageUrl = FileField(validators=[DataRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    searchImageUrl = FileField(validators=[DataRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    pickup = BooleanField()
    delivery = BooleanField()
    categories = StringField()
