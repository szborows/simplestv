from __future__ import absolute_import
from celery import shared_task
from django.core.mail import send_mail
from backend import settings
from backend.utils import hash_email
from v1.models import *
import tempfile
import json

@shared_task
def send_emails(poll, recipients):
    body = """Hi, please use following link to see status of the poll.
    {}

    Thanks,
    SimpleSTV
    """.format('{0}/#/p/results/{1}'.format(settings.SIMPLESTV_URL, poll.secret))
    send_mail('Poll created', body, settings.DEFAULT_FROM_EMAIL, [poll.author_email], fail_silently=False)
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
def send_final_email_due_to_deadline(poll):
    body = """Hi, deadline for the pool has been reached.

    To see results of the poll please click on the following link.
    {}

    Thanks,
    SimpleSTV
    """.format('{0}/#/p/results/{1}'.format(settings.SIMPLESTV_URL, poll.secret))
    subject = 'SimpleSTV: poll results due to deadline'
    send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [poll.author_email], fail_silently=False)

@shared_task
def send_final_email_due_to_voter_turnover(poll):
    body = """Hi, apparently all of allowed voters already did vote.

    To see results of the poll please click on the following link.
    {}

    Thanks,
    SimpleSTV
    """.format('{0}/#/p/results/{1}'.format(settings.SIMPLESTV_URL, poll.secret))
    subject = 'SimpleSTV: poll results due to 100% voter turnover'
    send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [poll.author_email], fail_silently=False)

def getWinnersFromOpenStvOutput(output, choices):
    lines = output.split('\n')
    if len(lines) < 3:
        return None
    winner_indices = [int(x.strip()) for x in lines[-2].split(',')]
    return [{'id': choices[index].id, 'value': choices[index].value} for index in winner_indices]

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

    _, path = tempfile.mkstemp(prefix='simplestv', suffix='.out')
    from openstv.openstv.wrapped3 import run
    run(blt_path, path, poll.num_seats)

    with open(path) as fp:
        output = fp.read()

    winners = getWinnersFromOpenStvOutput(output, poll.ballot.choices.all())

    return json.dumps({
        'blt': content,
        'output': output,
        'winners': winners
    })

@shared_task
def run_final_election(poll):
    result = json.loads(run_election(poll))
    output = result['output']
    poll.output = output
    poll.winners = [
            poll.ballot.choices.get(id=id_) for id_ in [
                int(x['id']) for x in result['winners']
            ]
        ]
    poll.save()

@shared_task
def test_celery():
    return 997
