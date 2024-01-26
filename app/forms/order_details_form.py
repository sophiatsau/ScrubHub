from flask_wtf import FlaskForm
from wtforms import DecimalField, IntegerField
from wtforms.validators import DataRequired, NumberRange


class OrderDetailForm(FlaskForm):
    # orderId = IntegerField(validators=[DataRequired()])
    critterId = IntegerField(validators=[DataRequired()])
    quantity = IntegerField(validators=[DataRequired(), NumberRange(min=1)])
    # unitPrice = DecimalField(validators=[DataRequired()], places=2)
