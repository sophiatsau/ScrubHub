from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DecimalField, SelectField
from wtforms.validators import DataRequired, Length, NumberRange, Optional
from flask_wtf.file import FileField, FileAllowed
from ..api.utils import ALLOWED_EXTENSIONS

class CritterEditForm(FlaskForm):
    name = StringField(validators=[DataRequired(), Length(2,255,"Critter must have a name between 2-255 characters long")])
    species = StringField(validators=[DataRequired(), Length(2,255,"Critter must have a species between 2-255 characters long")])
    price = DecimalField(validators=[DataRequired(), NumberRange(0.01,10**16, "Please select a price range for your critters")], places=2)
    category = SelectField(validators=[DataRequired], choices=[])
    previewImageUrl = FileField(validators=[Optional(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    description = StringField(validators=[Optional(), Length(max=255)])
    stock=IntegerField(validators=[DataRequired(), NumberRange(min=0)])
