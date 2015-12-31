FROM django:1.9-python3

RUN apt-get update

RUN pip3.4 install django-cors-headers
RUN pip3.4 install django-mailer

RUN mkdir /data

RUN echo "cd /app && echo \"from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'pass')\" | python3.4 manage.py shell" >> /tmp/createsuperuser
RUN chmod a+x /tmp/createsuperuser

RUN echo "cd /app && python3.4 manage.py migrate --run-syncdb && /tmp/createsuperuser && python3.4 manage.py runserver 0.0.0.0:8000" >> /tmp/start
RUN chmod a+x /tmp/start

EXPOSE 8000
ENTRYPOINT /tmp/start
