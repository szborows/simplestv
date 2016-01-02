FROM django:1.9-python3

RUN apt-get update
RUN apt-get install -y screen python-celery
RUN apt-get install -y rabbitmq-server

RUN pip3.4 install django-cors-headers
RUN pip3.4 install django-mailer
RUN pip3.4 install django-celery

EXPOSE 8000
ENTRYPOINT /app/run_backend.sh
