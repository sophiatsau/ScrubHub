import re
from wtforms.validators import ValidationError

# helper function for testing if valid US postal code
def is_valid_us_zip(form, field):
   if not re.search("^\d{5}(-\d{4})?$", field.data):
      raise ValidationError("Zip code is in the wrong format (use XXXXX or XXXXX-XXXX)")


def is_valid_us_number(form, field):
   if not re.search("^\(\d{3}\) \d{3}-\d{4}$", field.data):
      raise ValidationError("Phone number is in the wrong format. Please format your number as (XXX) XXX-XXXX")


#not working
def value_exists_in_table(field_name, model, msg):
   """
   Custom validator for dynamically checking if value of field already exists in db
   """
   def validator(form, field):
      data = field.data
      exists = model.query.filter(model[field_name]==data).first()
      if exists:
         raise ValidationError(msg)
   return validator
