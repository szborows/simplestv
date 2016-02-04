#!/bin/bash

cd /app
export SIMPLESTV_CONFIG_PATH="/app/config"
echo "exit 0" > /usr/sbin/policy-rc.d

echo "Starting PostgreSQL server"
if [ ! -e /data/postgres ]; then
    chown -R postgres:postgres /data/postgres
    su - postgres -c "/usr/lib/postgresql/9.4/bin/initdb -D /data/postgres"
fi
sed -i "s/data_directory.*/data_directory = '\/data\/postgres\'/g" /etc/postgresql/9.4/main/postgresql.conf
/etc/init.d/postgresql start
su - postgres -c "psql --command \"CREATE USER docker WITH SUPERUSER password 'docker';\" && createdb -O docker simplestv"

echo "Starting RabbitMQ server"
if [ ! -e /data/mnesia ]; then
    mkdir /data/mnesia
    chown -R rabbitmq:rabbitmq /data/mnesia
    chmod 0766 /data/mnesia
fi

echo "RABBITMQ_MNESIA_BASE=/data/mnesia" > /etc/rabbitmq/rabbitmq-env.conf
/etc/init.d/rabbitmq-server start

cd /app/backend

echo "Starting Celero worker"
rm *.pid
rm *.log
C_FORCE_ROOT=1 celery multi start w1 -A backend -l info

echo "Starting Django application"
python3.4 manage.py migrate --run-syncdb
uwsgi --socket :8001 --module backend.wsgi --daemonize /var/log/uwsgi.log

echo "Starting reverse proxy"
/etc/init.d/nginx start
