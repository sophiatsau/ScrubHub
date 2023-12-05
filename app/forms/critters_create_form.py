from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TextAreaField, BooleanField, DecimalField, SelectField
from wtforms.validators import DataRequired, Email, ValidationError, Length, NumberRange, Optional
from flask_wtf.file import FileField, FileAllowed

# from app.models import Shop
# from .utils import is_valid_us_zip
from ..api.utils import ALLOWED_EXTENSIONS
# from app.seeds.categories import CATEGORIES


class CritterCreateForm(FlaskForm):
    name = StringField(validators=[DataRequired(), Length(2,255,"Critter must have a name between 2-255 characters long")])
    species = StringField(validators=[DataRequired(), Length(2,255,"Critter must have a species between 2-255 characters long")])
    price = DecimalField(validators=[DataRequired(), NumberRange(0.01,10**16, "Please select a price range for your critters")], places=2)
    category = SelectField(validators=[DataRequired], choices=[])
    previewImageUrl = FileField(validators=[Optional(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    description = StringField(validators=[Optional(), Length(max=255)])
    stock=IntegerField(validators=[DataRequired(), NumberRange(min=0)])




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
