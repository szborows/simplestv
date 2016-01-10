#!/bin/bash

cd /app

echo "Starting RabbitMQ server"
echo "exit 0" > /usr/sbin/policy-rc.d
invoke-rc.d rabbitmq-server start

echo "Starting Celero worker"
rm *.pid
C_FORCE_ROOT=1 celery multi start w1 -A backend -l info --autoreload

echo "Starting Django application"
mkdir /data
python3.4 manage.py migrate --run-syncdb
echo "echo \"from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'pass')\" | python3.4 manage.py shell" >> /tmp/createsuperuser
chmod a+x /tmp/createsuperuser
/tmp/createsuperuser
echo "*       * * * * (python3.4 /app/manage.py send_mail >> ~/cron_mail.log 2>&1)" >> /etc/crontab
echo "*       * * * * (python3.4 /app/manage.py retry_deferred >> ~/cron_mail_deferred.log 2>&1)" >> /etc/crontab

uwsgi --socket :8001 --module backend.wsgi --daemonize /var/log/uwsgi.log

/etc/init.d/nginx start

echo "kill -9 \`ps aux | grep uwsgi | head -n 1 | awk '{ print $2;  }'\` && uwsgi --socket :8001 --module backend.wsgi --daemonize /var/log/uwsgi.log" > /app/restart-backend.sh

cd /frontend
npm start
