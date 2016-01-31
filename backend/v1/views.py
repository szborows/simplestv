from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
import django
from django.core.validators import EmailValidator
import http.client as http
import json
import time
from datetime import datetime, timedelta
import celery
from celery.result import AsyncResult
from django.core.urlresolvers import reverse

from backend.hashids import Hashids
from v1.models import *
import v1.tasks as tasks
from backend.utils import hash_email, secret

class HttpResponseSeeOther(HttpResponseRedirect):
    status_code = http.SEE_OTHER

def poll(request, poll_id):
    try:
        poll = Poll.objects.get(hash_id=poll_id)
    except Poll.DoesNotExist:
        return HttpResponse(status=http.NOT_FOUND)
    except Poll.MultipleObjectsReturned:
        return HttpResponse(status=http.CONFLICT)
    try:
        key = request.GET['key']
    except KeyError:
        return HttpResponse(status=http.BAD_REQUEST)

    try:
        poll.allowed_hashes.get(value=key)
    except VotingHash.DoesNotExist:
        return HttpResponse(status=http.UNAUTHORIZED)

    if poll.deadline < datetime.now():
        return HttpResponse('it\'s too late', status=http.FORBIDDEN)

    return JsonResponse(poll.json_dict())

def _close_poll(poll):
    # FIXME: `celery.chain` with `task.si` should be used, but there were weird
    #        problems when I tried to do so. must definitely come back to this.
    tasks.run_final_election.delay(poll)
    tasks.send_final_email_due_to_voter_turnover.delay(poll)

def _setup_future_poll_tasks(poll):
    tasks.send_final_email_due_to_deadline.apply_async((poll, ), eta=poll.deadline)
    tasks.run_final_election.apply_async((poll, ), eta=poll.deadline)

def vote(request, poll_id):
    if request.method != 'POST':
        return HttpResponse(status=http.BAD_REQUEST)
    try:
        poll = Poll.objects.get(hash_id=poll_id)
    except Poll.DoesNotExist:
        # this is POST, so maybe BAD_REQUEST?
        return HttpResponse(status=http.NOT_FOUND)
    try:
        data = json.loads(request.body.decode('utf-8'))
        key = data['key']
        choices = [Choice.objects.get(id=x) for x in map(int, data['choices'])]
    except (TypeError, ValueError, KeyError, Choice.DoesNotExist):
        return HttpResponse(status=http.BAD_REQUEST)

    try:
        voting_hash = poll.allowed_hashes.get(value=key)
    except VotingHash.DoesNotExist:
        return HttpResponse(status=http.UNAUTHORIZED)

    # FIXME: naming in whole project is fucked up...

    v = Vote()
    v.poll = poll
    v.author = voting_hash
    v.choices_json = json.dumps([c.id for c in choices])
    v.save()

    poll.allowed_hashes.remove(voting_hash)
    poll.save()

    if not len(poll.allowed_hashes.all()):
        _close_poll(poll)

    return JsonResponse({})

def create(request):
    if request.method != 'POST':
        return HttpResponse(status=http.BAD_REQUEST)
    try:
        # PARANOID: is this safe?
        data = json.loads(request.body.decode('utf-8'))
        question = str(data['question'])
        description = str(data['description'])
        choices = list(map(str, [d for d in data['choices'] if len(d.strip())]))
        num_seats = int(data['num_seats'])
        recipients = list(
                set( # for uniqueness
                    map(str, [d for d in data['recipients'] if len(d.strip())])
                )
        )
        deadline = datetime.fromtimestamp(time.mktime(time.strptime(data['deadline'], '%Y-%m-%d')))
        author_email = data['author_email']
        EmailValidator()(author_email)
    except (TypeError, ValueError, KeyError, django.core.exceptions.ValidationError):
        return HttpResponse(status=http.BAD_REQUEST)

    poll = Poll()
    poll.question = question
    poll.num_seats = num_seats
    poll.description = description
    poll.recipients_json = json.dumps(recipients)
    poll.num_invited = len(recipients)
    poll.deadline = deadline
    poll.author_email = author_email
    poll.save()

    for choice_text in choices:
        choice = Choice()
        choice.value = choice_text
        choice.save()
        poll.choices.add(choice)

    for recipient_text in recipients:
        recipient = VotingHash()
        recipient.value = hash_email(recipient_text)
        recipient.save()
        poll.allowed_hashes.add(recipient)

    poll.hash_id = Hashids().encode(poll.id)
    poll.secret = secret()
    poll.save()

    tasks.send_emails.delay(poll, recipients)

    _setup_future_poll_tasks(poll)

    return JsonResponse({'id': poll.hash_id, 'secret': poll.secret})

def results(request, secret):
    try:
        poll = Poll.objects.get(secret=secret)
    except Poll.DoesNotExist:
        return HttpResponse(status=http.NOT_FOUND)

    results = {
        'num_recipients': len(json.loads(poll.recipients_json)),
        'total_votes': len(Vote.objects.filter(poll=poll))
    }

    return JsonResponse({'poll': poll.json_dict(), 'results': results})

def run_election(request, poll_id, secret):
    try:
        poll = Poll.objects.get(hash_id=poll_id)
    except Poll.DoesNotExist:
        return HttpResponse(status=http.BAD_REQUEST)
    if secret != poll.secret:
        return HttpResponse(status=http.UNAUTHORIZED)
    if len(poll.allowed_hashes.all()) == poll.num_invited:
        return HttpResponse(status=http.CONFLICT)

    task_id = tasks.run_election.delay(poll)
    return JsonResponse({'task_id': str(task_id.id)}, status=http.ACCEPTED)

def run_election_result(request, task_id):
    task = AsyncResult(task_id)
    if not task.ready():
        return HttpResponse(status=http.BAD_REQUEST)
    # TODO: should also consider 410 Gone
    result = json.loads(task.get())
    return JsonResponse(result)

def run_election_status(request, task_id):
    task = AsyncResult(task_id)
    if task.ready():
        return HttpResponseSeeOther(reverse(run_election_result, args=[task_id]))
    return JsonResponse({})
