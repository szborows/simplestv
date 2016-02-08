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

cat << EOF | python manage.py shell
from django.contrib.auth.models import User
User.objects.create_superuser('admin', 'admin@example.com', 'pass')
EOF

echo "Starting reverse proxy"
cat << EOF | python
import configparser, sys, os
config = configparser.ConfigParser()
config.read(os.environ['SIMPLESTV_CONFIG_PATH'])
if config['server']['ssl'].lower() == "true":
    sys.exit(0)
else:
    sys.exit(1)
EOF
if [ $? -eq 0 ]; then
    echo "Using ssl"
    ln -s /etc/nginx/sites-available/simplestv-https /etc/nginx/sites-enabled/simplestv
else
    echo "Not using ssl"
    ln -s /etc/nginx/sites-available/simplestv-plain /etc/nginx/sites-enabled/simplestv
fi
/etc/init.d/nginx start

echo "Running dev-frontend..."
cd /frontend
npm start
