#!/bin/bash

cd /app

echo "Starting PostgreSQL server"
/etc/init.d/postgresql start

echo "Starting RabbitMQ server"
echo "exit 0" > /usr/sbin/policy-rc.d
invoke-rc.d rabbitmq-server start

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

echo "Auxiliary steps"
echo "kill -9 \`ps aux | grep uwsgi | head -n 1 | awk '{ print \$2;  }'\` && uwsgi --socket :8001 --module backend.wsgi --daemonize /var/log/uwsgi.log" > /app/restart-backend.sh

echo "Running dev-frontend..."
cd /frontend
npm start
