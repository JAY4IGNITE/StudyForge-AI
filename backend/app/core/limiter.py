from slowapi import Limiter
from slowapi.util import get_remote_address

# Shared rate limiter instance. Imported by main.py (to attach to the app)
# and by individual route modules (to decorate endpoints), without either
# side importing from main.py and creating a circular import.
limiter = Limiter(key_func=get_remote_address)
