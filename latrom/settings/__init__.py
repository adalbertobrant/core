import os
from .base import *

PRODUCTION = os.path.exists(os.path.join(os.path.dirname(
    os.path.abspath(__file__)), 'deploy.txt'))

if PRODUCTION:
    from latrom.settings.production import *

else:
    from latrom.settings.development import *
