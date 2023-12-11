from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired,ValidationError, Length
from app.models import Address
from .utils import is_valid_us_zip


def address_exists(form, field):
    # Checking if full address already exists for user
    fullAddress = field.data
    address = Address.query.filter(Address.fullAddress == fullAddress).first()
    if address:
        raise ValidationError('This address has already been added to your account.')


class AddressForm(FlaskForm):
    name = StringField(validators=[DataRequired(),Length(max=40)])
    fullAddress = StringField(validators=[DataRequired(),Length(max=255)])
    address = StringField(validators=[DataRequired(),Length(max=50)])
    city = StringField(validators=[DataRequired(),Length(max=50)])
    state = StringField(validators=[DataRequired(),Length(max=50)])
    zipCode = StringField(validators=[DataRequired(),is_valid_us_zip])
