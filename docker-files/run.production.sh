#!/bin/bash

cd /app
export SIMPLESTV_CONFIG_PATH="/app/config"

echo "Starting PostgreSQL server"
/etc/init.d/postgresql start

echo "Starting RabbitMQ server"
echo "exit 0" > /usr/sbin/policy-rc.d
invoke-rc.d rabbitmq-server start

cd /app/backend

echo "Starting Celero worker"
rm *.pid
rm *.log
C_FORCE_ROOT=1 celery multi start w1 -A backend -l info

echo "Starting Django application"
mkdir /data
python3.4 manage.py migrate --run-syncdb
uwsgi --socket :8001 --module backend.wsgi --daemonize /var/log/uwsgi.log

echo "Starting reverse proxy"
/etc/init.d/nginx start
