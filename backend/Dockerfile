FROM django:1.9-python3

RUN apt-get update
RUN apt-get install -y screen python-celery
RUN apt-get install -y rabbitmq-server
# Development...
RUN apt-get install -y git vim

RUN pip3.4 install django-cors-headers
RUN pip3.4 install -e git+http://github.com/SmileyChris/django-mailer-2.git#egg=django-mailer-2
RUN pip3.4 install django-celery

EXPOSE 8000
ENTRYPOINT /app/run_backend.sh
