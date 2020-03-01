#!/bin/bash

echo '{"current": "db.sqlite3"}' >> database/config.json

python manage.py makemigrations

python manage.py migrate

python manage.py collectstatic --no-input

python setup_license.py