from random import randint
from faker import Faker
fake = Faker()

def generate_address():
    """
    Generates components of random addresses
    """
    invalid_address = True
    while (invalid_address):
        try:
            full_address = fake.address()
            [street_address, city_state_zip] = full_address.split('\n')
            [city, state_zip] = city_state_zip.split(', ')
            [state, zip] = state_zip.split(' ')
            return [street_address, city, state, zip, full_address]
        except ValueError:
            continue

def generate_numbers(n):
    """
    Generates phone numbers in the proper format
    """
    numbers = set()
    while len(numbers) < n:
        num = f'({randint(100,999)}) {randint(100,999)}-{randint(1000,9999)}'
        numbers.add(num)
    return list(numbers)
