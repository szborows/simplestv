FROM django:1.9-python3

MAINTAINER sławomir.zborowski@nokia.com

RUN apt-get update
RUN apt-get install -y vim-tiny git screen
RUN apt-get install -y rabbitmq-server
RUN apt-get install -y python-celery
RUN apt-get install -y nginx

RUN pip3.4 install django-cors-headers
RUN pip3.4 install -e git+http://github.com/SmileyChris/django-mailer-2.git#egg=django-mailer-2
RUN pip3.4 install django-celery

RUN pip3.4 install uwsgi

RUN apt-get install -y nodejs npm
RUN npm install -g webpack-dev-server
RUN ln -s /usr/bin/nodejs /usr/bin/node

COPY prod-all.conf /etc/nginx/sites-enabled/simplestv
COPY uwsgi_params /etc/nginx/uwsgi_params
COPY run.sh /tmp/run.sh
RUN rm /etc/nginx/sites-enabled/default

ENTRYPOINT /tmp/run.sh
