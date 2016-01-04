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
    """.format('\n'.join(['{0}/#/p/{1}/{2}'.format(settings.SIMPLESTV_URL , poll.hash_id, x.value) for x in poll.allowed_hashes.all()]))
    send_mail('[simplestv-dev] subj', body, settings.DEFAULT_FROM_EMAIL, recipients, fail_silently=False)

@shared_task
def run_election():
    return 42
