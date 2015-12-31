from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.core.mail import send_mail
import http.client as http
import json
import hashlib
import random

from backend.hashids import Hashids
from v1.models import *

def hash_email(email):
    return hashlib.sha256(email.encode('utf-8')).hexdigest()

def secret():
    r = map(str, [random.randint(1, 10**4) for _ in range(10)])
    h = hashlib.sha256()
    for x in r:
        h.update(x.encode('ascii'))
    return h.hexdigest()

def send_emails(poll, recipients):
    body = """
        Hi,
        these links should work ;)
        {}
    """.format('\n'.join(['http://localhost:4242/#/p/{0}/{1}'.format(poll.hash_id, x.value) for x in poll.allowed_hashes.all()]))
    send_mail('subj', body, 'from@example.com', recipients, fail_silently=False)

def poll(request, poll_id):
    try:
        poll = Poll.objects.get(hash_id=poll_id)
        # PARANOID: possible fuckup - more than one object returned
    except Poll.DoesNotExist:
        return HttpResponse('', status=http.NOT_FOUND)
    try:
        key = request.GET['key']
    except KeyError:
        return HttpResponse('', status=http.BAD_REQUEST)

    try:
        print(poll.allowed_hashes.all())
        poll.allowed_hashes.get(value=key)
    except VotingHash.DoesNotExist:
        return HttpResponse('', status=http.UNAUTHORIZED)

    return JsonResponse(poll.json_dict())

def vote(request, poll_id):
    if request.method != 'POST':
        return HttpResponse('', status=http.BAD_REQUEST)
    try:
        poll = Poll.objects.get(hash_id=poll_id)
    except Poll.DoesNotExist:
        # this is POST, so maybe BAD_REQUEST?
        return HttpResponse('', status=http.NOT_FOUND)
    try:
        data = json.loads(request.body.decode('utf-8'))
        key = data['key']
        choices = [Choice.objects.get(id=x) for x in map(int, data['choices'])]
    except (TypeError, ValueError, KeyError, Choice.DoesNotExist):
        return HttpResponse('', status=http.BAD_REQUEST)

    try:
        voting_hash = poll.allowed_hashes.get(value=key)
    except VotingHash.DoesNotExist:
        return HttpResponse('', status=http.UNAUTHORIZED)

    # FIXME: naming in whole project is fucked up...

    v = Vote()
    v.poll = poll
    v.author = voting_hash
    v.choices_json = json.dumps([c.id for c in choices])
    v.save()

    poll.allowed_hashes.remove(voting_hash)
    poll.save()

    return JsonResponse({})

def create(request):
    if request.method != 'POST':
        return HttpResponse('', status=http.BAD_REQUEST)
    try:
        # PARANOID: is this safe?
        data = json.loads(request.body.decode('utf-8'))
        question = str(data['question'])
        choices = list(map(str, data['choices']))
        recipients = list(map(str, data['recipients']))
    except (TypeError, ValueError, KeyError):
        return HttpResponse('', status=http.BAD_REQUEST)

    ballot = Ballot()
    ballot.question = question
    ballot.save()

    for choice_text in choices:
        choice = Choice()
        choice.value = choice_text
        choice.save()
        ballot.choices.add(choice)

    ballot.save()

    poll = Poll()
    poll.ballot = ballot
    poll.recipients_json = json.dumps(recipients)
    poll.save()

    for recipient_text in recipients:
        recipient = VotingHash()
        recipient.value = hash_email(recipient_text)
        recipient.save()
        poll.allowed_hashes.add(recipient)

    poll.hash_id = Hashids().encode(poll.id)
    poll.secret = secret()
    poll.save()

    send_emails(poll, recipients)

    return JsonResponse({'id': poll.hash_id, 'secret': poll.secret})

def results(request, secret):
    try:
        poll = Poll.objects.get(secret=secret)
    except Poll.DoesNotExist:
        return HttpResponse('', status=http.NOT_FOUND)

    results = {
        'num_recipients': len(json.loads(poll.recipients_json)),
        'total_votes': len(Vote.objects.filter(poll=poll))
    }

    return JsonResponse({'poll': poll.json_dict(), 'results': results})
