import re

# helper function for testing if valid US postal code
def is_valid_us_zip(form, field):
   return re.search("^\d{5}(-\d{4})?$", field.data)
