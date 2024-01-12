from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField, DateField
from wtforms.validators import DataRequired, Length


class OrderForm(FlaskForm):
    userId = IntegerField(validators=[DataRequired()])
    shopId = IntegerField(validators=[DataRequired()])
    orderStatus = StringField(validators=[DataRequired(),Length(max=255)])
    orderType = SelectField(validators=[DataRequired()],choices=["Delivery", "Pickup"])
    purchasedAt = DateField()
