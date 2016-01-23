FROM django:1.9-python3

MAINTAINER sławomir.zborowski@nokia.com

RUN apt-get update
RUN apt-get install -y vim-tiny git screen
RUN apt-get install -y rabbitmq-server
RUN apt-get install -y python-celery
RUN apt-get install -y nginx
RUN apt-get install -y postgresql-9.4
RUN apt-get install -y nodejs npm

RUN pip3.4 install django-cors-headers
RUN pip3.4 install -e git+http://github.com/SmileyChris/django-mailer-2.git#egg=django-mailer-2
RUN pip3.4 install django-celery
RUN pip3.4 install psycopg2
RUN pip3.4 install uwsgi

RUN npm install -g webpack-dev-server
RUN ln -s /usr/bin/nodejs /usr/bin/node

COPY prod-all-plain.conf /etc/nginx/sites-available/simplestv-plain
COPY prod-all-https.conf /etc/nginx/sites-available/simplestv-https
COPY uwsgi_params /etc/nginx/uwsgi_params
COPY run.sh /tmp/run.sh
RUN rm /etc/nginx/sites-enabled/default

USER postgres
RUN /etc/init.d/postgresql start && psql --command "CREATE USER docker WITH SUPERUSER password 'docker';" && createdb -O docker simplestv

USER root

ENTRYPOINT /tmp/run.sh
