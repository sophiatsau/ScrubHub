from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TextAreaField, BooleanField
from wtforms.validators import DataRequired, Email, Length, NumberRange, Optional
from flask_wtf.file import FileField, FileAllowed

from .utils import is_valid_us_zip, is_valid_us_number
from ..api.utils import ALLOWED_EXTENSIONS

class ShopForm(FlaskForm):
    name = StringField(validators=[DataRequired(), Length(1,50,"Store must have a name between 1-50 characters long.")])
    address = StringField(validators=[Length(max=100), DataRequired()])
    city = StringField(validators=[Length(max=100), DataRequired()])
    state = StringField(validators=[Length(max=100), DataRequired()])
    zipCode = StringField(validators=[is_valid_us_zip, DataRequired()])
    priceRange = IntegerField(validators=[DataRequired(), NumberRange(1,5, "Please select a price range for your critters.")])
    businessHours = StringField(validators=[DataRequired(), Length(max=255)])
    email = StringField(validators=[Optional(), Email("Email is invalid.")])
    phoneNumber = StringField(validators=[Optional(), Length(min=10, max=14), is_valid_us_number])
    description = TextAreaField(validators=[Optional(), Length(max=5000)])
    coverImageUrl = FileField(validators=[Optional(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    businessImageUrl = FileField(validators=[Optional(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    searchImageUrl = FileField(validators=[Optional(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    pickup = BooleanField()
    delivery = BooleanField()
    categories = StringField()
