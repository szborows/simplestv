from __future__ import absolute_import
from celery import shared_task
from django.core.mail import send_mail
from backend import settings

@shared_task
def send_emails(poll, recipients):
    body = """
        Hi,
        these links should work ;)
        {}
    """.format('\n'.join(['http://localhost:4242/#/p/{0}/{1}'.format(poll.hash_id, x.value) for x in poll.allowed_hashes.all()]))
    print(settings.DEFAULT_FROM_EMAIL)
    print(recipients)
    send_mail('subj', body, settings.DEFAULT_FROM_EMAIL, recipients, fail_silently=False)

@shared_task
def run_election():
    pass
