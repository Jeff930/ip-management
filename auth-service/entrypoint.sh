#!/bin/sh

echo "Waiting for database."
while ! nc -z mysql 3306; do
  sleep 2
done
echo "Database is ready."

php artisan migrate --seed --force

exec php-fpm
