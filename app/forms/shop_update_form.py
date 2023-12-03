from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TextAreaField, BooleanField
from wtforms.validators import DataRequired, Email, ValidationError, Length, NumberRange, Optional
from flask_wtf.file import FileField, FileAllowed

from app.models import Shop
from .utils import is_valid_us_zip, value_exists_in_table
from ..api.utils import ALLOWED_EXTENSIONS


class ShopUpdateForm(FlaskForm):
    name = StringField(validators=[DataRequired(), Length(1,100,"Store must have a name between 1-100 characters long")])
    address = StringField(validators=[Length(max=255), DataRequired()])
    city = StringField(validators=[Length(max=255), DataRequired()])
    state = StringField(validators=[Length(max=255), DataRequired()])
    zipCode = StringField(validators=[is_valid_us_zip, DataRequired()])
    priceRange = IntegerField(validators=[DataRequired(), NumberRange(1,5, "Please select a price range for your critters")])
    businessHours = StringField(validators=[DataRequired(), Length(max=255)])
    email = StringField(validators=[Optional(), Email("Email is invalid"), value_exists_in_table("email", Shop, 'Email is in use: each shop must have a unique email.')])
    phoneNumber = StringField(validators=[Optional(), Length(min=14, max=14), value_exists_in_table("phoneNumber", Shop, 'Phone number is in use: each shop\'s phone number must be unique.')])
    description = TextAreaField(validators=[Optional(), Length(max=5000)])
    coverImageUrl = FileField(validators=[Optional(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    businessImageUrl = FileField(validators=[Optional(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    searchImageUrl = FileField(validators=[Optional(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    pickup = BooleanField()
    delivery = BooleanField()
    categories = StringField()
