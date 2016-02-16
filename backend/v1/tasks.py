from __future__ import absolute_import
from celery import shared_task
from django.core.mail import send_mail
from backend import settings
from backend.utils import hash_email
from v1.models import *
import tempfile
import json
from django.template.loader import render_to_string
from django.template import Context

# TODO: send HTML alternative as well..
#       http://stackoverflow.com/questions/2809547/creating-email-templates-with-django

def _get_title(poll):
    max_title_length = 128
    return (lambda q: q[:max_title_length] + '...' * (len(q) >= max_title_length))(poll.question)

def _build_ctx(user_ctx):
    ctx = {
        'footer': """Thanks,
SimpleSTV - https://github.com/szborows/simplestv

(this email was generated automatically. please don't reply to it)"""
    }
    ctx.update(user_ctx)
    return Context(ctx)

def _send_email_to_poll_author(poll, num_recipients):
    title = _get_title(poll)
    ctx = _build_ctx({
        'title': title,
        'description': poll.description,
        'num_recipients': num_recipients,
        'deadline': str(poll.deadline),
        'url': '{0}/#/p/results/{1}'.format(settings.SIMPLESTV_URL, poll.secret)})
    body = render_to_string('poll_dashboard.txt', ctx)
    send_mail('Poll created: ' + title, body, settings.DEFAULT_FROM_EMAIL, [poll.author_email], fail_silently=False)

def _send_email_to_poll_recipient(poll, recipient):
    title = _get_title(poll)
    ctx = _build_ctx({
        'title': title,
        'description': poll.description,
        'deadline': poll.deadline,
        'author_email': poll.author_email, # TODO: add author displayName
        'url': '{0}/#/p/{1}/{2}'.format(
            settings.SIMPLESTV_URL,
            poll.hash_id,
            poll.allowed_hashes.get(value=hash_email(recipient)))})
    body = render_to_string('poll_invitation.txt', ctx)
    send_mail('Poll invitation: ' + title, body, settings.DEFAULT_FROM_EMAIL, [recipient], fail_silently=False)


@shared_task
def send_emails(poll, recipients):
    _send_email_to_poll_author(poll, len(recipients))
    for recipient in recipients:
        _send_email_to_poll_recipient(poll, recipient)
        if not poll.sent_emails_json:
            sent_emails = []
        else:
            sent_emails = json.loads(poll.sent_emails_json)
        sent_emails.append(recipient)
        poll.sent_emails_json = json.dumps(sent_emails)
        poll.save()

def _send_poll_close_email_to_author(poll, deadline):
    title = _get_title(poll)
    ctx = _build_ctx({
        'title': title,
        'description': poll.description,
        'deadline': deadline,
        'url': '{0}/#/p/results/{1}'.format(settings.SIMPLESTV_URL, poll.secret)})
    body = render_to_string('poll_closed.txt', ctx)
    send_mail('Poll closed: ' + title, body, settings.DEFAULT_FROM_EMAIL, [poll.author_email], fail_silently=False)

def _send_poll_failed_email_to_author(poll):
    title = _get_title(poll)
    ctx = _build_ctx({
        'title': title,
        'description': poll.description,
        'url': '{0}/#/p/results/{1}'.format(settings.SIMPLESTV_URL, poll.secret)})
    body = render_to_string('poll_failed.txt', ctx)
    send_mail('Poll failed: ' + title, body, settings.DEFAULT_FROM_EMAIL, [poll.author_email], fail_silently=False)

@shared_task
def send_final_email_due_to_deadline(poll):
    if poll.num_invited == len(poll.allowed_hashes.all()):
        _send_poll_failed_email_to_author(poll)
    else:
        _send_poll_close_email_to_author(poll, True)

@shared_task
def send_final_email_due_to_voter_turnover(poll):
    _send_poll_close_email_to_author(poll, False)

def getWinnersFromOpenStvOutput(output, choices):
    lines = output.split('\n')
    if len(lines) < 3:
        return None
    winner_indices = [int(x.strip()) for x in lines[-2].split(',')]
    return [{'id': choices[index].id, 'value': choices[index].value} for index in winner_indices]

@shared_task
def send_reminder(poll, poll_close_time_str):
    title = _get_title(poll)
    ctx = _build_ctx({
        'title': title,
        'description': poll.description,
        'deadline': deadline,
        'author_email': poll.author_email, # TODO: add author displayName
        'poll_close_time_str': poll_close_time_str,
        'url': '{0}/#/p/results/{1}'.format(settings.SIMPLESTV_URL, poll.secret)})
    body = render_to_string('poll_reminder.txt', ctx)
    all_ = json.loads(poll.recipients_json)
    voted = json.loads(poll.voted_json)
    for r in all_:
        if r not in voted:
            send_mail('Poll reminder: ' + title, body, settings.DEFAULT_FROM_EMAIL, [poll.author_email], fail_silently=False)

@shared_task
def run_election(poll):
    def write_blt_file(poll):
        # TODO: someone might try to hack SimpleSTV here by preparing OpenSTV BLT file!
        #       analysis how to avoid this is needed!
        fd, path = tempfile.mkstemp(prefix='simplestv', suffix='.blt')
        fp = open(fd, 'w')
        fp.write('{0} {1}\n'.format(len(poll.choices.all()), poll.num_seats))

        possible_choices = [c.id for c in poll.choices.all()]
        for ballot in Vote.objects.filter(poll=poll):
            preference = json.loads(ballot.choices_json)
            preference = [possible_choices.index(p) + 1 for p in preference]
            fp.write('1 {} 0\n'.format(' '.join(map(str, preference))))

        fp.write('0\n')

        for candidate in poll.choices.all():
            fp.write('"{}"\n'.format(candidate.value))

        fp.write('"{}"\n'.format(poll.question))
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

    winners = getWinnersFromOpenStvOutput(output, poll.choices.all())

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
            poll.choices.get(id=id_) for id_ in [
                int(x['id']) for x in result['winners']
            ]
        ]
    poll.save()

@shared_task
def test_celery():
    return 997
