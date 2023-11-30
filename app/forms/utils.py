import re
from wtforms.validators import ValidationError

# helper function for testing if valid US postal code
def is_valid_us_zip(form, field):
   if not re.search("^\d{5}(-\d{4})?$", field.data):
      raise ValidationError("Zip code is invalid.")
