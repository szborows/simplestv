from __future__ import absolute_import
from celery import shared_task
from django.core.mail import send_mail
from backend import settings
from backend.utils import hash_email

@shared_task
def send_emails(poll, recipients):
    for recipient in recipients:
        body = """Hi, please vote using following link
            {}

            Thanks,
            SimpleSTV

            (please don't reply to this email)
        """.format(
                '{0}/#/p/{1}/{2}'.format(
                    settings.SIMPLESTV_URL,
                    poll.hash_id,
                    poll.allowed_hashes.get(value=hash_email(recipient))
                )
        )
        print('** should now send email from ' + str(settings.DEFAULT_FROM_EMAIL) + ' to ' + str(recipient))
        send_mail('Invitation to STV poll', body, settings.DEFAULT_FROM_EMAIL, [recipient], fail_silently=False)

@shared_task
def run_election():
    return 42
