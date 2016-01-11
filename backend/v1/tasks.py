from __future__ import absolute_import
from celery import shared_task
from django.core.mail import send_mail
from backend import settings
from backend.utils import hash_email
import tempfile

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
def run_election(poll):
    def write_blt_file(poll):
        # TODO: someone might try to hack SimpleSTV here by preparing OpenSTV BLT file!
        #       analysis how to avoid this is needed!
        fd, path = tempfile.mkstemp(prefix='simplestv', suffix='.blt')
        fp = open(fd, 'w')
        fp.write('{0} {1}\n'.format(len(poll.ballot.choices.all()), poll.num_seats))
        # FIXME: again: naming is not right

        possible_choices = [c.id for c in poll.ballot.choices.all()]
        for ballot in Vote.objects.filter(poll=poll):
            preference = json.loads(ballot.choices_json)
            preference = [possible_choices.index(p) + 1 for p in preference]
            fp.write('1 {} 0\n'.format(' '.join(map(str, preference))))

        fp.write('0\n')

        for candidate in poll.ballot.choices.all():
            fp.write('"{}"\n'.format(candidate.value))

        fp.write('"{}"\n'.format(poll.ballot.question))
        fp.close()

        return path

    blt_path = write_blt_file(poll)
    with open(blt_path) as fp:
        content = fp.read()

    tasks.run_election.delay()

    _, path = tempfile.mkstemp(prefix='simplestv', suffix='.out')
    from openstv.openstv.wrapped3 import run
    run(blt_path, path, poll.num_seats)

    with open(path) as fp:
        output = fp.read()
        print(output)

    return {
        'blt': content,
        'output': output
    }


@shared_task
def test_celery():
    return 997
