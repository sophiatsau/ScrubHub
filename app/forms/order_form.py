from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, RadioField, DateField
from wtforms.validators import DataRequired, Length


class OrderForm(FlaskForm):
    # userId = IntegerField(validators=[DataRequired()])
    shopId = IntegerField(validators=[DataRequired()])
    # orderStatus = StringField(validators=[DataRequired(),Length(max=255)])
    orderType = RadioField(choices=["Delivery", "Pickup"], validators=[DataRequired()])
    # purchasedAt = DateField()
